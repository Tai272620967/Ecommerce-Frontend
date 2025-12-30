"use client";

import React, { useEffect, useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/base/types/Product";
import { fetchAllProductApi } from "@/base/utils/api/product";
import { convertToNumberFormat } from "@/base/utils";
import { getImageUrl } from "@/base/utils/imageUrl";
import "./FeaturedProducts.scss";
import { useRouter } from "next/navigation";
import { useScrollAnimation } from "@/base/utils/hooks/useScrollAnimation";

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchAllProductApi(1, 8);
        if (response && response.result) {
          setProducts(response.result);
        }
      } catch (error) {
        // Error fetching featured products
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="featured-products" ref={ref}>
      <div className={`featured-products__container scroll-fade-in ${isVisible ? "visible" : ""}`}>
        <div className="featured-products__header">
          <h2 className="featured-products__title">New Arrivals</h2>
          <p className="featured-products__subtitle">
            Introducing new products with simple and functional design
          </p>
        </div>
        {loading ? (
          <div className="featured-products__grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="featured-products__item featured-products__item--skeleton">
                <div className="skeleton featured-products__item__image-wrapper" style={{ height: "250px" }} />
                <div className="featured-products__item__info">
                  <div className="skeleton" style={{ height: "20px", width: "80%", marginBottom: "12px" }} />
                  <div className="skeleton" style={{ height: "16px", width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="featured-products__grid">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="featured-products__item"
                onClick={() => router.push(`/product/detail/${product.id}`)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="featured-products__item__image-wrapper">
                  <Image
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="featured-products__item__image image-fade-in"
                  />
                </div>
                <div className="featured-products__item__info">
                  <h3 className="featured-products__item__name">{product.name}</h3>
                  <div className="featured-products__item__price">
                    <span className="featured-products__item__price__value">
                      {convertToNumberFormat(product.minPrice)}
                    </span>
                    <span className="featured-products__item__price__unit">$</span>
                    {product.maxPrice && product.maxPrice !== product.minPrice && (
                      <>
                        <span className="featured-products__item__price__separator">
                          -
                        </span>
                        <span className="featured-products__item__price__value">
                          {convertToNumberFormat(product.maxPrice)}
                        </span>
                        <span className="featured-products__item__price__unit">$</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="featured-products__footer">
          <Link href="/products" className="featured-products__link ripple-effect">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturedProducts);

