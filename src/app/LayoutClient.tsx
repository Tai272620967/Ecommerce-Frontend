"use client";

import { usePathname } from "next/navigation";
import TopNavbar from "./components/TopNavbar/TopNavbar";
import NavbarCommon from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import DashboardLayoutClient from "./dashboard/DashboardLayoutClient";
import PageTransition from "./components/PageTransition/PageTransition";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we're on a dashboard route
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  // If on dashboard route, use dashboard layout
  if (isDashboardRoute) {
    return (
      <>
        <PageTransition />
        <DashboardLayoutClient>
          {children}
        </DashboardLayoutClient>
      </>
    );
  }

  // Otherwise, use normal layout
  return (
    <>
      <PageTransition />
      <TopNavbar />
      <NavbarCommon />
      <main>{children}</main>
      <Footer />
    </>
  );
}

