import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { SessionProvider } from "next-auth/react";
// import { auth } from "@/auth";
import ReduxWrapper from "./redux-wrapper";
import { getActiveHero } from "./lib/actions/getActiveHero";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boys and Girls Club of Lynn",
  description:
    "A full stack web application built for the Boys & Girls Club of Lynn to streamline member management, events, and resources, improving communication and engagement between staff, youth, and the community.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // const session = await auth();
  const hero = await getActiveHero();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <SessionProvider session={session}>*/}
        <ReduxWrapper data={{ hero }}>{children}</ReduxWrapper>
        {/*  </SessionProvider> */}
      </body>
    </html>
  );
}
