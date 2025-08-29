import type { Metadata } from "next";
import QueryProvider from "@/lib/tanstackConfig";
import { Raleway } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/lib/contexts/auth-context";
import {ToastContainer} from 'react-toastify'
import TransitionProvider from "@/lib/transition-provider";

const raleway = Raleway({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
        className={`${raleway.variable} antialiased`}
      >
        <TransitionProvider>
            <AuthProvider>
            <QueryProvider>
                {children}
            </QueryProvider>
            </AuthProvider>
            <ToastContainer/>
           </TransitionProvider>
      </body>
    </html>
  );
}
