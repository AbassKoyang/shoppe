import type { Metadata } from "next";
import QueryProvider from "@/lib/tanstackConfig";
import { Maiden_Orange, Nunito_Sans, Raleway } from "next/font/google";
import AuthProvider from "@/lib/contexts/auth-context";
import {ToastContainer} from 'react-toastify'
import TransitionProvider from "@/lib/transition-provider";
import Navbar from "@/components/Navbar";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { NotificationProvider } from "@/lib/NotificationProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { MobileNotificationPrompt } from "@/components/MobileNotificationPrompt";
import { Toaster } from "@/components/ui/sonner";


const raleway = Raleway({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const nunitosans = Nunito_Sans({subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-nunito-sans',});

export const metadata: Metadata = {
  title: "Shopee",
  description: "The Next Gen Clothing Markeplace",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shopee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
        <head>
        <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon-512.png" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Shoppee" />
          <meta name="theme-color" content="#004CFF" />
        </head>
      <body
        className={`${raleway.variable} ${nunitosans.variable} antialiased`}
      >
        {/* <TransitionProvider> */}
           <AuthProvider>
            <QueryProvider>
                <main className="w-full min-h-dvh relative">
                <NotificationProvider>
                  <MobileNotificationPrompt />
                  {children}
                  <Navbar />
                  <ServiceWorkerRegister/>
                  </NotificationProvider>
                  <Toaster
                  richColors
                  position='top-center'
                  duration={5000}
                  theme="dark"
                  />
                </main>
            </QueryProvider>
            </AuthProvider>
            <ToastContainer/>
           {/* </TransitionProvider> */}
      </body>
    </html>
  );
}
