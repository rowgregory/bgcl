import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { SessionProvider } from "next-auth/react";
// import { auth } from "@/auth";
import ReduxWrapper from "./redux-wrapper";

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
  children: React.ReactNode;
}>) {
  // const session = await auth();
  const initialData = { users: [] };
  const error = null;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <SessionProvider session={session}>*/}
        <ReduxWrapper initialData={initialData} error={error}>
          {children}
        </ReduxWrapper>
        {/*  </SessionProvider> */}
      </body>
    </html>
  );
}
