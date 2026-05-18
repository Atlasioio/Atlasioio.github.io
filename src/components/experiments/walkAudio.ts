// Audio for The Walk Home — mix of:
//   (A) a real audio file looped as ambient music (drop into /public/audio/),
//   (B) Tone.js for the most musical SFX (shooting star, fix success, bench sit),
//       and raw Web Audio for textural SFX (steps, lamp buzz, cat purr/scratch,
//       fix charge tone, lighter ignite, light break).
// Lazy-init on first user gesture to satisfy browser autoplay policy.

import * as Tone from "tone";

type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

export class WalkAudio {
  ctx: AudioContext;
  master: GainNode;
  toneOut: GainNode; // Tone synths route through this into master
  private toneInitialized = false;
  private targetMaster = 0.55;
  private ambient?: { stop: () => void };
  private ambientGain?: GainNode;
  private buzz?: { gain: GainNode };
  private purr?: { stop: () => void };
  private charge?: {
    osc: OscillatorNode;
    filter: BiquadFilterNode;
    gain: GainNode;
    crackleSrc: AudioBufferSourceNode;
    crackleFilter: BiquadFilterNode;
    crackleGain: GainNode;
  };

  constructor() {
    const Ctor =
      window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
    if (!Ctor) throw new Error("Web Audio not supported");
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.targetMaster;
    this.master.connect(this.ctx.destination);

    // Dedicated bus for Tone.js synths so they share the master gain (mute toggle).
    this.toneOut = this.ctx.createGain();
    this.toneOut.gain.value = 1;
    this.toneOut.connect(this.master);
  }

  private async ensureTone() {
    if (this.toneInitialized) return;
    // Make Tone use our existing AudioContext so we share mute control + state.
    Tone.setContext(this.ctx);
    await Tone.start();
    this.toneInitialized = true;
  }

  // SFX buffer cache for one-shot sound effects from /public/audio/...
  private sfxBuffers: Record<string, AudioBuffer | null> = {};

  private async loadSfx(key: string, url: string): Promise<AudioBuffer | null> {
    if (this.sfxBuffers[key] !== undefined) return this.sfxBuffers[key];
    try {
      const res = await fetch(url);
      if (!res.ok) {
        this.sfxBuffers[key] = null;
        return null;
      }
      const buf = await res.arrayBuffer();
      const decoded = await this.ctx.decodeAudioData(buf.slice(0));
      this.sfxBuffers[key] = decoded;
      return decoded;
    } catch {
      this.sfxBuffers[key] = null;
      return null;
    }
  }

  private playSfx(buffer: AudioBuffer, gain = 0.55) {
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    source.connect(g).connect(this.master);
    source.start();
  }

  async playLighterOn() {
    const buf = await this.loadSfx(
      "lighter-on",
      "/audio/the-walk-home/lighter-on.mp3",
    );
    if (buf) this.playSfx(buf, 0.55);
    else this.lighterIgnite();
  }

  async playLighterOff() {
    const buf = await this.loadSfx(
      "lighter-off",
      "/audio/the-walk-home/lighter-off.mp3",
    );
    if (buf) this.playSfx(buf, 0.55);
  }

  async playMeow() {
    const buf = await this.loadSfx(
      "meow",
      "/audio/the-walk-home/meow.mp3",
    );
    if (buf) this.playSfx(buf, 0.6);
  }

  async playLampRepaired() {
    const buf = await this.loadSfx(
      "lamp-repaired",
      "/audio/the-walk-home/lamp-repaired.mp3",
    );
    if (buf) this.playSfx(buf, 0.6);
    else this.fixSuccess();
  }

  resume() {
    if (this.ctx.state !== "running") this.ctx.resume().catch(() => {});
  }

  setMuted(muted: boolean) {
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.linearRampToValueAtTime(
      muted ? 0 : this.targetMaster,
      t + 0.18,
    );
  }

