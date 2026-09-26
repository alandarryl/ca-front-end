import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Company Audit AI | Générateur d'Audits d'Entreprise",
  description: "Générez des audits d'entreprises complets et personnalisés en quelques secondes grâce à l'IA pour vos entretiens et études de marché.",
  keywords: ["Audit Entreprise", "Préparation Entretien", "Intelligence Artificielle", "FastAPI", "Next.js"],
  authors: [{ name: "Ton Nom" }],
  openGraph: {
    title: "Company Audit AI — Préparez vos entretiens avec l'IA",
    description: "Analyse automatisée d'entreprises, synthèse stratégique et exportation PDF instantanée.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}