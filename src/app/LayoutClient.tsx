"use client";

import { usePathname } from "next/navigation";
import TopNavbar from "./components/TopNavbar/TopNavbar";
import NavbarCommon from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import DashboardLayoutClient from "./dashboard/DashboardLayoutClient";

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
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    );
  }

  // Otherwise, use normal layout
  return (
    <>
      <TopNavbar />
      <NavbarCommon />
      <main>{children}</main>
      <Footer />
    </>
  );
}