  /** Set listener volume 0–100 (linear). Persists into targetMaster so unmute restores it. */
  setVolume(percent: number, muted = false) {
    const clamped = Math.max(0, Math.min(100, percent));
    const linear = clamped / 100;
    // Map 0-100 to a sensible audio range. Original default targetMaster is ~0.5 at 100%.
    this.targetMaster = linear * 0.5;
    if (!muted) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(this.targetMaster, t + 0.12);
    }
  }

  /**
   * Try to load and loop an audio file (e.g. /audio/ambient.mp3). If the file
   * isn't available or fails to decode, falls back to a synthesized pad so the
   * page is never silent.
   */
  async startAmbient(fileUrl?: string) {
    if (this.ambient) return;
    if (fileUrl) {
      const ok = await this.loadAndLoop(fileUrl).catch(() => false);
      if (ok) return;
    }
    this.startSynthAmbient();
  }

  private async loadAndLoop(url: string): Promise<boolean> {
    const response = await fetch(url);
    if (!response.ok) return false;
    const buffer = await response.arrayBuffer();
    const decoded = await this.ctx.decodeAudioData(buffer.slice(0));

    const source = this.ctx.createBufferSource();
    source.buffer = decoded;
    source.loop = true;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    // Smooth fade-in
    gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 1.2);

    source.connect(gain).connect(this.master);
    source.start();

    this.ambientGain = gain;
    this.ambient = {
      stop: () => {
        const stopT = this.ctx.currentTime;
        gain.gain.cancelScheduledValues(stopT);
        gain.gain.linearRampToValueAtTime(0, stopT + 0.4);
        try {
          source.stop(stopT + 0.5);
        } catch {}
      },
    };
    return true;
  }

  private startSynthAmbient() {
    if (this.ambient) return;
    const t = this.ctx.currentTime;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.7;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.05;

    const oscs: OscillatorNode[] = [];
    [130.81, 261.63, 329.63, 392.0, 493.88, 587.33].forEach((f) => {
      const o = this.ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.004);
      o.connect(filter);
      o.start(t);
      oscs.push(o);
    });

    const shimmer = this.ctx.createOscillator();
    shimmer.type = "triangle";
    shimmer.frequency.value = 783.99;
    const shimmerGain = this.ctx.createGain();
    shimmerGain.gain.value = 0.008;
    shimmer.connect(shimmerGain).connect(filter);
    shimmer.start(t);
    oscs.push(shimmer);

    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.06;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start(t);
    oscs.push(lfo);

    filter.connect(gain).connect(this.master);

    this.ambient = {
      stop: () => {
        oscs.forEach((o) => {
          try {
            o.stop();
          } catch {}
        });
      },
    };
  }

  setBuzzVolume(v: number) {
    if (!this.buzz) {
      const o = this.ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = 100;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 220;
      const gain = this.ctx.createGain();
      gain.gain.value = 0;
      o.connect(filter).connect(gain).connect(this.master);
      o.start();
      this.buzz = { gain };
    }
    const target = Math.max(0, Math.min(1, v)) * 0.085;
    const t = this.ctx.currentTime;
    this.buzz.gain.gain.cancelScheduledValues(t);
    this.buzz.gain.gain.linearRampToValueAtTime(target, t + 0.18);
  }

  startPurr() {
    if (this.purr) return;
    const t = this.ctx.currentTime;

    // Fundamental + 2nd harmonic for a fuller purr that small speakers can carry
    const o1 = this.ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.value = 110;
    const o2 = this.ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = 220;

    const o2Gain = this.ctx.createGain();
    o2Gain.gain.value = 0.45;

    const gain = this.ctx.createGain();
    const base = 0.085;
    gain.gain.value = base;

    // Subtle slow tremolo — kept well below the base level so the gain never
    // crosses zero (which was producing buzzy AM sidebands / "static")
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 7.5;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = base * 0.45;

    // Soft low-pass to take the bite off harmonics so the purr feels woolly
    const lp = this.ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 380;
    lp.Q.value = 0.6;

    lfo.connect(lfoGain).connect(gain.gain);
    o1.connect(gain);
    o2.connect(o2Gain).connect(gain);
    gain.connect(lp).connect(this.master);

    o1.start(t);
    o2.start(t);
    lfo.start(t);

    this.purr = {
      stop: () => {
        const stopTime = this.ctx.currentTime;
        gain.gain.cancelScheduledValues(stopTime);
        gain.gain.linearRampToValueAtTime(0, stopTime + 0.3);
        try {
          o1.stop(stopTime + 0.4);
        } catch {}
        try {
          o2.stop(stopTime + 0.4);
        } catch {}
        try {
          lfo.stop(stopTime + 0.4);
        } catch {}
      },
    };
  }

  stopPurr() {
    this.purr?.stop();
    this.purr = undefined;
  }

  step() {
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(85, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.07);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.14);
  }

  async shootingStar() {
    await this.ensureTone();

    const reverb = new Tone.Reverb({ decay: 5, wet: 0.55, preDelay: 0.05 });
    await reverb.generate();

    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.04, decay: 0.4, sustain: 0.15, release: 2.6 },
      volume: -14,
    });

    // Route Tone synth through reverb → our Web Audio bus (so mute still works)
    synth.connect(reverb);
    Tone.connect(reverb, this.toneOut);

    const start = Tone.now();
    const notes = ["C5", "E5", "G5", "A5", "C6", "E6"];
    notes.forEach((n, i) => {
      synth.triggerAttackRelease(n, "1n", start + i * 0.16);
    });
    // Lingering high finish
    synth.triggerAttackRelease("C7", "1n", start + notes.length * 0.16 + 0.1);

    window.setTimeout(() => {
      try {
        synth.dispose();
        reverb.dispose();
      } catch {}
    }, 7000);
  }

  async fixSuccess() {
    await this.ensureTone();

    const reverb = new Tone.Reverb({ decay: 2.4, wet: 0.35 });
    await reverb.generate();

    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.25, sustain: 0.15, release: 1.6 },
      volume: -12,
    });
    synth.connect(reverb);
    Tone.connect(reverb, this.toneOut);

    const start = Tone.now();
    ["C5", "E5", "G5", "C6"].forEach((n, i) => {
      synth.triggerAttackRelease(n, "2n", start + i * 0.05);
    });

    window.setTimeout(() => {
      try {
        synth.dispose();
        reverb.dispose();
      } catch {}
    }, 4000);
  }

  fixFail() {
    const t = this.ctx.currentTime;
    const sampleRate = this.ctx.sampleRate;

    // Brief electric fizzle (the energy collapsing)
    const buf = this.ctx.createBuffer(1, 0.18 * sampleRate, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] =
        (Math.random() * 2 - 1) * 0.5 * Math.exp(-i / (sampleRate * 0.06));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const fizzleFilter = this.ctx.createBiquadFilter();
    fizzleFilter.type = "bandpass";
    fizzleFilter.Q.value = 4;
    fizzleFilter.frequency.setValueAtTime(2200, t);
    fizzleFilter.frequency.exponentialRampToValueAtTime(380, t + 0.16);
    const ng = this.ctx.createGain();
    ng.gain.value = 0.07;
    noise.connect(fizzleFilter).connect(ng).connect(this.master);
    noise.start(t);

    // Sad descending tone (the lamp fades)
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(140, t + 0.04);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.5);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.07, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    o.connect(g).connect(this.master);
    o.start(t + 0.04);
    o.stop(t + 0.6);
  }

  startCharge() {
    if (this.charge) return;

    // Tonal layer: rising sawtooth that gets brighter with charge
    const o = this.ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = 200;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 4;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    o.connect(filter).connect(gain).connect(this.master);
    o.start();

    // Electric crackle layer: looping pink-ish noise through bandpass — opens
    // up and gets louder as the meter fills, making the "almost there" feel.
    const sampleRate = this.ctx.sampleRate;
    const noiseBuf = this.ctx.createBuffer(1, 2 * sampleRate, sampleRate);
    const data = noiseBuf.getChannelData(0);
    let b0 = 0,
      b1 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      // Lightweight pink filter
      b0 = 0.99 * b0 + 0.0555 * white;
      b1 = 0.96 * b1 + 0.2 * white;
      data[i] = (b0 + b1) * 0.6;
    }
    const crackleSrc = this.ctx.createBufferSource();
    crackleSrc.buffer = noiseBuf;
    crackleSrc.loop = true;
    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = "bandpass";
    crackleFilter.frequency.value = 800;
    crackleFilter.Q.value = 2.5;
    const crackleGain = this.ctx.createGain();
    crackleGain.gain.value = 0;
    crackleSrc.connect(crackleFilter).connect(crackleGain).connect(this.master);
    crackleSrc.start();

    this.charge = {
      osc: o,
      filter,
      gain,
      crackleSrc,
      crackleFilter,
      crackleGain,
    };
  }

  setChargeLevel(level: number) {
    if (!this.charge) return;
    const t = this.ctx.currentTime;
    const freq = 200 + level * 800;
    const cutoff = 600 + level * 1500;
    this.charge.osc.frequency.cancelScheduledValues(t);
    this.charge.filter.frequency.cancelScheduledValues(t);
    this.charge.gain.gain.cancelScheduledValues(t);
    this.charge.osc.frequency.linearRampToValueAtTime(freq, t + 0.04);
    this.charge.filter.frequency.linearRampToValueAtTime(cutoff, t + 0.04);
    this.charge.gain.gain.linearRampToValueAtTime(level * 0.04, t + 0.04);

    // Crackle scales nonlinearly — quiet at low charge, loud near full
    const crackleAmount = Math.pow(level, 1.6);
    this.charge.crackleFilter.frequency.cancelScheduledValues(t);
    this.charge.crackleGain.gain.cancelScheduledValues(t);
    this.charge.crackleFilter.frequency.linearRampToValueAtTime(
      900 + crackleAmount * 1800,
      t + 0.04,
    );
    this.charge.crackleGain.gain.linearRampToValueAtTime(
      crackleAmount * 0.06,
      t + 0.04,
    );
  }

  stopCharge() {
    if (!this.charge) return;
    const { osc, gain, crackleSrc, crackleGain } = this.charge;
    const t = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.linearRampToValueAtTime(0, t + 0.06);
    crackleGain.gain.cancelScheduledValues(t);
    crackleGain.gain.linearRampToValueAtTime(0, t + 0.06);
    try {
      osc.stop(t + 0.1);
    } catch {}
    try {
      crackleSrc.stop(t + 0.1);
    } catch {}
    this.charge = undefined;
  }

  lightBreak() {
    const t = this.ctx.currentTime;
    const sampleRate = this.ctx.sampleRate;

    // === 1) Initial pop / electric snap ===
    const popBuf = this.ctx.createBuffer(1, 0.05 * sampleRate, sampleRate);
    const popData = popBuf.getChannelData(0);
    for (let i = 0; i < popData.length; i++) {
      popData[i] =
        (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.012));
    }
    const pop = this.ctx.createBufferSource();
    pop.buffer = popBuf;
    const popHpf = this.ctx.createBiquadFilter();
    popHpf.type = "highpass";
    popHpf.frequency.value = 2400;
    const popGain = this.ctx.createGain();
    popGain.gain.value = 0.16;
    pop.connect(popHpf).connect(popGain).connect(this.master);
    pop.start(t);

    // === 2) Shatter / glass burst ===
    const buf = this.ctx.createBuffer(1, 0.6 * sampleRate, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const hpf = this.ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 800;
    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0, t + 0.02);
    ng.gain.linearRampToValueAtTime(0.18, t + 0.04);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    noise.connect(hpf).connect(ng).connect(this.master);
    noise.start(t + 0.02);

    // === 3) Descending fundamental (the buzz dying out) ===
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(420, t + 0.02);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.7);
    const og = this.ctx.createGain();
    og.gain.setValueAtTime(0.1, t + 0.02);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    o.connect(og).connect(this.master);
    o.start(t + 0.02);
    o.stop(t + 0.8);

    // === 4) Sizzle tail (electricity dying) ===
    const tailBuf = this.ctx.createBuffer(1, 0.9 * sampleRate, sampleRate);
    const tailData = tailBuf.getChannelData(0);
    for (let i = 0; i < tailData.length; i++) {
      tailData[i] =
        (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.4));
    }
    const tail = this.ctx.createBufferSource();
    tail.buffer = tailBuf;
    const tailBp = this.ctx.createBiquadFilter();
    tailBp.type = "bandpass";
    tailBp.Q.value = 3;
    tailBp.frequency.setValueAtTime(2400, t + 0.05);
    tailBp.frequency.exponentialRampToValueAtTime(420, t + 0.9);
    const tailGain = this.ctx.createGain();
    tailGain.gain.setValueAtTime(0, t + 0.05);
    tailGain.gain.linearRampToValueAtTime(0.05, t + 0.1);
    tailGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.95);
    tail.connect(tailBp).connect(tailGain).connect(this.master);
    tail.start(t + 0.05);
  }

  lighterIgnite() {
    const t = this.ctx.currentTime;
    const sampleRate = this.ctx.sampleRate;

    // === 1) Wheel flick (bandpassed noise rising in frequency) ===
    const flickBuf = this.ctx.createBuffer(1, 0.06 * sampleRate, sampleRate);
    const flickData = flickBuf.getChannelData(0);
    for (let i = 0; i < flickData.length; i++) {
      flickData[i] = Math.random() * 2 - 1;
    }
    const flick = this.ctx.createBufferSource();
    flick.buffer = flickBuf;
    const flickBp = this.ctx.createBiquadFilter();
    flickBp.type = "bandpass";
    flickBp.Q.value = 6;
    flickBp.frequency.setValueAtTime(700, t);
    flickBp.frequency.linearRampToValueAtTime(2400, t + 0.05);
    const flickGain = this.ctx.createGain();
    flickGain.gain.setValueAtTime(0.09, t);
    flickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    flick.connect(flickBp).connect(flickGain).connect(this.master);
    flick.start(t);

    // === 2) Spark click (chirp from high to mid) ===
    const click = this.ctx.createOscillator();
    click.type = "sine";
    click.frequency.setValueAtTime(2600, t + 0.05);
    click.frequency.exponentialRampToValueAtTime(700, t + 0.16);
    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0, t + 0.05);
    clickGain.gain.linearRampToValueAtTime(0.06, t + 0.07);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    click.connect(clickGain).connect(this.master);
    click.start(t + 0.05);
    click.stop(t + 0.2);

    // === 3) Flame catch (warm low-passed whoosh) ===
    const whooshBuf = this.ctx.createBuffer(1, 0.45 * sampleRate, sampleRate);
    const whooshData = whooshBuf.getChannelData(0);
    for (let i = 0; i < whooshData.length; i++) {
      whooshData[i] = Math.random() * 2 - 1;
    }
    const whoosh = this.ctx.createBufferSource();
    whoosh.buffer = whooshBuf;
    const whooshLp = this.ctx.createBiquadFilter();
    whooshLp.type = "lowpass";
    whooshLp.frequency.setValueAtTime(280, t + 0.08);
    whooshLp.frequency.linearRampToValueAtTime(900, t + 0.22);
    whooshLp.frequency.exponentialRampToValueAtTime(220, t + 0.5);
    const whooshGain = this.ctx.createGain();
    whooshGain.gain.setValueAtTime(0, t + 0.08);
    whooshGain.gain.linearRampToValueAtTime(0.09, t + 0.18);
    whooshGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.5);
    whoosh.connect(whooshLp).connect(whooshGain).connect(this.master);
    whoosh.start(t + 0.08);
  }

  doorUnlock() {
    const t = this.ctx.currentTime;

    // Two key clicks (turning + retracting)
    [
      { freq: 1300, at: 0, gain: 0.06 },
      { freq: 720, at: 0.16, gain: 0.07 },
    ].forEach(({ freq, at, gain }) => {
      const o = this.ctx.createOscillator();
      o.type = "square";
      o.frequency.value = freq;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(gain, t + at);
      g.gain.exponentialRampToValueAtTime(0.001, t + at + 0.05);
      const lp = this.ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2400;
      o.connect(lp).connect(g).connect(this.master);
      o.start(t + at);
      o.stop(t + at + 0.06);
    });

    // Soft confirming chime after the second click
    const chime = this.ctx.createOscillator();
    chime.type = "triangle";
    chime.frequency.value = 880;
    const cg = this.ctx.createGain();
    cg.gain.setValueAtTime(0, t + 0.22);
    cg.gain.linearRampToValueAtTime(0.045, t + 0.25);
    cg.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
    chime.connect(cg).connect(this.master);
    chime.start(t + 0.22);
    chime.stop(t + 0.9);
  }

  benchSit() {
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 220;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.04, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.8);
  }

  catScratch() {
    const t = this.ctx.currentTime;
    const sampleRate = this.ctx.sampleRate;

    // Hiss / scratch noise
    const buf = this.ctx.createBuffer(1, 0.32 * sampleRate, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] =
        (Math.random() * 2 - 1) * 0.7 * Math.exp(-i / (sampleRate * 0.09));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    bp.Q.value = 2.4;
    const g = this.ctx.createGain();
    g.gain.value = 0.16;
    noise.connect(bp).connect(g).connect(this.master);
    noise.start(t);

    // Quick descending hiss for the "ssst" feel
    const o = this.ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(900, t);
    o.frequency.exponentialRampToValueAtTime(200, t + 0.18);
    const og = this.ctx.createGain();
    og.gain.setValueAtTime(0.06, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    const lp = this.ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1500;
    o.connect(lp).connect(og).connect(this.master);
    o.start(t);
    o.stop(t + 0.25);
  }

  dispose() {
    try {
      this.ambient?.stop();
      this.purr?.stop();
      this.ctx.close();
    } catch {}
  }
}
