"use client";

import styles from "./page.module.css";
import 'bootstrap/dist/css/bootstrap.min.css'; // Thêm dòng này để sử dụng Bootstrap
import CustomCarousel from "./components/Carousel/Carousel";
import { useEffect, useState } from "react";
import { SubCategory } from "./types/category";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import {
  fetchSubCategoriesApi,
} from "./utils/api/category";

export default function Home() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const imageUrls = [
    "/images/banner-01.avif",
    "/images/banner-02.avif",
    "/images/banner-03.webp",
  ];

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetchSubCategoriesApi();
        if (response) {
          setSubCategories(
            response.data.result.filter((category) => {
              return category.imageUrl !== null;
            })
          );
        }
      } catch (err) {
        // setError("Failed to fetch categories");
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  return (
    <div className={styles.page}>
      <div className="article-contents">
        <ul>
          <li>
            <a href="">
              ・ネットストアお届け日および店舗受け取りサービス商品ご用意
              延伸のお知らせ
            </a>
          </li>
        </ul>
      </div>
      <CustomCarousel images={imageUrls} />
      <ImageGallery subCategories={subCategories} />
    </div>
  );
}
