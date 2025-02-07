"use client";
import { useEffect, useState } from "react";
import "./Product.scss";
import Image from "next/image";
import { Product } from "@/base/types/Product";
import { fetchProductsByCategoryId, fetchProductsBySubCategoryId } from "@/base/utils/api/product";
import { useParams } from "next/navigation";
import { Category, SubCategory } from "@/base/types/category";
import {
  fetchCategoryById,
  fetchSubCategoryByIdApi,
} from "@/base/utils/api/category";
import { useRouter } from "next/navigation";
import CategorySelectionModal from "./CategorySelectionModal";
import { convertToNumberFormat } from "@/base/utils";

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
    const fetchProducts = async () => {
      // Nếu đang tải, không gọi API nữa
      if (loading) return;

      setLoading(true);
      try {
        if (isRenderedBySubCategory) {
          const response = await fetchProductsBySubCategoryId(
            categoryId,
            page,
            size
          ); // Lấy 4 sản phẩm mỗi lần
          if (response) {
            // Thêm các sản phẩm mới vào danh sách cũ
            setProducts((prev) => [...prev, ...response.data.result]);
          }
        }

        if (isRenderedByCategory) {
          const response = await fetchProductsByCategoryId(
            categoryId,
            page,
            size
          );
          if (response) {
            // Thêm các sản phẩm mới vào danh sách cũ
            setProducts((prev) => [...prev, ...response.data.result]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Đặt lại loading sau khi API trả về
      }
    };

    fetchProducts();
  }, [categoryId, page, size]); // Khi page thay đổi, gọi lại API

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
  // console.log("productChunks", productChunks)

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
            <a href="/">無印良品</a>
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
        <h2 className="product__sub-title">ピックアップ</h2>
      </div>
      <div className="product__pickup-item__wrapper">
        <div className="product__pickup-item">
          <Image
            src="/images/products/furniture/sofa.avif"
            alt="Search icon"
            width={435}
            height={272}
          />
          <div className="product__pickup-item__title">
            <span>ゆったり座ってくつろぐ ソファの選び方</span>
          </div>
        </div>
        <div className="product__pickup-item">
          <Image
            src="/images/products/furniture/hannyu.avif"
            alt="Search icon"
            width={435}
            height={272}
          />
          <div className="product__pickup-item__title">
            <span>搬入スペースシミュレーター</span>
          </div>
        </div>
      </div>
      <div className="product__filter__wrapper">
        <CategorySelectionModal subCategoryId={categoryId} />
      </div>
      <div className="product__list__wrapper">
        {productChunks.map((productChunk, index) => (
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
                        src={process.env.NEXT_PUBLIC_API_BASE_URI + product.imageUrl}
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
                              円
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
