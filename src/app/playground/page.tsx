import {
  Briefcase,
  Envelope,
  Flask,
  User,
} from "@phosphor-icons/react/dist/ssr";
import { WhereToNext } from "@/components/WhereToNext";
import { PlaygroundList } from "./playground-list";

export const metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <>
      <section className="mx-auto max-w-full md:max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pt-14 md:pt-20 pb-10 md:pb-14">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-6 flex items-center gap-2">
          <Flask weight="fill" className="size-3.5" /> Playground
        </p>
        <h1 className="display-tight text-display-lg leading-[0.92]">
          Tinkering,
          <br />
          out loud<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 max-w-[60ch] text-lg text-fg-muted leading-relaxed">
          Experimental, very interactive things. Each tile is a different
          category — typography, audio, cursor, generative. Click in for the
          full version.
        </p>
      </section>

      <PlaygroundList />

      <WhereToNext
        links={[
          { href: "/work", label: "See selected work", Icon: Briefcase },
          { href: "/about", label: "Learn more about me", Icon: User },
          { href: "/contact", label: "Get in touch", Icon: Envelope },
        ]}
      />
    </>
  );
}
