import type { Metadata } from "next";
import Header from "@/components/Common/Header";

export const metadata: Metadata = {
  title: "My House",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
