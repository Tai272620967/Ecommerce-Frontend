"use client";

// DashboardLayoutClient already handles AdminGuard, so we don't need to wrap here
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

