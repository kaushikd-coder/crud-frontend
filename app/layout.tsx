import ThemeWatcher from "./(dashboard)/ThemeWatcher";
import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MERN Assignment",
  description: "Next.js + Tailwind + Redux Toolkit",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeWatcher />
          {children}
        </Providers>
      </body>
    </html>
  );
}
