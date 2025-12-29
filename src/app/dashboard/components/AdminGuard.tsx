"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/base/redux/hook";
import authStorage from "@/base/storage/auth";
import { getLoggedAccountApi } from "@/base/utils/api/auth";
import { setLoggedAccount } from "@/base/redux/features/authSlice";
import { getRoleFromToken } from "@/base/utils/jwt";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Check if user is authenticated
      const isAuthenticated = authStorage.authenticated();
      
      if (!isAuthenticated) {
        setShouldRedirect(true);
        // Use replace instead of push to avoid adding to history
        router.replace("/auth/login");
        return;
      }

      // Try to get role from JWT token first (faster)
      const accessToken = authStorage.getAccessToken();
      let userRole: string | null = null;
      
      if (accessToken) {
        userRole = getRoleFromToken(accessToken);
      }

      // If role is USER (default), try to fetch from API to get accurate role
      if (!userRole || userRole === "USER") {
        try {
          const accountData = await getLoggedAccountApi();
          
          // Handle different response structures
          const userData = accountData?.user || accountData?.data?.user || accountData;
          
          if (userData && (userData.id || userData.email)) {
            userRole = userData.role || null;
            const userId = userData.id?.toString() || userData.id || "";
            const userEmail = userData.email || "";
            
            // If still no role, try to get from token again
            if (!userRole && accessToken) {
              userRole = getRoleFromToken(accessToken);
            }
            
            // Default to USER if still no role
            userRole = userRole || "USER";
            
            dispatch(setLoggedAccount({
              user: {
                id: userId,
                name: userEmail || userId,
                email: userEmail,
                role: userRole,
              },
              accessToken: accessToken || "",
            }));
          }
        } catch (error) {
          // If error, try to get role from token
          if (accessToken) {
            userRole = getRoleFromToken(accessToken) || "USER";
          } else {
            userRole = "USER";
          }
        }
      }

      // Final role check - also check if userRole is still null or USER
      const finalRole = userRole || "USER";
      
      if (finalRole !== "ADMIN") {
        setShouldRedirect(true);
        // Use replace instead of push to avoid adding to history
        router.replace("/");
        return;
      }
      
      setIsChecking(false);
    };

    checkAdminAccess();
  }, [router, dispatch]);

  // Don't render anything if redirecting
  if (shouldRedirect) {
    return null;
  }

  // Show loading while checking
  if (isChecking) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Checking access...</p>
      </div>
    );
  }

  // Allow access if checking is complete (isChecking is false means check passed)
  // Don't rely on Redux user state as it might not be updated yet
  // The role check is already done in useEffect above
  return <>{children}</>;
}

