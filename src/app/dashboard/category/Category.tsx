"use client";
import InputField from "@/base/components/Input/Input";
import "./Category.scss";
import { Button } from "@/base/components/Button/Button";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { MainCategory } from "@/base/types/category";
import AccordionCategory from "./components/AccordionCategory";
import {
  fetchAllMainCategoryApi,
  fetchCategoriesBySubCategoryIdApi,
  fetchSubCategoriesByMainCategoryIdApi,
} from "@/base/utils/api/category";

const Category: React.FC = () => {
  const defaultValues = {
    // userId: null,
    // productId: Number(productId),
    // quantity: quantity,
  };
  const {
    register,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(yupSchema),
    defaultValues,
  });
  //   const [mainCategories, setMainCategories] = useState<MainCategory[] | null>(
  //     []
  //   );

  //   useEffect(() => {
  //     const fetchMainCategories = async () => {
  //       try {
  //         const response = await fetchAllMainCategoryApi();
  //         if (response) {
  //           const categories = response.data.result;

  //           // Lấy subcategories cho từng mainCategory
  //           const categoriesWithSubcategories = await Promise.all(
  //             categories.map(async (category) => {
  //               const subcategoriesResponse =
  //                 await fetchSubCategoriesByMainCategoryIdApi(
  //                   category.id.toString()
  //                 );
  //               return {
  //                 ...category,
  //                 subCategories: subcategoriesResponse?.data || [],
  //               };
  //             })
  //           );

  //           setMainCategories(categoriesWithSubcategories);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching main categories or subcategories", error);
  //       }
  //     };

  //     fetchMainCategories();
  //   }, []);

  const [mainCategories, setMainCategories] = useState<MainCategory[] | null>(
    []
  );

  useEffect(() => {
    console.log("hello");
    const fetchMainCategories = async () => {
      try {
        const response = await fetchAllMainCategoryApi();
        if (response) {
          const categories = response.data.result;

          // Lấy subcategories cho từng mainCategory
          const categoriesWithSubcategories = await Promise.all(
            categories.map(async (category) => {
              const subcategoriesResponse =
                await fetchSubCategoriesByMainCategoryIdApi(
                  category.id.toString()
                );

              const subCategoriesWithCategories = await Promise.all(
                (subcategoriesResponse?.data || []).map(async (subCategory) => {
                  const categoriesResponse =
                    await fetchCategoriesBySubCategoryIdApi(
                      subCategory.id.toString()
                    );

                  return {
                    ...subCategory,
                    categories: categoriesResponse || [],
                  };
                })
              );

              return {
                ...category,
                subCategories: subCategoriesWithCategories,
              };
            })
          );

          setMainCategories(categoriesWithSubcategories);
        }
      } catch (error) {
        console.error(
          "Error fetching main categories, subcategories, or categories",
          error
        );
      }
    };

    fetchMainCategories();
  }, []);

  useEffect(() => {
    console.log("mainCategories", mainCategories);
  }, [mainCategories]);

  return (
    <div className="category__wrapper">
      <div className="category__list">
        {mainCategories?.map((mainCategory, index) => (
          <AccordionCategory
            header={mainCategory.name}
            items={mainCategory.subCategories}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Category;
