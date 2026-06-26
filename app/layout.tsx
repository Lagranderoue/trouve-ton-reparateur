import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trouve ton réparateur — Réparateurs de téléphones près de chez vous",
  description: "Trouvez un réparateur de téléphone vérifié et certifié près de chez vous. Plus de 2 000 réparateurs partout en France.",
  openGraph: {
    title: "Trouve ton réparateur",
    description: "Trouvez un réparateur de téléphone vérifié et certifié près de chez vous.",
    url: "https://trouvetonreparateur.com",
    siteName: "Trouve ton réparateur",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
