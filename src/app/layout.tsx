import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { auth } from "../auth";

export const metadata: Metadata = {
  title: "EcoMatch | AI Food Rescue",
  description: "Instantly bridging the gap between surplus inventory and community need.",
  icons: {
    icon: "/images/logo/Logo_Ecomatch_Baru-removebg-preview.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en">
      <body className="antialiased min-h-screen w-full flex flex-col">
        <Navbar 
          userName={user?.name ?? undefined}
          userRole={user?.role?.toLowerCase() as any}
          businessName={user?.role === "MERCHANT" ? user.name ?? undefined : undefined}
        />
        <main className="flex-grow w-full flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}