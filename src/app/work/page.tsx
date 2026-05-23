import {
  Briefcase,
  Envelope,
  Flask,
  User,
} from "@phosphor-icons/react/dist/ssr";
import { WhereToNext } from "@/components/WhereToNext";
import { WorkList } from "./work-list";

export const metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <>
      <section className="mx-auto max-w-[min(75vw,1400px)] w-full px-5 md:px-8 pt-14 md:pt-20 pb-10 md:pb-14">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted mb-6 flex items-center gap-2">
          <Briefcase weight="fill" className="size-3.5" /> Selected work
        </p>
        <h1 className="display-tight text-display-lg leading-[0.92]">
          Apps, websites
          <br />
          &amp; brands<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 max-w-[60ch] text-lg text-fg-muted leading-relaxed">
          A mix of coursework, self-initiated concepts, and one paid client
          piece. Each one taught me something I&rsquo;m still using.
        </p>
      </section>

      <WorkList />

      <WhereToNext
        links={[
          { href: "/contact", label: "Get in touch", Icon: Envelope },
          { href: "/about", label: "Learn more about me", Icon: User },
          { href: "/playground", label: "Laboratory", Icon: Flask },
        ]}
      />
    </>
  );
}
