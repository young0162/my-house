import type { Metadata } from "next";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import Container from "@/components/Common/Container";
import "@/styles/global.scss";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "My House",
  description: "",
};

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Header />
        <Container>{children}</Container>
        <Footer />
      </body>
    </html>
  );
}
