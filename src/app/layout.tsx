import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amlan Jyoti Bora | Full-stack AI Developer",
  description:
    "Full-stack AI developer crafting scalable web apps, from idea to production.",
  metadataBase: new URL("https://amlan.live")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
