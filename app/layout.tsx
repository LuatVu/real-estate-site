import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
