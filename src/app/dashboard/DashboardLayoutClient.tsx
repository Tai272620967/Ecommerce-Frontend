"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import SideBar from "./components/SideBar/SideBar";
import HeaderDashboard from "./components/Header/Header";
import AdminGuard from "./components/AdminGuard";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Only render SideBar and Header if we're actually on a dashboard route
  // This prevents SideBar from showing when redirecting to home
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  // If not on dashboard route, don't render anything - let the normal layout handle it
  // This happens when user is redirected from dashboard to home
  if (!isDashboardRoute) {
    // Return children directly without AdminGuard to avoid blocking
    // The normal root layout should handle this route
    return <>{children}</>;
  }

  // Only wrap with AdminGuard if we're on a dashboard route
  return (
    <AdminGuard>
      <div className="dashboard-layout">
        <SideBar />
        <main className="dashboard-layout__main">
          <HeaderDashboard />
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}

