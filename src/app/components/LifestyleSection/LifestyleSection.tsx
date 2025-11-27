"use client";

import React from "react";
import Image from "next/image";
import "./LifestyleSection.scss";

const LifestyleSection: React.FC = () => {
  const lifestyleItems = [
    {
      id: 1,
      image: "/images/products/furniture/sofa.avif",
      title: "Relax and Unwind",
      subtitle: "How to Choose a Sofa",
      description: "Tips for choosing a sofa to create a comfortable space",
    },
    {
      id: 2,
      image: "/images/products/furniture/hannyu.avif",
      title: "Delivery Space",
      subtitle: "Simulator",
      description: "A convenient tool to check delivery to your room in advance",
    },
    {
      id: 3,
      image: "/images/banner-01.avif",
      title: "Simple Living",
      subtitle: "MUJI Philosophy",
      description: "Eliminate the unnecessary and choose only what you truly need",
    },
  ];

  return (
    <section className="lifestyle-section">
      <div className="lifestyle-section__container">
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

