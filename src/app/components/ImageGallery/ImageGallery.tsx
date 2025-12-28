"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./ImageGallery.module.css";
import { SubCategory } from "@/base/types/category";
import Link from 'next/link';
import { useRouter } from "next/navigation";

interface ImageGalleryProps {
  subCategories: SubCategory[];
}

// Mapping category names to Unsplash images
// Using high-quality free images from Unsplash that match each category
const getCategoryImage = (categoryName: string): string => {
  const categoryImageMap: { [key: string]: string } = {
    // Living Room
    "Sofas": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&q=80",
    "Coffee Tables": "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500&h=500&fit=crop&q=80",
    "TV Stands": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&q=80",
    "Side Tables": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=500&h=500&fit=crop&q=80",
    
    // Bedroom
    "Beds": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop&q=80",
    "Wardrobes": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&q=80",
    "Dressers": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&q=80",
    "Nightstands": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=500&h=500&fit=crop&q=80",
    
    // Dining Room
    "Dining Tables": "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop&q=80",
    "Dining Chairs": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop&q=80",
    "Dining Sets": "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&h=500&fit=crop&q=80",
    "Buffets & Sideboards": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&q=80",
    
    // Office
    "Desks": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&h=500&fit=crop&q=80",
    "Office Chairs": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop&q=80",
    "Bookcases": "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=500&h=500&fit=crop&q=80",
    "Filing Cabinets": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&q=80",
    
    // Storage
    "Shelving Units": "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=500&h=500&fit=crop&q=80",
    "Storage Cabinets": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&q=80",
    "Storage Boxes": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&q=80",
    "Storage Baskets": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&q=80",
  };

  // Return mapped image or a default furniture image
  return categoryImageMap[categoryName] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&q=80";
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ subCategories }) => {
  const router = useRouter();

  const handleCategoryClick = (subCategory: SubCategory) => {
    router.push(`/product/subCategory/${subCategory.id}`);
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      }}
      className={styles.swiperContainer}
    >
      {subCategories.map((subCategory, index) => {
        const imageUrl = getCategoryImage(subCategory.name);
        return (
          <SwiperSlide key={index}>
            <Link href={`/product/subCategory/${subCategory.id}`} className={styles.imageWrapper}>
              <Image
                src={imageUrl}
                alt={subCategory.name}
                width={250}
                height={250}
                quality={80}
                className={styles.categoryImage}
                unoptimized
              />
            </Link>
            <p className={styles.categoryName} onClick={() => handleCategoryClick(subCategory)}>
              {subCategory.name}
            </p>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ImageGallery;
