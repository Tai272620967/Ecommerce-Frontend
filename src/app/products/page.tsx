"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Product } from "@/base/types/Product";
import { fetchAllProductApi, searchProductsApi, fetchProductsByCategoryId } from "@/base/utils/api/product";
import { getImageUrl } from "@/base/utils/imageUrl";
import { convertToNumberFormat } from "@/base/utils";
import { 
  fetchAllMainCategoryApi, 
  fetchSubCategoriesApi,
  fetchSubCategoriesByMainCategoryIdApi,
  fetchCategoriesBySubCategoryIdApi 
} from "@/base/utils/api/category";
import { Category, SubCategory } from "@/base/types/category";
import "./page.scss";
import "../product/components/Product.scss";
import { ProductGridSkeleton } from "../components/Skeleton/ProductSkeleton";
import WishlistButton from "../components/WishlistButton/WishlistButton";
import FilterSort, { FilterState, SortOption } from "../components/FilterSort/FilterSort";

// Component that uses useSearchParams - must be wrapped in Suspense
const AllProductsPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const categoryId = searchParams.get("category") || "";
  const mainCategoryId = searchParams.get("maincategory") || "";
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const sortParam = searchParams.get("sort");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: minPriceParam ? parseFloat(minPriceParam) : null,
    maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : null,
  });
  const [sort, setSort] = useState<SortOption>((sortParam as SortOption) || "default");
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAllCategoryData = async () => {
      try {
        // Fetch MainCategories
        const mainCatResponse = await fetchAllMainCategoryApi();
        if (mainCatResponse && mainCatResponse.data) {
          setCategories(mainCatResponse.data.result || []);
        }

        // Fetch all SubCategories
        const subCatResponse = await fetchSubCategoriesApi();
        if (subCatResponse && subCatResponse.data) {
          setAllSubCategories(subCatResponse.data.result || []);
        }
      } catch (error) {
        // Error fetching categories
      }
    };
    fetchAllCategoryData();
  }, []);

  useEffect(() => {
    setPage(1);
    setProducts([]);
    if (searchQuery) {
      // Check if search query matches a MainCategory name
      const queryLower = searchQuery.toLowerCase().trim();
      const matchingMainCategory = categories.find(
        (cat) => cat.name.toLowerCase().includes(queryLower)
      );
      
      if (matchingMainCategory) {
        // Redirect to products page with category filter (using MainCategory ID)
        router.replace(`/products?category=${matchingMainCategory.id}`);
        return;
      }
      
      // If no matching MainCategory, proceed with normal search
      fetchSearchResults(searchQuery, 1, categoryId);
    } else if (mainCategoryId) {
      fetchProductsByMainCategory(mainCategoryId, 1);
    } else if (categoryId) {
      // Check if categoryId is a MainCategory ID or Category (cấp 3) ID
      // Try MainCategory first
      const isMainCategory = categories.some(cat => cat.id.toString() === categoryId);
      if (isMainCategory) {
        fetchProductsByMainCategory(categoryId, 1);
      } else {
        fetchProductsByCategory(categoryId, 1);
      }
    } else {
      fetchProducts(1);
    }
  }, [searchQuery, categoryId, mainCategoryId, categories, router, sort]);

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
  }, [hasMore, loading, searchQuery, categoryId, mainCategoryId]);

  const fetchProducts = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetchAllProductApi(pageNum, 20, sort);
      
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
        
        // Apply price filters on client-side
        let filteredData = productsData;
        if (filters.minPrice !== null && filters.minPrice > 0) {
          filteredData = filteredData.filter((p) => p.minPrice >= filters.minPrice!);
        }
        if (filters.maxPrice !== null && filters.maxPrice > 0) {
          filteredData = filteredData.filter((p) => p.maxPrice <= filters.maxPrice!);
        }
        
        if (pageNum === 1) {
          setProducts(filteredData);
        } else {
          setProducts((prev) => [...prev, ...filteredData]);
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
      // Error fetching products
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (query: string, pageNum: number, categoryId?: string) => {
    if (!query.trim()) {
      if (categoryId) {
        // Check if categoryId is a MainCategory ID
        const isMainCategory = categories.some(cat => cat.id.toString() === categoryId);
        if (isMainCategory) {
          fetchProductsByMainCategory(categoryId, 1);
        } else {
          fetchProductsByCategory(categoryId, 1);
        }
      } else {
        fetchProducts(1);
      }
      return;
    }

    setLoading(true);
    try {
      let productsData: Product[] = [];
      const queryLower = query.toLowerCase().trim();
      
      // If categoryId is provided, search within that category first
      if (categoryId && categoryId !== "all") {
        const isMainCategory = categories.some(cat => cat.id.toString() === categoryId);
        
        if (isMainCategory) {
          // Get all products in this MainCategory, then filter by search query
          // We need to manually fetch all products from this MainCategory
          // Step 1: Get all SubCategories of this MainCategory
          const subCategoriesResponse = await fetchSubCategoriesByMainCategoryIdApi(categoryId);
          const subCategories: SubCategory[] = Array.isArray(subCategoriesResponse?.data) 
            ? subCategoriesResponse.data 
            : (Array.isArray(subCategoriesResponse) ? subCategoriesResponse : []);
          
          // Step 2: For each SubCategory, get all Categories (cấp 3)
          const allCategoryIds: number[] = [];
          for (const subCategory of subCategories) {
            try {
              const categoriesResponse = await fetchCategoriesBySubCategoryIdApi(subCategory.id.toString());
              const categoriesList: Category[] = Array.isArray(categoriesResponse) 
                ? categoriesResponse 
                : [];
              categoriesList.forEach(cat => allCategoryIds.push(cat.id));
            } catch (error) {
              // Continue if error
            }
          }
          
          // Step 3: Fetch products from all categories
          if (allCategoryIds.length > 0) {
            const allProducts: Product[] = [];
            
            // Fetch products for each category
            const categoryPromises = allCategoryIds.map(async (catId) => {
              try {
                const categoryProductsResponse = await fetchProductsByCategoryId(
                  catId.toString(),
                  1,
                  1000,
                  sort
                );
                
                let categoryProducts: Product[] = [];
                if (categoryProductsResponse) {
                  if (Array.isArray(categoryProductsResponse.result)) {
                    categoryProducts = categoryProductsResponse.result;
                  } else if ((categoryProductsResponse as any).data && Array.isArray((categoryProductsResponse as any).data.result)) {
                    categoryProducts = (categoryProductsResponse as any).data.result;
                  } else if (Array.isArray(categoryProductsResponse)) {
                    categoryProducts = categoryProductsResponse;
                  }
                }
                return categoryProducts;
              } catch (error) {
                return [];
              }
            });

            const categoryProductsArrays = await Promise.all(categoryPromises);
            allProducts.push(...categoryProductsArrays.flat());
            
            // Remove duplicates
            const uniqueProducts = allProducts.filter(
              (product, index, self) => index === self.findIndex((p) => p.id === product.id)
            );
            
            // Filter products by search query (case-insensitive)
            productsData = uniqueProducts.filter((product: Product) => 
              product.name.toLowerCase().includes(queryLower)
            );
          }
        } else {
          // categoryId is a Category (level 3) ID, search within that category
          const categoryResponse = await fetchProductsByCategoryId(categoryId, 1, 1000, sort);
          if (categoryResponse && categoryResponse.result) {
            const allProducts = Array.isArray(categoryResponse.result) 
              ? categoryResponse.result 
              : [];
            
            // Filter products by search query (case-insensitive)
            productsData = allProducts.filter((product: Product) => 
              product.name.toLowerCase().includes(queryLower)
            );
          }
        }
      } else {
        // No category filter, search all products by name
        const response = await searchProductsApi(query, pageNum, 20, sort);
        
        if (response) {
          // Handle different response structures
          if (Array.isArray(response.result)) {
            productsData = response.result;
          } else if ((response as any).data) {
            const data = (response as any).data;
            if (Array.isArray(data.result)) {
              productsData = data.result;
            } else if (Array.isArray(data)) {
              productsData = data;
            }
          } else if (response.result && typeof response.result === 'object' && !Array.isArray(response.result)) {
            const resultObj = response.result as any;
            if (Array.isArray(resultObj.result)) {
              productsData = resultObj.result;
            } else if (Array.isArray(resultObj.data)) {
              productsData = resultObj.data;
            } else {
              const keys = Object.keys(resultObj);
              for (const key of keys) {
                if (Array.isArray(resultObj[key])) {
                  productsData = resultObj[key];
                  break;
                }
              }
            }
          } else if (Array.isArray(response)) {
            productsData = response;
          }
        }
      }

      // If no category filter, also search by category names at all 3 levels (case-insensitive)
      if (!categoryId || categoryId === "all") {
        const queryLower = query.toLowerCase().trim();
        
        // Find matching MainCategories
        const matchingMainCategories = categories.filter(
          (cat) => cat.name.toLowerCase().includes(queryLower)
        );

        // Find matching SubCategories
        const matchingSubCategories = allSubCategories.filter(
          (subCat) => subCat.name.toLowerCase().includes(queryLower)
        );

        // Fetch all Categories (cấp 3) and find matching ones
        const matchingCategoryIds = new Set<number>();
        
        // Get all categories from matching SubCategories
        for (const subCategory of matchingSubCategories) {
          try {
            const categoriesResponse = await fetchCategoriesBySubCategoryIdApi(subCategory.id.toString());
            const categoriesList: Category[] = Array.isArray(categoriesResponse) 
              ? categoriesResponse 
              : [];
            categoriesList.forEach(cat => {
              matchingCategoryIds.add(cat.id);
              // Also check if category name matches
              if (cat.name.toLowerCase().includes(queryLower)) {
                matchingCategoryIds.add(cat.id);
              }
            });
          } catch (error) {
            // Continue if error
          }
        }

        // Get all SubCategories from matching MainCategories, then get their Categories
        for (const mainCategory of matchingMainCategories) {
          try {
            const subCategoriesResponse = await fetchSubCategoriesByMainCategoryIdApi(mainCategory.id.toString());
            const subCategories: SubCategory[] = Array.isArray(subCategoriesResponse?.data) 
              ? subCategoriesResponse.data 
              : (Array.isArray(subCategoriesResponse) ? subCategoriesResponse : []);
            
            for (const subCategory of subCategories) {
              try {
                const categoriesResponse = await fetchCategoriesBySubCategoryIdApi(subCategory.id.toString());
                const categoriesList: Category[] = Array.isArray(categoriesResponse) 
                  ? categoriesResponse 
                  : [];
                categoriesList.forEach(cat => {
                  matchingCategoryIds.add(cat.id);
                  // Also check if category name matches
                  if (cat.name.toLowerCase().includes(queryLower)) {
                    matchingCategoryIds.add(cat.id);
                  }
                });
              } catch (error) {
                // Continue if error
              }
            }
          } catch (error) {
            // Continue if error
          }
        }

        // Also search for Categories (cấp 3) that match directly by fetching all subcategories first
        // Then get all their categories and check names
        for (const subCategory of allSubCategories) {
          try {
            const categoriesResponse = await fetchCategoriesBySubCategoryIdApi(subCategory.id.toString());
            const categoriesList: Category[] = Array.isArray(categoriesResponse) 
              ? categoriesResponse 
              : [];
            categoriesList.forEach(cat => {
              if (cat.name.toLowerCase().includes(queryLower)) {
                matchingCategoryIds.add(cat.id);
              }
            });
          } catch (error) {
            // Continue if error
          }
        }

        // Fetch products from all matching categories
        if (matchingCategoryIds.size > 0 && pageNum === 1) {
          const allCategoryProducts: Product[] = [];
          
          // Fetch products for each matching category
          const categoryPromises = Array.from(matchingCategoryIds).map(async (catId) => {
            try {
            const categoryProductsResponse = await fetchProductsByCategoryId(
              catId.toString(),
              1,
              1000,
              sort
            );
              
              let categoryProducts: Product[] = [];
              if (categoryProductsResponse) {
                if (Array.isArray(categoryProductsResponse.result)) {
                  categoryProducts = categoryProductsResponse.result;
                } else if ((categoryProductsResponse as any).data && Array.isArray((categoryProductsResponse as any).data.result)) {
                  categoryProducts = (categoryProductsResponse as any).data.result;
                } else if (Array.isArray(categoryProductsResponse)) {
                  categoryProducts = categoryProductsResponse;
                }
              }
              return categoryProducts;
            } catch (error) {
              return [];
            }
          });

          const categoryProductsArrays = await Promise.all(categoryPromises);
          allCategoryProducts.push(...categoryProductsArrays.flat());
          
          // Combine and remove duplicates by product ID
          const allProducts = [...productsData, ...allCategoryProducts];
          const uniqueProducts = allProducts.filter(
            (product, index, self) => index === self.findIndex((p) => p.id === product.id)
          );
          
          productsData = uniqueProducts;
        }
      }
      
      if (pageNum === 1) {
        setProducts(productsData);
      } else {
        setProducts((prev) => [...prev, ...productsData]);
      }
      
      // Set total results
      setTotalResults(productsData.length);
      // If category filter is applied, we've fetched all products, so no pagination
      if (categoryId && categoryId !== "all") {
        setHasMore(false);
      } else {
        setHasMore(productsData.length >= 20);
      }
    } catch (error) {
      setProducts([]);
      setTotalResults(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId: string, pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetchProductsByCategoryId(categoryId, pageNum, 20, sort);
      
      if (response) {
        let productsData: Product[] = [];
        
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
        
        if (response.meta) {
          setTotalResults(response.meta.total || 0);
          setHasMore(pageNum < (response.meta.pages || 1));
        } else {
          setHasMore(productsData.length >= 20);
        }
      }
    } catch (error) {
      setProducts([]);
      setTotalResults(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByMainCategory = async (mainCategoryId: string, pageNum: number) => {
    setLoading(true);
    try {
      // Step 1: Get all SubCategories of this MainCategory
      const subCategoriesResponse = await fetchSubCategoriesByMainCategoryIdApi(mainCategoryId);
      const subCategories: SubCategory[] = Array.isArray(subCategoriesResponse?.data) 
        ? subCategoriesResponse.data 
        : (Array.isArray(subCategoriesResponse) ? subCategoriesResponse : []);
      
      // Step 2: For each SubCategory, get all Categories (cấp 3)
      const allCategoryIds: number[] = [];
      for (const subCategory of subCategories) {
        try {
          const categoriesResponse = await fetchCategoriesBySubCategoryIdApi(subCategory.id.toString());
          const categoriesList: Category[] = Array.isArray(categoriesResponse) 
            ? categoriesResponse 
            : [];
          categoriesList.forEach(cat => allCategoryIds.push(cat.id));
        } catch (error) {
          // Continue if error
        }
      }
      
      // Step 3: Fetch products from all categories
      if (allCategoryIds.length > 0) {
        const allProducts: Product[] = [];
        
        // Fetch products for each category
        const categoryPromises = allCategoryIds.map(async (categoryId) => {
          try {
            const categoryProductsResponse = await fetchProductsByCategoryId(
              categoryId.toString(),
              1,
              1000,
              sort
            );
            
            let categoryProducts: Product[] = [];
            if (categoryProductsResponse) {
              if (Array.isArray(categoryProductsResponse.result)) {
                categoryProducts = categoryProductsResponse.result;
              } else if ((categoryProductsResponse as any).data && Array.isArray((categoryProductsResponse as any).data.result)) {
                categoryProducts = (categoryProductsResponse as any).data.result;
              } else if (Array.isArray(categoryProductsResponse)) {
                categoryProducts = categoryProductsResponse;
              }
            }
            return categoryProducts;
          } catch (error) {
            return [];
          }
        });

        const categoryProductsArrays = await Promise.all(categoryPromises);
        allProducts.push(...categoryProductsArrays.flat());
        
        // Remove duplicates
        const uniqueProducts = allProducts.filter(
          (product, index, self) => index === self.findIndex((p) => p.id === product.id)
        );
        
        if (pageNum === 1) {
          setProducts(uniqueProducts);
        } else {
          setProducts((prev) => {
            const combined = [...prev, ...uniqueProducts];
            return combined.filter(
              (product, index, self) => index === self.findIndex((p) => p.id === product.id)
            );
          });
        }
        
        setTotalResults(uniqueProducts.length);
        setHasMore(false); // Since we fetch all at once, no pagination needed
      } else {
        setProducts([]);
        setTotalResults(0);
        setHasMore(false);
      }
    } catch (error) {
      setProducts([]);
      setTotalResults(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      if (searchQuery) {
        fetchSearchResults(searchQuery, nextPage, categoryId);
      } else if (mainCategoryId) {
        // For main category, we fetch all at once, so no need to load more
        fetchProductsByMainCategory(mainCategoryId, nextPage);
      } else if (categoryId) {
        fetchProductsByCategory(categoryId, nextPage);
      } else {
        fetchProducts(nextPage);
      }
    }
  }, [loading, hasMore, page, searchQuery, categoryId, mainCategoryId]);

  const getCategoryName = useCallback((id: string) => {
    const category = categories.find((cat) => cat.id.toString() === id);
    return category ? category.name : "";
  }, [categories]);

  // Apply price filters only (sort is handled by backend)
  const applyFilters = useCallback((productsToFilter: Product[], filterState: FilterState): Product[] => {
    let filtered = [...productsToFilter];

    // Apply price filters
    if (filterState.minPrice !== null && filterState.minPrice > 0) {
      filtered = filtered.filter((p) => p.minPrice >= filterState.minPrice!);
    }
    if (filterState.maxPrice !== null && filterState.maxPrice > 0) {
      filtered = filtered.filter((p) => p.maxPrice <= filterState.maxPrice!);
    }

    return filtered;
  }, []);

  // Apply filters whenever products or filters change
  useEffect(() => {
    if (products.length > 0) {
      const filtered = applyFilters(products, filters);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, filters, applyFilters]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
  }, []);

  const getTitle = useMemo(() => {
    if (searchQuery && categoryId) {
      const categoryName = getCategoryName(categoryId);
      return categoryName 
        ? `Search Results for "${searchQuery}" in ${categoryName}`
        : `Search Results for "${searchQuery}"`;
    } else if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    } else if (mainCategoryId) {
      const categoryName = getCategoryName(mainCategoryId);
      return categoryName ? categoryName : "Products";
    } else if (categoryId) {
      const categoryName = getCategoryName(categoryId);
      return categoryName ? categoryName : "Products";
    }
    return "All Products";
  }, [searchQuery, categoryId, mainCategoryId, getCategoryName]);

  const getInfoText = useMemo(() => {
    const displayCount = filteredProducts.length;
    const totalCount = totalResults > 0 ? totalResults : products.length;
    
    if (searchQuery && categoryId && totalCount > 0) {
      const categoryName = getCategoryName(categoryId);
      return categoryName
        ? `Found ${displayCount} ${displayCount === 1 ? "product" : "products"} for "${searchQuery}" in ${categoryName}`
        : `Found ${displayCount} ${displayCount === 1 ? "product" : "products"} for "${searchQuery}"`;
    } else if (searchQuery && totalCount > 0) {
      return `Found ${displayCount} ${displayCount === 1 ? "product" : "products"} for "${searchQuery}"`;
    } else if (mainCategoryId && totalCount > 0) {
      const categoryName = getCategoryName(mainCategoryId);
      return categoryName
        ? `Showing ${displayCount} of ${totalCount} products in ${categoryName}`
        : `Showing ${displayCount} of ${totalCount} products`;
    } else if (categoryId && totalCount > 0) {
      const categoryName = getCategoryName(categoryId);
      return categoryName
        ? `Showing ${displayCount} of ${totalCount} products in ${categoryName}`
        : `Showing ${displayCount} of ${totalCount} products`;
    } else if (totalCount > 0) {
      return `Showing ${displayCount} of ${totalCount} products`;
    }
    return null;
  }, [searchQuery, categoryId, mainCategoryId, totalResults, filteredProducts.length, products.length, getCategoryName]);

  return (
    <div className="product__wrapper">
      <div className="product">
        <div className="product__title">{getTitle}</div>
        {getInfoText && (
          <div style={{ marginTop: "16px", fontSize: "14px", color: "#6d6d72" }}>
            {getInfoText}
          </div>
        )}

        <FilterSort
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        {filteredProducts.length === 0 && !loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "#6d6d72" }}>
            <p>No products found.</p>
          </div>
        ) : (
          <>
            <div className="product__list__wrapper">
              {loading && filteredProducts.length === 0 && (
                <ProductGridSkeleton count={8} />
              )}
              {filteredProducts.length > 0 && (
                <div className="product__list__table">
                  <div className="product__list">
                    {filteredProducts.map((product, index) => (
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
                                <WishlistButton productId={product.id} />
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

            {loading && filteredProducts.length > 0 && (
              <div className="loader__wrapper">
                <div className="loader"></div>
              </div>
            )}

            {/* Only show infinite scroll if no filters/sort are applied */}
            {hasMore && !filters.minPrice && !filters.maxPrice && sort === "default" && (
              <div ref={observerRef} style={{ height: "20px", width: "100%" }} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Wrapper component with Suspense boundary
const AllProductsPage: React.FC = () => {
  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <AllProductsPageContent />
    </Suspense>
  );
};

export default AllProductsPage;

