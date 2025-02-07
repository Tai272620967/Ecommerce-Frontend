"use client";
import React, { useState } from "react";
import type { DrawerProps } from "antd";
import { Drawer, Space } from "antd";
import { Category, SubCategory } from "@/base/types/category";
import "./CategorySelectionModal.scss";
import Image from "next/image";
import { fetchCategoriesBySubCategoryIdApi } from "@/base/utils/api/category";
import { useRouter } from "next/navigation";

interface CategorySelectionModalProps {
  subCategory?: SubCategory;
  subCategoryId?: string;
}

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  subCategoryId,
}) => {
  const [open, setOpen] = useState(false);
  const [placement] = useState<DrawerProps["placement"]>("left");
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      if (subCategoryId) {
        const response = await fetchCategoriesBySubCategoryIdApi(subCategoryId);
        if (response) {
          setCategories(response);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showDrawer = () => {
    fetchCategories();
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // const onChange = (e: RadioChangeEvent) => {
  //   setPlacement(e.target.value);
  // };

  return (
    <div className="product__filter-button-wrapper">
      <button className="product__filter-button" onClick={showDrawer}>
        <span>カテゴリから商品を絞り込む</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            strokeLinecap="round"
            strokeWidth="1.5"
            stroke="#3C3C43"
          >
            <path d="M2 8h12M8 14V2"></path>
          </svg>
        </span>
      </button>
      <Drawer
        title="家具"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
        width={480}
        extra={
          <Space>
            <button
              className="product__filter__close-button"
              onClick={onClose}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                strokeLinecap="round"
                strokeWidth="1.5"
                stroke="#3C3C43"
              >
                <path d="M2 17.556 17.556 2M2 2l15.556 15.556"></path>
              </svg>
            </button>
          </Space>
        }
      >
        <div className="category-selection__row">
          <p className="category-selection__row__text">すべての家具</p>
          <span className="category-selection__row__next-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="#3C3C43"
            >
              <path d="m7 17 7-7-7-7"></path>
            </svg>
          </span>
        </div>
        {categories.map((category, index) => (
          <div
            className="category-selection__row"
            key={index}
            onClick={() => router.push(`/product/category/${category.id}`)}
          >
            <div className="category-selection__row__image">
              <Image
                src={category?.imageUrl}
                alt="Search icon"
                width={105}
                height={104}
              />
            </div>
            <div className="category-selection__row__text-wrapper">
              <span className="category-selection__row__text">
                {category?.name}
              </span>
            </div>
            <span className="category-selection__row__next-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="#3C3C43"
              >
                <path d="m7 17 7-7-7-7"></path>
              </svg>
            </span>
          </div>
        ))}
      </Drawer>
    </div>
  );
};

export default CategorySelectionModal;
