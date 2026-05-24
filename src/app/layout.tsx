import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Bricolage_Grotesque,
  Bebas_Neue,
  Playfair_Display,
  Cinzel,
  Orbitron,
  Monoton,
  Uncial_Antiqua,
  Major_Mono_Display,
  Codystar,
  UnifrakturMaguntia,
  Audiowide,
  MedievalSharp,
  Cinzel_Decorative,
  Inter,
} from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const monoton = Monoton({
  variable: "--font-monoton",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const uncial = Uncial_Antiqua({
  variable: "--font-uncial",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const majorMono = Major_Mono_Display({
  variable: "--font-major-mono",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const codystar = Codystar({
  variable: "--font-codystar",
  weight: ["300", "400"],
  subsets: ["latin"],
  display: "swap",
});

const unifraktur = UnifrakturMaguntia({
  variable: "--font-unifraktur",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const audiowide = Audiowide({
  variable: "--font-audiowide",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const medievalSharp = MedievalSharp({
  variable: "--font-medieval",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-deco",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lukasahlse.com"),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Product designer based in Malmö, Sweden. Previously UX at Sony. BSc in Interaction Design.",
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en",
    title: `${site.name} — ${site.role}`,
    description:
      "Product designer based in Malmö. Selected work, experiments, and notes.",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description:
      "Product designer based in Malmö. Selected work, experiments, and notes.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e0c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${playfair.variable} ${bebas.variable} ${cinzel.variable} ${orbitron.variable} ${monoton.variable} ${uncial.variable} ${majorMono.variable} ${codystar.variable} ${unifraktur.variable} ${audiowide.variable} ${medievalSharp.variable} ${cinzelDecorative.variable} ${inter.variable} antialiased`}
    >
      <body className="bg-bg text-fg min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
