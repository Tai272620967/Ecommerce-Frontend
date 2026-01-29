"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./Product.scss";
import Image from "next/image";
import { Product } from "@/base/types/Product";
import {
  fetchProductsByCategoryId,
  fetchProductsBySubCategoryId,
} from "@/base/utils/api/product";
import { useParams } from "next/navigation";
import { Category, SubCategory } from "@/base/types/category";
import {
  fetchCategoryById,
  fetchSubCategoryByIdApi,
} from "@/base/utils/api/category";
import { useRouter } from "next/navigation";
import CategorySelectionModal from "./CategorySelectionModal";
import { convertToNumberFormat } from "@/base/utils";
import { getImageUrl } from "@/base/utils/imageUrl";
import { ProductGridSkeleton } from "../../components/Skeleton/ProductSkeleton";
import WishlistButton from "../../components/WishlistButton/WishlistButton";

interface ProductListProps {
  isRenderedByCategory?: boolean;
  isRenderedBySubCategory?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  isRenderedByCategory,
  isRenderedBySubCategory,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [size] = useState(4);
  const { categoryId } = useParams<{ categoryId: string }>();
  const router = useRouter();
  const isFetchingRef = useRef<boolean>(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Function to get pickup title based on category/subcategory
  const getPickupTitle = useMemo((): string => {
    if (isRenderedByCategory && category?.name) {
      const categoryName = category.name.toLowerCase();
      
      // Map category names to appropriate titles
      if (categoryName.includes("sofa")) {
        return "How to Choose a Comfortable Sofa for Relaxation";
      } else if (categoryName.includes("tv stand") || categoryName.includes("tvstand")) {
        return "How to Choose the Right TV Stand for Your Space";
      } else if (categoryName.includes("coffee table") || categoryName.includes("coffeetable")) {
        return "How to Choose the Perfect Coffee Table";
      } else if (categoryName.includes("dining table") || categoryName.includes("diningtable")) {
        return "How to Choose the Ideal Dining Table";
      } else if (categoryName.includes("bed") || categoryName.includes("bedroom")) {
        return "How to Choose the Perfect Bed for Your Bedroom";
      } else if (categoryName.includes("chair")) {
        return "How to Choose a Comfortable Chair";
      } else if (categoryName.includes("desk") || categoryName.includes("workspace")) {
        return "How to Choose the Right Desk for Your Workspace";
      } else if (categoryName.includes("storage") || categoryName.includes("cabinet")) {
        return "How to Choose the Right Storage Solution";
      } else if (categoryName.includes("shelf") || categoryName.includes("bookcase")) {
        return "How to Choose the Perfect Shelf for Your Space";
      } else {
        return `How to Choose the Right ${category.name} for Your Space`;
      }
    } else if (isRenderedBySubCategory && subCategory?.name) {
      const subCategoryName = subCategory.name.toLowerCase();
      
      if (subCategoryName.includes("sofa") || subCategoryName.includes("seating")) {
        return "How to Choose a Comfortable Sofa for Relaxation";
      } else if (subCategoryName.includes("table")) {
        return "How to Choose the Perfect Table for Your Space";
      } else if (subCategoryName.includes("storage")) {
        return "How to Choose the Right Storage Solution";
      } else {
        return `How to Choose the Right ${subCategory.name} for Your Space`;
      }
    }
    
    // Default fallback
    return "How to Choose the Right Furniture for Your Space";
  }, [isRenderedByCategory, category?.name, isRenderedBySubCategory, subCategory?.name]);

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        if (isRenderedBySubCategory) {
          const response = await fetchSubCategoryByIdApi(categoryId);
          if (response) {
            setSubCategory(response);
          }
        }

        if (isRenderedByCategory) {
          const response = await fetchCategoryById(categoryId);

          if (response) {
            setCategory(response);
          }
        }
      } catch (err) {
        // Error fetching category/subcategory
      }
    };

    fetchSubCategory();
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;
    
    // Reset products và page khi categoryId thay đổi
    setProducts([]);
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = false;
    
    const fetchProducts = async () => {
      // Nếu đang fetch, không gọi API nữa
      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setLoading(true);
      
      try {
        let response;
        
        if (isRenderedBySubCategory) {
          response = await fetchProductsBySubCategoryId(
            categoryId,
            1,
            size
          );
        } else if (isRenderedByCategory) {
          response = await fetchProductsByCategoryId(
            categoryId,
            1,
            size
          );
        }
        
        if (response) {
          // Handle different possible response structures
          let productsData: Product[] = [];
          
          if (Array.isArray(response.result)) {
            productsData = response.result;
          } else if ((response as any).data && Array.isArray((response as any).data.result)) {
            productsData = (response as any).data.result;
          } else if (Array.isArray(response)) {
            productsData = response;
          }
          
          setProducts(productsData);
          
          // Check if there are more pages
          if (response.meta) {
            setHasMore(1 < (response.meta.pages || 1));
          } else {
            // If no meta, assume no more if less than page size
            setHasMore(productsData.length >= size);
          }
        } else {
          setProducts([]);
          setHasMore(false);
        }
      } catch (err) {
        setProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchProducts();
  }, [categoryId, isRenderedBySubCategory, isRenderedByCategory, size]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !isFetchingRef.current && categoryId) {
      const nextPage = page + 1;
      setPage(nextPage);
    }
  }, [loading, hasMore, categoryId, page]);

  // Fetch thêm products khi page > 1 (lazy load)
  useEffect(() => {
    if (!categoryId || page === 1 || !hasMore || loading) return;
    
    // Nếu đang fetch, không gọi API nữa
    if (isFetchingRef.current) {
      return;
    }

    const fetchMoreProducts = async () => {
      isFetchingRef.current = true;
      setLoading(true);
      
      try {
        let response;
        
        if (isRenderedBySubCategory) {
          response = await fetchProductsBySubCategoryId(
            categoryId,
            page,
            size
          );
        } else if (isRenderedByCategory) {
          response = await fetchProductsByCategoryId(
            categoryId,
            page,
            size
          );
        }
        
        if (response) {
          let productsData: Product[] = [];
          
          if (Array.isArray(response.result)) {
            productsData = response.result;
          } else if ((response as any).data && Array.isArray((response as any).data.result)) {
            productsData = (response as any).data.result;
          } else if (Array.isArray(response)) {
            productsData = response;
          }
          
          if (productsData.length > 0) {
            setProducts((prev) => [...prev, ...productsData]);
            
            // Check if there are more pages
            if (response.meta) {
              setHasMore(page < (response.meta.pages || 1));
            } else {
              setHasMore(productsData.length >= size);
            }
          } else {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setHasMore(false);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchMoreProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Hàm chia mảng thành các nhóm nhỏ (mỗi nhóm chứa 4 sản phẩm) - memoized
  const chunkProducts = useCallback((arr: Product[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }, []);

  // Chia mảng products thành các nhóm nhỏ, mỗi nhóm chứa 4 sản phẩm - memoized
  const productChunks = useMemo(() => chunkProducts(products, 4), [products, chunkProducts]);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;

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
  }, [hasMore, loading, loadMore]);

  return (
    <div className="product__wrapper">
      <div className="product__bread-crumbs">
        <ul className="product__bread-crumbs__list">
          <li className="product__bread-crumbs__list__item">
            <a href="/">AMAX</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="#D8D8D9"
              className="product__bread-crumbs__list__item__icon"
            >
              <path d="m6 13 5-5-5-5"></path>
            </svg>
          </li>
          <li className="product__bread-crumbs__list__item">
            {(isRenderedBySubCategory || isRenderedByCategory) && (
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const mainCategoryId = isRenderedBySubCategory
                    ? subCategory?.mainCategory?.id
                    : category?.subCategory?.mainCategory?.id;
                  if (mainCategoryId) {
                    router.push(`/products?maincategory=${mainCategoryId}`);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {isRenderedBySubCategory
                  ? subCategory?.mainCategory.name
                  : category?.subCategory?.mainCategory.name}
              </a>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="#D8D8D9"
              className="product__bread-crumbs__list__item__icon"
            >
              <path d="m6 13 5-5-5-5"></path>
            </svg>
          </li>
          <li className="product__bread-crumbs__list__item">
            {(isRenderedBySubCategory || isRenderedByCategory) && (
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const subCategoryId = isRenderedBySubCategory
                    ? subCategory?.id
                    : category?.subCategory?.id;
                  if (subCategoryId) {
                    router.push(`/product/subCategory/${subCategoryId}`);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {isRenderedBySubCategory
                  ? subCategory?.name
                  : category?.subCategory.name}
              </a>
            )}
            {isRenderedByCategory && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                stroke="#D8D8D9"
                className="product__bread-crumbs__list__item__icon"
              >
                <path d="m6 13 5-5-5-5"></path>
              </svg>
            )}
          </li>
          {isRenderedByCategory && (
            <li className="product__bread-crumbs__list__item">
              {isRenderedByCategory && <a href="">{category?.name}</a>}
            </li>
          )}
        </ul>
      </div>
      <div className="product__title__wrapper">
        {(isRenderedBySubCategory || isRenderedByCategory) && (
          <h1 className="product__title">
            {isRenderedBySubCategory ? subCategory?.name : category?.name}
          </h1>
        )}
      </div>
      <div className="product__sub-title__wrapper">
        <h2 className="product__sub-title">Pickup</h2>
      </div>
      <div className="product__pickup-item__wrapper">
        <div className="product__pickup-item">
                 <div className="product__pickup-item__title">
                   <span>{getPickupTitle}</span>
                 </div>
        </div>
        <div className="product__pickup-item">
          <div className="product__pickup-item__title">
            <span>Delivery Space Simulator</span>
          </div>
        </div>
      </div>
            <div className="product__filter__wrapper">
              <CategorySelectionModal 
                subCategoryId={
                  isRenderedByCategory && category?.subCategory?.id
                    ? category.subCategory.id.toString()
                    : isRenderedBySubCategory && subCategory?.id
                    ? subCategory.id.toString()
                    : categoryId
                } 
              />
            </div>
      <div className="product__list__wrapper">
        {loading && products.length === 0 && <ProductGridSkeleton count={4} />}
        {!loading && products.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            No products found for this category.
          </div>
        )}
        {productChunks.length > 0 && productChunks.map((productChunk, index) => (
          <div className="product__list__table" key={index}>
            <div className="product__list">
              {productChunk.map((product, index) => (
                <div
                  className={`product__list__inner${
                    index !== productChunk.length - 1 ? "-wrapper" : ""
                  }`}
                  key={index}
                  onClick={() => router.push(`/product/detail/${product.id}`)}
                >
                  <div className="product__list__item">
                    <div className="product__list__item__image">
                      <Image
                        src={getImageUrl(product.imageUrl)}
                        alt="Search icon"
                        width={320}
                        height={320}
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
                          {product.maxPrice && (
                            <span className="product__list__item__desc__price__tilde">
                              〜
                            </span>
                          )}
                          <span className="product__list__item__desc__price__value">
                            {product.maxPrice && (
                              <>
                                <span className="product__list__item__desc__price__value__number">
                                  {convertToNumberFormat(product.maxPrice)}
                                </span>
                                <span className="product__list__item__desc__price__value__unit">
                                  $
                                </span>
                              </>
                            )}
                          </span>
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
        ))}
      </div>
      
      {loading && products.length > 0 && (
        <div className="loader__wrapper">
          <div className="loader"></div>
        </div>
      )}
      
      {hasMore && (
        <div ref={observerRef} style={{ height: "20px", width: "100%" }} />
      )}
    </div>
  );
};

export default ProductList;
