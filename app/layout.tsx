import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ainov — Ruang Menulis",
  description: "Ruang kerja pribadi bersama agen penulis Ainov.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
