import type { Metadata } from "next";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

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
        <Footer />
      </body>
    </html>
  );
}
