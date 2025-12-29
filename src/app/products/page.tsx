"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/base/types/Product";
import { fetchAllProductApi } from "@/base/utils/api/product";
import { getImageUrl } from "@/base/utils/imageUrl";
import { convertToNumberFormat } from "@/base/utils";
import "./page.scss";
import "../product/components/Product.scss";

const AllProductsPage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    // Infinite scroll setup
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading]);

  const fetchProducts = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetchAllProductApi(pageNum, 20);
      
      if (response) {
        let productsData: Product[] = [];
        
        // Handle different response structures
        if (Array.isArray(response.result)) {
          productsData = response.result;
        } else if ((response as any).data && Array.isArray((response as any).data.result)) {
          productsData = (response as any).data.result;
        } else if (Array.isArray(response)) {
          productsData = response;
        }
        
        if (pageNum === 1) {
          setProducts(productsData);
        } else {
          setProducts((prev) => [...prev, ...productsData]);
        }
        
        // Check if there are more pages
        if (response.meta) {
          setTotalResults(response.meta.total || 0);
          setHasMore(pageNum < (response.meta.pages || 1));
        } else {
          // If no meta, assume no more if less than page size
          setHasMore(productsData.length >= 20);
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  return (
    <div className="product__wrapper">
      <div className="product">
        <div className="product__title">All Products</div>
        {totalResults > 0 && (
          <div style={{ marginTop: "16px", fontSize: "14px", color: "#6d6d72" }}>
            Showing {products.length} of {totalResults} products
          </div>
        )}

        {products.length === 0 && !loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "#6d6d72" }}>
            <p>No products found.</p>
          </div>
        ) : (
          <>
            <div className="product__list__wrapper">
              {loading && products.length === 0 && (
                <div style={{ padding: "20px", textAlign: "center" }}>Loading products...</div>
              )}
              {products.length > 0 && (
                <div className="product__list__table">
                  <div className="product__list">
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        className={`product__list__inner${
                          index !== products.length - 1 ? "-wrapper" : ""
                        }`}
                        onClick={() => router.push(`/product/detail/${product.id}`)}
                      >
                        <div className="product__list__item">
                          <div className="product__list__item__image">
                            <Image
                              src={getImageUrl(product.imageUrl)}
                              alt={product.name}
                              width={320}
                              height={320}
                              unoptimized
                            />
                          </div>
                          <div className="product__list__item__desc">
                            <div className="product__list__item__desc__name">
                              <p>{product.name}</p>
                            </div>
                            <div className="product__list__item__desc__price__wrapper">
                              <div className="product__list__item__desc__price">
                                <span className="product__list__item__desc__price__value">
                                  <span className="product__list__item__desc__price__value__number">
                                    {convertToNumberFormat(product.minPrice)}
                                  </span>
                                  <span className="product__list__item__desc__price__value__unit">
                                    $
                                  </span>
                                </span>
                                {product.maxPrice && product.maxPrice !== product.minPrice && (
                                  <>
                                    <span className="product__list__item__desc__price__tilde">
                                      〜
                                    </span>
                                    <span className="product__list__item__desc__price__value">
                                      <span className="product__list__item__desc__price__value__number">
                                        {convertToNumberFormat(product.maxPrice)}
                                      </span>
                                      <span className="product__list__item__desc__price__value__unit">
                                        $
                                      </span>
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="product__list__item__desc__heart-button__wrapper">
                                <button
                                  type="button"
                                  className="product__list__item__desc__heart-button"
                                >
                                  <span className="product__list__item__desc__heart-button-image">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="20"
                                      fill="#FFFFFF"
                                      stroke="#E0CEAA"
                                      color="#FFFFFF"
                                    >
                                      <path d="M14.63 2.047c-3.47-.433-4.498 2.226-4.68 2.846 0 .035-.057.035-.068 0-.194-.621-1.21-3.28-4.681-2.846-4.407.551-5.251 6.185-2.98 8.844 1.541 1.792 5.913 6.325 7.295 7.766a.534.534 0 0 0 .776 0l7.306-7.766c2.226-2.507 1.427-8.293-2.968-8.832v-.012z"></path>
                                    </svg>
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {loading && products.length > 0 && (
              <div className="loader__wrapper">
                <div className="loader"></div>
              </div>
            )}

            {hasMore && (
              <div ref={observerRef} style={{ height: "20px", width: "100%" }} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;

