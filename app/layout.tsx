import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";

export const metadata: Metadata = {
  title: "Nhà đẹp quá",
  description: "Bất động sản, mua bán nhà đất",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
