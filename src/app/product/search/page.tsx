"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/base/types/Product";
import { searchProductsApi } from "@/base/utils/api/product";
import { getImageUrl } from "@/base/utils/imageUrl";
import { convertToNumberFormat } from "@/base/utils";
import NavbarSearch from "@/app/components/NavbarSearch/NavbarSearch";
import { fetchAllMainCategoryApi } from "@/base/utils/api/category";
import { Category } from "@/base/types/category";
import "./page.scss";

const SearchResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchAllMainCategoryApi();
        if (response && response.data) {
          setCategories(response.data.result || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    setSearchQuery(query);
    setSelectedCategory(category);
    if (query) {
      fetchSearchResults(query, 1, category);
    }
  }, [searchParams]);

  const fetchSearchResults = async (query: string, pageNum: number, categoryId?: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      // If category is selected, filter products by category
      let response;
      if (categoryId && categoryId !== "all") {
        // For now, we'll search all products and filter client-side
        // In production, you'd want to add category filter to the API
        response = await searchProductsApi(query, pageNum, 20);
        if (response && response.result) {
          const allProducts = Array.isArray(response.result) ? response.result : [];
          const filteredProducts = allProducts.filter(
            (product: Product) => product.category?.id?.toString() === categoryId
          );
          if (pageNum === 1) {
            setProducts(filteredProducts);
          } else {
            setProducts((prev) => [...prev, ...filteredProducts]);
          }
          setTotalResults(filteredProducts.length);
          setHasMore(false); // Simplified for now
        }
      } else {
        response = await searchProductsApi(query, pageNum, 20);
        if (response && response.result) {
          const newProducts = Array.isArray(response.result) ? response.result : [];
          if (pageNum === 1) {
            setProducts(newProducts);
          } else {
            setProducts((prev) => [...prev, ...newProducts]);
          }
          setTotalResults(response.meta?.total || 0);
          setHasMore(pageNum < (response.meta?.pages || 0));
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchSearchResults(searchQuery, nextPage);
            return nextPage;
          });
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
  }, [hasMore, loading, searchQuery]);

  const handleProductClick = (productId: number) => {
    router.push(`/product/detail/${productId}`);
  };

  return (
    <div className="search-results-page">
      <div className="search-results-page__container">
        <div className="search-results-page__header">
          <h1 className="search-results-page__title">Search Results</h1>
          <div className="search-results-page__search-bar">
            <NavbarSearch categories={categories} />
          </div>
        </div>

        {searchQuery && (
          <>
            <div className="search-results-page__info">
              {loading && products.length === 0 ? (
                <p>Searching for "{searchQuery}"...</p>
              ) : (
                <p>
                  {totalResults > 0
                    ? `Found ${totalResults} ${totalResults === 1 ? "product" : "products"} for "${searchQuery}"`
                    : `No products found for "${searchQuery}"`}
                </p>
              )}
            </div>

            {loading && products.length === 0 ? (
              <div className="search-results-page__loading">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="search-results-page__skeleton">
                    <div className="skeleton" style={{ height: "250px", marginBottom: "12px" }} />
                    <div className="skeleton" style={{ height: "20px", width: "80%", marginBottom: "8px" }} />
                    <div className="skeleton" style={{ height: "16px", width: "60%" }} />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="search-results-page__grid">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="search-results-page__item"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="search-results-page__item__image-wrapper">
                        <Image
                          src={getImageUrl(product.imageUrl)}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="search-results-page__item__image image-fade-in"
                        />
                      </div>
                      <div className="search-results-page__item__info">
                        <h3 className="search-results-page__item__name">{product.name}</h3>
                        <div className="search-results-page__item__price">
                          <span className="search-results-page__item__price__value">
                            {convertToNumberFormat(product.minPrice)}
                          </span>
                          <span className="search-results-page__item__price__unit">¥</span>
                          {product.maxPrice && product.maxPrice !== product.minPrice && (
                            <>
                              <span className="search-results-page__item__price__separator">-</span>
                              <span className="search-results-page__item__price__value">
                                {convertToNumberFormat(product.maxPrice)}
                              </span>
                              <span className="search-results-page__item__price__unit">¥</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {loading && products.length > 0 && (
                  <div className="search-results-page__loading-more">
                    <div className="skeleton" style={{ height: "250px", width: "100%" }} />
                  </div>
                )}
                <div ref={observerRef} style={{ height: "20px" }} />
              </>
            ) : (
              <div className="search-results-page__empty">
                <p>Try searching with different keywords</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;

