"use client";
import { useEffect, useState, useRef } from "react";
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
  const [size] = useState(4);
  const { categoryId } = useParams<{ categoryId: string }>();
  const router = useRouter();
  const isFetchingRef = useRef<boolean>(false);

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
        console.error(err);
      }
    };

    fetchSubCategory();
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;
    
    // Reset products và page khi categoryId thay đổi
    setProducts([]);
    setPage(1);
    isFetchingRef.current = false;
    
    const fetchProducts = async () => {
      // Nếu đang fetch, không gọi API nữa
      if (isFetchingRef.current) {
        console.log("Already fetching, skipping...");
        return;
      }

      isFetchingRef.current = true;
      setLoading(true);
      
      try {
        if (isRenderedBySubCategory) {
          console.log("Fetching products for subCategory:", categoryId, "page: 1");
          const response = await fetchProductsBySubCategoryId(
            categoryId,
            1,
            size
          );
          console.log("SubCategory products response (full):", JSON.stringify(response, null, 2));
          console.log("Response type:", typeof response);
          console.log("Response result:", response?.result);
          console.log("Is array:", Array.isArray(response?.result));
          console.log("Result length:", response?.result?.length);
          
          // Handle different possible response structures
          let productsData: Product[] = [];
          
          if (response) {
            // Check if result is directly in response (expected structure)
            if (Array.isArray(response.result)) {
              productsData = response.result;
            } 
            // Check if result is nested in data (fallback)
            else if ((response as any).data && Array.isArray((response as any).data.result)) {
              productsData = (response as any).data.result;
            }
            // Check if response itself is an array (fallback)
            else if (Array.isArray(response)) {
              productsData = response;
            }
          }
          
          console.log("Final products data to set:", productsData);
          console.log("Products data length:", productsData.length);
          
          if (productsData.length > 0) {
            console.log("Setting products:", productsData);
            setProducts(productsData);
          } else {
            console.warn("No products found. Response:", response);
            setProducts([]);
          }
        }

        if (isRenderedByCategory) {
          console.log("Fetching products for category:", categoryId, "page: 1");
          const response = await fetchProductsByCategoryId(
            categoryId,
            1,
            size
          );
          console.log("Category products response (full):", JSON.stringify(response, null, 2));
          console.log("Response type:", typeof response);
          console.log("Response result:", response?.result);
          console.log("Is array:", Array.isArray(response?.result));
          console.log("Result length:", response?.result?.length);
          
          // Handle different possible response structures
          let productsData: Product[] = [];
          
          if (response) {
            // Check if result is directly in response (expected structure)
            if (Array.isArray(response.result)) {
              productsData = response.result;
            } 
            // Check if result is nested in data (fallback)
            else if ((response as any).data && Array.isArray((response as any).data.result)) {
              productsData = (response as any).data.result;
            }
            // Check if response itself is an array (fallback)
            else if (Array.isArray(response)) {
              productsData = response;
            }
          }
          
          console.log("Final products data to set:", productsData);
          console.log("Products data length:", productsData.length);
          
          if (productsData.length > 0) {
            console.log("Setting products:", productsData);
            setProducts(productsData);
          } else {
            console.warn("No products found. Response:", response);
            setProducts([]);
          }
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
        console.log("Fetch completed, isFetchingRef set to false");
      }
    };

    fetchProducts();
  }, [categoryId, isRenderedBySubCategory, isRenderedByCategory]); // Chỉ fetch lại khi categoryId thay đổi

  // Fetch thêm products khi page > 1 (lazy load)
  useEffect(() => {
    if (!categoryId || page === 1) return;
    
    // Nếu đang fetch, không gọi API nữa
    if (isFetchingRef.current) {
      console.log("Already fetching, skipping...");
      return;
    }

    const fetchMoreProducts = async () => {
      isFetchingRef.current = true;
      setLoading(true);
      
      try {
        if (isRenderedBySubCategory) {
          console.log("Fetching more products for subCategory:", categoryId, "page:", page);
          const response = await fetchProductsBySubCategoryId(
            categoryId,
            page,
            size
          );
          
          if (response && response.result && Array.isArray(response.result) && response.result.length > 0) {
            console.log("Appending products:", response.result);
            setProducts((prev) => [...prev, ...response.result]);
          }
        }

        if (isRenderedByCategory) {
          console.log("Fetching more products for category:", categoryId, "page:", page);
          const response = await fetchProductsByCategoryId(
            categoryId,
            page,
            size
          );
          
          if (response && response.result && Array.isArray(response.result) && response.result.length > 0) {
            console.log("Appending products:", response.result);
            setProducts((prev) => [...prev, ...response.result]);
          }
        }
      } catch (err) {
        console.error("Error fetching more products:", err);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchMoreProducts();
  }, [page]); // Chỉ fetch thêm khi page > 1

  // Hàm chia mảng thành các nhóm nhỏ (mỗi nhóm chứa 4 sản phẩm)
  const chunkProducts = (arr: Product[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Chia mảng products thành các nhóm nhỏ, mỗi nhóm chứa 4 sản phẩm
  const productChunks = chunkProducts(products, 4);
  console.log("Current products state:", products);
  console.log("Products length:", products.length);
  console.log("Product chunks:", productChunks);
  console.log("Product chunks length:", productChunks.length);

  // Xử lý khi người dùng kéo xuống dưới cùng của trang (lazy load)
  const handleScroll = () => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;
    if (bottom && !loading) {
      setPage((prev) => prev + 1); // Tăng trang để lấy thêm sản phẩm
    }
  };

  useEffect(() => {
    // Lắng nghe sự kiện scroll để kích hoạt lazy load
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  return (
    <div className="product__wrapper">
      <div className="product__bread-crumbs">
        <ul className="product__bread-crumbs__list">
          <li className="product__bread-crumbs__list__item">
            <a href="/">MUJI</a>
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
              <a href="">
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
              <a href="">
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
          {/* <Image
            src="/images/products/furniture/sofa.avif"
            alt="Search icon"
            width={435}
            height={272}
          /> */}
          <div className="product__pickup-item__title">
            <span>How to Choose a Comfortable Sofa for Relaxation</span>
          </div>
        </div>
        <div className="product__pickup-item">
          {/* <Image
            src="/images/products/furniture/hannyu.avif"
            alt="Search icon"
            width={435}
            height={272}
          /> */}
          <div className="product__pickup-item__title">
            <span>Delivery Space Simulator</span>
          </div>
        </div>
      </div>
      <div className="product__filter__wrapper">
        <CategorySelectionModal subCategoryId={categoryId} />
      </div>
      <div className="product__list__wrapper">
        {loading && <div style={{ padding: "20px", textAlign: "center" }}>Loading products...</div>}
        {!loading && products.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            No products found for this category.
            <br />
            <small>Category ID: {categoryId}</small>
            <br />
            <small>Check console for API response details.</small>
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
                              JPY
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
                                  円
                                </span>
                              </>
                            )}
                          </span>
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
        ))}
      </div>
      {/* Thêm phần loading nếu cần */}
      {/* <div className="loader__wrapper">
        {loading && <div className="loader"></div>}
      </div> */}
    </div>
  );
};

export default ProductList;
