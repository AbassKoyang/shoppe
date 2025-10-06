import type { Metadata } from "next";
import QueryProvider from "@/lib/tanstackConfig";
import { Maiden_Orange, Nunito_Sans, Raleway } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/lib/contexts/auth-context";
import {ToastContainer} from 'react-toastify'
import TransitionProvider from "@/lib/transition-provider";
import Navbar from "@/components/Navbar";

const raleway = Raleway({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const nunitosans = Nunito_Sans({subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-nunito-sans',});

export const metadata: Metadata = {
  title: "Shopee",
  description: "The next gen shopping app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${nunitosans.variable} antialiased`}
      >
        {/* <TransitionProvider> */}
            <AuthProvider>
            <QueryProvider>
                <main className="w-full min-h-dvh relative">
                  {children}
                  {/* <Navbar /> */}
                </main>
            </QueryProvider>
            </AuthProvider>
            <ToastContainer/>
           {/* </TransitionProvider> */}
      </body>
    </html>
  );
}
