"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/base/redux/hook";
import { addToWishlistApi, removeFromWishlistApi, checkWishlistApi } from "@/base/utils/api/wishlist";
import { addToWishlist, removeFromWishlist } from "@/base/redux/features/wishlistSlice";
import { message } from "antd";
import authStorage from "@/base/storage/auth";

interface WishlistButtonProps {
  productId: number;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, className = "" }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const wishlist = useAppSelector((state) => state.wishlist);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Reset to false when productId changes
    setIsInWishlist(false);
    
    // Check if product is in wishlist when component mounts
    if (authStorage.authenticated()) {
      checkWishlistStatus();
    } else {
      setIsInWishlist(false);
    }
  }, [productId]);

  // Also check Redux state for quick updates
  useEffect(() => {
    if (wishlist?.productIds && Array.isArray(wishlist.productIds)) {
      const inWishlist = wishlist.productIds.includes(productId);
      setIsInWishlist(inWishlist);
    }
  }, [wishlist?.productIds, productId]);

  const checkWishlistStatus = async () => {
    try {
      const inWishlist = await checkWishlistApi(productId);
      // Ensure we set a proper boolean value
      setIsInWishlist(Boolean(inWishlist));
    } catch (error) {
      // Error checking wishlist status - default to false
      setIsInWishlist(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent product card click

    // Check if user is logged in
    if (!authStorage.getAccessToken() || !user?.id) {
      message.warning("Please login to add items to wishlist");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlistApi(productId);
        setIsInWishlist(false);
        dispatch(removeFromWishlist({ productId }));
        message.success("Product removed from wishlist");
      } else {
        await addToWishlistApi(productId);
        setIsInWishlist(true);
        dispatch(addToWishlist({ productId }));
        message.success("Product added to wishlist");
      }
    } catch (error) {
      message.error("Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`product__list__item__desc__heart-button ${className}`}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <span className="product__list__item__desc__heart-button-image">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill={isInWishlist ? "#d26d69" : "#FFFFFF"}
          stroke={isInWishlist ? "#d26d69" : "#E0CEAA"}
          color={isInWishlist ? "#d26d69" : "#FFFFFF"}
        >
          <path d="M14.63 2.047c-3.47-.433-4.498 2.226-4.68 2.846 0 .035-.057.035-.068 0-.194-.621-1.21-3.28-4.681-2.846-4.407.551-5.251 6.185-2.98 8.844 1.541 1.792 5.913 6.325 7.295 7.766a.534.534 0 0 0 .776 0l7.306-7.766c2.226-2.507 1.427-8.293-2.968-8.832v-.012z"></path>
        </svg>
      </span>
    </button>
  );
};

export default WishlistButton;

