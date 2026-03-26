import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#10b981",
};

export const metadata: Metadata = {
  title: "GolfGive — Play. Win. Give Back.",
  description: "A subscription-driven golf platform combining performance tracking, monthly prize draws, and charitable giving. Enter scores, win prizes, support charities.",
  keywords: "golf, charity, subscription, prize draw, stableford, scores, give back",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GolfGive",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
