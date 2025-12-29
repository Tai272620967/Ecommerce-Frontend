"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/base/types/Product";
import { searchProductsApi } from "@/base/utils/api/product";
import { getImageUrl } from "@/base/utils/imageUrl";
import { convertToNumberFormat } from "@/base/utils";
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
    setPage(1); // Reset page when search changes
    setProducts([]); // Clear previous results
    if (query) {
      fetchSearchResults(query, 1, category);
    } else {
      setProducts([]);
      setTotalResults(0);
      setLoading(false);
    }
  }, [searchParams]);

  const fetchSearchResults = async (query: string, pageNum: number, categoryId?: string) => {
    if (!query.trim()) {
      setProducts([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching search results for:", query, "page:", pageNum);
      const response = await searchProductsApi(query, pageNum, 20);
      
      console.log("=== Search API Response Debug ===");
      console.log("Full response:", JSON.stringify(response, null, 2));
      console.log("Response type:", typeof response);
      console.log("Response.result:", response?.result);
      console.log("Response.result type:", typeof response?.result);
      console.log("Is result array?", Array.isArray(response?.result));
      console.log("Response.meta:", response?.meta);
      
      if (response) {
        let productsToShow: Product[] = [];
        
        // Handle different response structures
        // First check if result is directly an array
        if (Array.isArray(response.result)) {
          productsToShow = response.result;
          console.log("✓ Found products array directly in response.result");
        } 
        // Check if response has data wrapper
        else if ((response as any).data) {
          const data = (response as any).data;
          if (Array.isArray(data.result)) {
            productsToShow = data.result;
            console.log("✓ Found products array in response.data.result");
          } else if (Array.isArray(data)) {
            productsToShow = data;
            console.log("✓ Found products array in response.data");
          }
        }
        // Check if result is an object with nested result
        else if (response.result && typeof response.result === 'object' && !Array.isArray(response.result)) {
          const resultObj = response.result as any;
          if (Array.isArray(resultObj.result)) {
            productsToShow = resultObj.result;
            console.log("✓ Found products array in response.result.result");
          } else if (Array.isArray(resultObj.data)) {
            productsToShow = resultObj.data;
            console.log("✓ Found products array in response.result.data");
          } else {
            // Try to find any array property
            const keys = Object.keys(resultObj);
            for (const key of keys) {
              if (Array.isArray(resultObj[key])) {
                productsToShow = resultObj[key];
                console.log(`✓ Found products array in response.result.${key}`);
                break;
              }
            }
          }
        }
        // Last resort: check if response itself is an array
        else if (Array.isArray(response)) {
          productsToShow = response;
          console.log("✓ Response itself is an array");
        }
        
        console.log("=== Products Extraction Result ===");
        console.log("Products to show:", productsToShow);
        console.log("Products count:", productsToShow.length);
        console.log("First product sample:", productsToShow[0]);
        
        // Filter by category if needed (if Product has category property)
        // Note: Product interface may not have category, so this is optional
        if (categoryId && categoryId !== "all" && productsToShow.length > 0) {
          const beforeFilter = productsToShow.length;
          productsToShow = productsToShow.filter(
            (product: any) => (product as any).category?.id?.toString() === categoryId
          );
          console.log(`Filtered by category ${categoryId}: ${beforeFilter} -> ${productsToShow.length}`);
        }
        
        if (pageNum === 1) {
          setProducts(productsToShow);
        } else {
          setProducts((prev) => [...prev, ...productsToShow]);
        }
        
        // Set total results
        if (response.meta) {
          setTotalResults(response.meta.total || productsToShow.length);
          setHasMore(pageNum < (response.meta.pages || 1));
          console.log("Meta info - total:", response.meta.total, "pages:", response.meta.pages, "hasMore:", pageNum < (response.meta.pages || 1));
        } else {
          setTotalResults(productsToShow.length);
          setHasMore(productsToShow.length >= 20);
          console.log("No meta info, using products length:", productsToShow.length);
        }
      } else {
        console.warn("No response from search API");
        setProducts([]);
        setTotalResults(0);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
      setTotalResults(0);
      setHasMore(false);
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
                  {products.map((product) => {
                    const imageUrl = getImageUrl(product.imageUrl);
                    // Debug: log imageUrl to check if it's correct
                    console.log(`Product ${product.id} (${product.name}):`, {
                      originalImageUrl: product.imageUrl,
                      resolvedImageUrl: imageUrl,
                      hasImageUrl: !!imageUrl && imageUrl !== ''
                    });
                    
                    return (
                      <div
                        key={product.id}
                        className="search-results-page__item"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <div className="search-results-page__item__image-wrapper">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={product.name || "Product"}
                              width={300}
                              height={300}
                              className="search-results-page__item__image"
                              unoptimized
                            />
                          ) : (
                            <div className="search-results-page__item__image-placeholder">
                              <span>No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="search-results-page__item__info">
                          <div className="search-results-page__item__name">
                            <p>{product.name || "Unnamed Product"}</p>
                          </div>
                          <div className="search-results-page__item__price__wrapper">
                            <div className="search-results-page__item__price">
                              <span className="search-results-page__item__price__value">
                                <span className="search-results-page__item__price__value__number">
                                  {convertToNumberFormat(product.minPrice || 0)}
                                </span>
                                <span className="search-results-page__item__price__value__unit">
                                  $
                                </span>
                              </span>
                              {product.maxPrice && product.maxPrice !== product.minPrice && (
                                <>
                                  <span className="search-results-page__item__price__tilde">
                                    〜
                                  </span>
                                  <span className="search-results-page__item__price__value">
                                    <span className="search-results-page__item__price__value__number">
                                      {convertToNumberFormat(product.maxPrice)}
                                    </span>
                                    <span className="search-results-page__item__price__value__unit">
                                      $
                                    </span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

