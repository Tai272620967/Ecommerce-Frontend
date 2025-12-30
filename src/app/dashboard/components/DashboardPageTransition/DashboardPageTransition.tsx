"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./DashboardPageTransition.scss";

export default function DashboardPageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div
      className={`dashboard-page-transition ${
        isTransitioning ? "dashboard-page-transition--fade-out" : "dashboard-page-transition--fade-in"
      }`}
    >
      {displayChildren}
    </div>
  );
}

