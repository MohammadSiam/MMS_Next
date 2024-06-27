import Loading from "@/components/Loading";
import NavBar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manage a meeting",
  description: "Schedule a meeting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <AuthProvider>
            <NavBar />
            {children}
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
