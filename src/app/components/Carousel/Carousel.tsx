"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Carousel } from 'antd';
import Image from 'next/image';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './CustomCarousel.module.css';

interface CustomCarouselProps {
  images: string[];
  autoplay?: boolean;
  height?: string;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  images,
  autoplay = true,
  height = '400px',
}) => {
  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f0f0',
    height,
  };

  const imageWrapperStyle: React.CSSProperties = {
    width: '80%', // Chiếm 90% chiều rộng
    margin: '0 auto', // Căn giữa
    position: 'relative',
  };

  const sliderRef = React.useRef<any>(null);

  const handlePrev = () => {
    sliderRef.current?.prev();
  };

  const handleNext = () => {
    sliderRef.current?.next();
  };

  return (
    <div className={styles.carouselContainer}>
      <Carousel ref={sliderRef} autoplay={autoplay} dots={false} speed={1500}>
        {images.map((image, index) => (
          <div key={index} style={contentStyle}>
            <div style={imageWrapperStyle}>
              <Image
                src={image}
                alt={`slide-${index}`}
                layout="responsive"
                width={100}
                height={50} // Tỷ lệ khung hình (2:1)
                objectFit="cover"
                quality={80}
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </Carousel>
      <button className={styles.prevArrow} onClick={handlePrev}>
        <LeftOutlined />
      </button>
      <button className={styles.nextArrow} onClick={handleNext}>
        <RightOutlined />
      </button>
    </div>
  );
};

export default CustomCarousel;
