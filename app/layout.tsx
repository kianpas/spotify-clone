import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Spotify Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar>{children}</Sidebar>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
