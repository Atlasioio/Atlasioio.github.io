import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Briefcase,
  CalendarCheck,
  Envelope,
  GraduationCap,
  Globe,
  LinkedinLogo,
  MapPin,
  Phone,
  Translate,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";
import { DownloadCVButton } from "./DownloadCVButton";
import { ShareCVButton } from "./ShareCVButton";

export const metadata = { title: "CV — Lukas Ahlse" };

const experience: {
  company: string;
  role: string;
  dates: string;
  location: string;
  bullets: string[];
}[] = [
  {
    company: "Sony / Nimway",
    role: "UX Designer",
    dates: "2025 — 2026",
    location: "Malmö, Sweden",
    bullets: [
      "Designed UX/UI across the smart-office product line — meeting room panels, booking app, web, and large-format wayfinding maps — used across enterprises in multiple countries.",
      "Led several end-to-end product flows — research, IA, high-fidelity UI, and testing on actual hardware in real office spaces.",
      "Worked closely with PMs and engineers — aligning design intent with build constraints.",
    ],
  },
  {
    company: "Lenus eHealth",
    role: "Student Content Assistant",
    dates: "2022 — 2023",
    location: "Copenhagen, Denmark",
    bullets: [
      "Localised nutrition, food, and fitness content for the Swedish market — recipes, leaflets, and short-form video.",
    ],
  },
];

const education: {
  school: string;
  qualification: string;
  dates: string;
  note?: string;
}[] = [
  {
    school: "Malmö University",
    qualification: "BSc, Interaction Design",
    dates: "2021 — 2024",
  },
  {
    school: "ITU Copenhagen",
    qualification: "Supplementary studies — Java OOP · Agile development · Discrete math",
    dates: "2024 — 2025",
  },
  {
    school: "Linköping & Scotland",
    qualification: "Business · Economics · Software engineering",
    dates: "2018 — 2020",
  },
];

const toolGroups: { title: string; items: string }[] = [
  { title: "Design", items: "Figma · Framer · Adobe Suite · Photo & video" },
  { title: "Code", items: "HTML · CSS · JavaScript" },
  { title: "AI", items: "Claude Code · Lovable · Midjourney · Cursor · v0" },
  { title: "Workflow", items: "Notion · Miro · FigJam · Slack" },
];

const languages: { name: string; level: string }[] = [
  { name: "Swedish", level: "Native" },
  { name: "English", level: "Native-level" },
];

export default function CVPage() {
  return (
    <div className="cv-shell">
      <Link href="/" className="cv-back-link">
        <ArrowLeft weight="bold" className="cv-back-icon" />
        Back to portfolio
      </Link>
      <div className="cv-paper">
        {/* Header */}
        <header className="cv-header">
          <div className="cv-header-text">
            <h1 className="cv-name">
              Lukas
              <br />
              Ahlse<span className="text-accent">.</span>
            </h1>
          </div>

          <div className="cv-header-meta">
            <p className="cv-role">Product Designer · Malmö, Sweden</p>
            <p className="cv-tagline">
              Curious by default — happiest where craft, the why&rsquo;s, and
              problem-solving overlap.
            </p>
          </div>
        </header>

        {/* Contact strip */}
        <ul className="cv-contact">
          <li>
            <a href={`mailto:${site.email}`} className="cv-contact-item">
              <Envelope weight="fill" className="cv-contact-icon" />
              {site.email}
            </a>
          </li>
          <li>
            <a href={`tel:${site.phone}`} className="cv-contact-item">
              <Phone weight="fill" className="cv-contact-icon" />
              +46 706 17 98 98
            </a>
          </li>
          <li>
            <a
              href="https://lukasahlse.com"
              target="_blank"
              rel="noreferrer"
              className="cv-contact-item"
            >
              <Globe weight="fill" className="cv-contact-icon" />
              lukasahlse.com
            </a>
          </li>
          <li>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="cv-contact-item"
            >
              <LinkedinLogo weight="fill" className="cv-contact-icon" />
              lukas-ahlse
            </a>
          </li>
          <li>
            <span className="cv-contact-item">
              <MapPin weight="fill" className="cv-contact-icon" />
              Malmö, SE
            </span>
          </li>
        </ul>

        {/* Body */}
        <main className="cv-body">
          <div className="cv-main">
            <section className="cv-section">
              <h2 className="cv-section-title">
                <Briefcase weight="fill" className="cv-section-icon" />
                Experience
              </h2>
              <ul className="cv-stack">
                {experience.map((job) => (
                  <li key={job.company} className="cv-job">
                    <div className="cv-job-head">
                      <h3 className="cv-job-company">
                        {job.company}
                        <span className="text-accent">.</span>
                      </h3>
                      <p className="cv-job-role">{job.role}</p>
                      <p className="cv-job-meta">
                        <span>{job.dates}</span>
                        <span aria-hidden className="cv-job-dot">·</span>
                        <span>{job.location}</span>
                      </p>
                    </div>
                    <ul className="cv-bullets">
                      {job.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>

            <section className="cv-section">
              <h2 className="cv-section-title">
                <GraduationCap weight="fill" className="cv-section-icon" />
                Education
              </h2>
              <ul className="cv-stack cv-stack-compact">
                {education.map((edu) => (
                  <li key={edu.school} className="cv-edu">
                    <h3 className="cv-edu-school">
                      {edu.school}
                      <span className="text-accent">.</span>
                    </h3>
                    <p className="cv-edu-qual">{edu.qualification}</p>
                    <p className="cv-edu-dates">{edu.dates}</p>
                    {edu.note && <p className="cv-edu-note">{edu.note}</p>}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="cv-aside">
            <section className="cv-section">
              <h2 className="cv-section-title">
                <Wrench weight="fill" className="cv-section-icon" />
                Tools
              </h2>
              <ul className="cv-tools">
                {toolGroups.map((g) => (
                  <li key={g.title} className="cv-tools-group">
                    <p className="cv-tools-title">{g.title}</p>
                    <p className="cv-tools-items">{g.items}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="cv-section">
              <h2 className="cv-section-title">
                <Translate weight="fill" className="cv-section-icon" />
                Languages
              </h2>
              <ul className="cv-langs">
                {languages.map((l) => (
                  <li key={l.name}>
                    <span className="cv-lang-name">{l.name}</span>
                    <span aria-hidden className="cv-job-dot">·</span>
                    <span className="cv-lang-level">{l.level}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="cv-section">
              <h2 className="cv-section-title">
                <CalendarCheck weight="fill" className="cv-section-icon" />
                Availability
              </h2>
              <div className="cv-avail">
                <p className="cv-avail-line">
                  <span className="cv-avail-dot" aria-hidden />
                  <span className="cv-avail-strong">Available now</span>
                </p>
                <p className="cv-avail-note">
                  Full-time or freelance · Open to relocate
                </p>
              </div>
            </section>

            <section className="cv-section cv-qr-section">
              <div className="cv-qr-row">
                <div className="cv-qr">
                  <QRCodeSVG
                    value="https://lukasahlse.com"
                    size={64}
                    bgColor="transparent"
                    fgColor="currentColor"
                    level="M"
                  />
                </div>
                <div className="cv-qr-text">
                  <p className="cv-qr-kicker">Scan for portfolio</p>
                  <p className="cv-qr-url">
                    lukasahlse<span className="text-accent">.</span>com
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </main>
      </div>

      <div className="cv-actions">
        <DownloadCVButton />
        <ShareCVButton />
      </div>
    </div>
  );
}
