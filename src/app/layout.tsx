"use client";
import './globals.css'
import VisitorTracker from "./components/VisitorTracker";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <VisitorTracker/>
        {children}
      </body>
    </html>
  );
}