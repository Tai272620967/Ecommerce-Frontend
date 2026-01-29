"use client";

import React from "react";
import Image from "next/image";
import "./LifestyleSection.scss";
import { useScrollAnimation } from "@/base/utils/hooks/useScrollAnimation";

const LifestyleSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const lifestyleItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      title: "Simple Living",
      subtitle: "AMAX Philosophy",
      description: "Eliminate the unnecessary and choose only what you truly need",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80",
      title: "Minimalist Interiors",
      subtitle: "Clean Spaces",
      description: "Create serene environments with thoughtful design and natural light",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      title: "Natural Materials",
      subtitle: "Organic Living",
      description: "Embrace natural textures and materials for a harmonious home",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      title: "Mindful Spaces",
      subtitle: "Peaceful Interiors",
      description: "Create calm and serene environments that nurture your well-being",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      title: "Functional Design",
      subtitle: "Smart Solutions",
      description: "Everyday items designed with purpose and thoughtful consideration",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      title: "Sustainable Choices",
      subtitle: "Eco-Friendly Living",
      description: "Make conscious decisions that benefit both you and the planet",
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
      title: "Comfort & Quality",
      subtitle: "Daily Essentials",
      description: "Invest in quality items that bring comfort to your everyday life",
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
      title: "Thoughtful Living",
      subtitle: "Intentional Choices",
      description: "Select items that align with your values and lifestyle",
    },
  ];

  return (
    <section className="lifestyle-section" ref={ref}>
      <div className={`lifestyle-section__container scroll-fade-in ${isVisible ? "visible" : ""}`}>
        <div className="lifestyle-section__header">
          <h2 className="lifestyle-section__title">Lifestyle Tips</h2>
          <p className="lifestyle-section__subtitle">
            Ideas for a simple and comfortable daily life
          </p>
        </div>
        <div className="lifestyle-section__grid">
          {lifestyleItems.map((item) => (
            <div key={item.id} className="lifestyle-section__item">
              <div className="lifestyle-section__item__image-wrapper">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="lifestyle-section__item__image"
                />
              </div>
              <div className="lifestyle-section__item__content">
                <h3 className="lifestyle-section__item__title">{item.title}</h3>
                <h4 className="lifestyle-section__item__subtitle">
                  {item.subtitle}
                </h4>
                <p className="lifestyle-section__item__description">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;

