import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Altavex AI OS",
  description: "The intelligent command centre for Altavex Group.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
