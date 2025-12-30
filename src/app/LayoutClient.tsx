"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import TopNavbar from "./components/TopNavbar/TopNavbar";
import NavbarCommon from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import DashboardLayoutClient from "./dashboard/DashboardLayoutClient";
import PageTransition from "./components/PageTransition/PageTransition";
import { useAppDispatch, useAppSelector } from "@/base/redux/hook";
import { getWishlistCountApi, getWishlistApi } from "@/base/utils/api/wishlist";
import { setWishlistCount, setWishlistProducts, clearWishlist } from "@/base/redux/features/wishlistSlice";
import authStorage from "@/base/storage/auth";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  
  // Fetch wishlist count and products when user is logged in
  useEffect(() => {
    const fetchWishlistData = async () => {
      if (authStorage.authenticated() && user?.id) {
        try {
          const [count, products] = await Promise.all([
            getWishlistCountApi(),
            getWishlistApi()
          ]);
          dispatch(setWishlistCount({ totalCount: count }));
          // Sync product IDs to Redux state
          if (Array.isArray(products)) {
            const productIds = products.map(p => p.id);
            dispatch(setWishlistProducts({ productIds }));
          }
        } catch (error) {
          // Error fetching wishlist data
        }
      } else {
        // Clear wishlist when user logs out
        dispatch(clearWishlist());
      }
    };

    fetchWishlistData();
  }, [user?.id, dispatch]);
  
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

