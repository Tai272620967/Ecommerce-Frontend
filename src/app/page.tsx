"use client";

import "./page.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomCarousel from "./components/Carousel/Carousel";
import { useEffect, useState } from "react";
import { SubCategory } from "./types/category";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import { fetchSubCategoriesApi } from "./utils/api/category";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts";
import LifestyleSection from "./components/LifestyleSection/LifestyleSection";
import SnowAnimation from "./components/SnowAnimation/SnowAnimation";

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
        console.log("response", response);
        if (response) {
          setSubCategories(
            response.data.result.filter((category) => {
              return category.imageUrl !== null;
            })
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubCategories();
  }, []);

  return (
    <div className="home-page">
      {/* Snow animation for Christmas atmosphere */}
      <SnowAnimation />
      
      {/* Notification banner */}
      <div className="article-contents">
        <ul>
          <li>
            <a href="">
              • Notice regarding online store delivery dates and store pickup service product preparation extension
            </a>
          </li>
        </ul>
      </div>

      {/* Hero carousel section */}
      <section className="hero-section">
        <CustomCarousel images={imageUrls} />
      </section>

      {/* Category gallery section */}
      <section className="category-gallery-section">
        <div className="category-gallery-section__header">
          <h2 className="category-gallery-section__title">Shop by Category</h2>
          <p className="category-gallery-section__subtitle">
            Find your favorite category and discover your ideal products
          </p>
        </div>
        <ImageGallery subCategories={subCategories} />
      </section>

      {/* Featured products section */}
      <FeaturedProducts />

      {/* Lifestyle section */}
      <LifestyleSection />
    </div>
  );
}
