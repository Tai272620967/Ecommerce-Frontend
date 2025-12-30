"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/base/types/Product";
import { getWishlistApi, removeFromWishlistApi } from "@/base/utils/api/wishlist";
import { getImageUrl } from "@/base/utils/imageUrl";
import { convertToNumberFormat } from "@/base/utils";
import { message } from "antd";
import authStorage from "@/base/storage/auth";
import { useAppDispatch, useAppSelector } from "@/base/redux/hook";
import { removeFromWishlist, setWishlistCount } from "@/base/redux/features/wishlistSlice";
import "./page.scss";
import { ProductGridSkeleton } from "../components/Skeleton/ProductSkeleton";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authStorage.authenticated()) {
      router.push("/auth/login");
      return;
    }
    
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const wishlistProducts = await getWishlistApi();
      // Ensure wishlistProducts is always an array
      const productsArray = Array.isArray(wishlistProducts) ? wishlistProducts : [];
      setProducts(productsArray);
      dispatch(setWishlistCount({ totalCount: productsArray.length }));
    } catch (error) {
      message.error("Failed to fetch wishlist");
      setProducts([]);
      dispatch(setWishlistCount({ totalCount: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await removeFromWishlistApi(productId);
      setProducts(products.filter((p) => p.id !== productId));
      dispatch(removeFromWishlist({ productId }));
      message.success("Product removed from wishlist");
    } catch (error) {
      message.error("Failed to remove product from wishlist");
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page__wrapper">
        <div className="wishlist-page__title">
          <h1>My Wishlist</h1>
        </div>
        <div className="wishlist-page__content">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page__wrapper">
      <div className="wishlist-page__title">
        <h1>My Wishlist</h1>
        {products.length > 0 && (
          <p className="wishlist-page__subtitle">{products.length} item(s)</p>
        )}
      </div>
      <div className="wishlist-page__content">
        {products.length === 0 ? (
          <div className="wishlist-page__empty">
            <p>Your wishlist is empty.</p>
            <button
              className="wishlist-page__empty-button"
              onClick={() => router.push("/products")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-page__products">
            {products.map((product) => (
              <div key={product.id} className="wishlist-page__product-card">
                <div
                  className="wishlist-page__product-image"
                  onClick={() => router.push(`/product/detail/${product.id}`)}
                >
                  <Image
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    width={300}
                    height={300}
                    unoptimized
                  />
                  <button
                    className="wishlist-page__remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(product.id);
                    }}
                    aria-label="Remove from wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#d26d69"
                      stroke="#d26d69"
                    >
                      <path d="M14.63 2.047c-3.47-.433-4.498 2.226-4.68 2.846 0 .035-.057.035-.068 0-.194-.621-1.21-3.28-4.681-2.846-4.407.551-5.251 6.185-2.98 8.844 1.541 1.792 5.913 6.325 7.295 7.766a.534.534 0 0 0 .776 0l7.306-7.766c2.226-2.507 1.427-8.293-2.968-8.832v-.012z"></path>
                    </svg>
                  </button>
                </div>
                <div className="wishlist-page__product-info">
                  <h3
                    className="wishlist-page__product-name"
                    onClick={() => router.push(`/product/detail/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="wishlist-page__product-description">
                    {product.description}
                  </p>
                  <div className="wishlist-page__product-price">
                    <span className="wishlist-page__product-price-value">
                      {convertToNumberFormat(product.minPrice)}
                    </span>
                    <span className="wishlist-page__product-price-unit">$</span>
                    {product.maxPrice && product.maxPrice !== product.minPrice && (
                      <>
                        <span className="wishlist-page__product-price-separator">-</span>
                        <span className="wishlist-page__product-price-value">
                          {convertToNumberFormat(product.maxPrice)}
                        </span>
                        <span className="wishlist-page__product-price-unit">$</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

