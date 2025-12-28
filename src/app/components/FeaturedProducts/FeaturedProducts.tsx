"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/base/types/Product";
import { fetchAllProductApi } from "@/base/utils/api/product";
import { convertToNumberFormat } from "@/base/utils";
import { getImageUrl } from "@/base/utils/imageUrl";
import "./FeaturedProducts.scss";
import { useRouter } from "next/navigation";

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchAllProductApi(1, 8);
        if (response) {
          setProducts(response.data.result);
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="featured-products">
        <div className="featured-products__container">
          <div className="featured-products__loading">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products">
      <div className="featured-products__container">
        <div className="featured-products__header">
          <h2 className="featured-products__title">New Arrivals</h2>
          <p className="featured-products__subtitle">
            Introducing new products with simple and functional design
          </p>
        </div>
        <div className="featured-products__grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="featured-products__item"
              onClick={() => router.push(`/product/detail/${product.id}`)}
            >
              <div className="featured-products__item__image-wrapper">
                <Image
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="featured-products__item__image"
                />
              </div>
              <div className="featured-products__item__info">
                <h3 className="featured-products__item__name">{product.name}</h3>
                <div className="featured-products__item__price">
                  <span className="featured-products__item__price__value">
                    {convertToNumberFormat(product.minPrice)}
                  </span>
                  <span className="featured-products__item__price__unit">¥</span>
                  {product.maxPrice && product.maxPrice !== product.minPrice && (
                    <>
                      <span className="featured-products__item__price__separator">
                        -
                      </span>
                      <span className="featured-products__item__price__value">
                        {convertToNumberFormat(product.maxPrice)}
                      </span>
                      <span className="featured-products__item__price__unit">¥</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="featured-products__footer">
          <Link href="/product/category/1" className="featured-products__link">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

