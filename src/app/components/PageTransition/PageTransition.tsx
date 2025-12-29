"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import "./PageTransition.scss";

export default function PageTransition() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathnameRef = useRef<string>(pathname);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setProgress(0);

    // Clear any existing intervals/timeouts
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (completeTimeoutRef.current) {
      clearTimeout(completeTimeoutRef.current);
    }

    // Simulate progress - faster at start, slower near end
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return 90; // Stop at 90% until page loads
        }
        const increment = prev < 50 ? 15 : prev < 80 ? 8 : 3;
        return Math.min(prev + increment, 90);
      });
    }, 30);
  }, []);

  const completeLoading = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    setProgress(100);
    completeTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 150);
  }, []);

  useEffect(() => {
    // Intercept all link clicks (including Next.js Link components)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const currentUrl = new URL(window.location.href);
          
          // Only intercept internal navigation
          if (
            url.origin === currentUrl.origin && 
            url.pathname !== currentUrl.pathname &&
            !link.hasAttribute("download") &&
            !link.hasAttribute("target")
          ) {
            startLoading();
          }
        } catch (error) {
          // Invalid URL, ignore
        }
      }
    };

    // Also listen for popstate (browser back/forward)
    const handlePopState = () => {
      startLoading();
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [startLoading]);

  useEffect(() => {
    // Handle pathname changes (when page actually loads)
    if (prevPathnameRef.current && prevPathnameRef.current !== pathname) {
      // Start loading if not already started (for programmatic navigation like router.push)
      if (!loading) {
        startLoading();
      }
      // Complete loading when pathname changes
      completeLoading();
    }

    // Update previous pathname
    prevPathnameRef.current = pathname;
  }, [pathname, loading, startLoading, completeLoading]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (completeTimeoutRef.current) {
        clearTimeout(completeTimeoutRef.current);
      }
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="page-transition">
      <div 
        className="page-transition__progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

