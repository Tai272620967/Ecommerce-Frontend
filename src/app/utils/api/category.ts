/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CategoryRes,
  CategoryResponse,
  ListCategory,
  SubCategoriesByMainCategoryId,
  SubCategoryRes,
  SubCategoryResponse,
} from "@/base/types/category";
import axiosInstance from "@/utils/axiosConfig";

/* Main Category Api */
export const fetchAllMainCategoryApi = async () => {
  try {
    const response = await axiosInstance.get<CategoryResponse>(
      "/main-categories"
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("fetch all main-categories failed");
  } catch (error) {
    console.error("fetch all main-categories API error:", error);
    throw error;
  }
};

/* Sub Category Api */
export const fetchSubCategoriesApi = async () => {
  try {
    const response = await axiosInstance.get<SubCategoryResponse>(
      "/sub-categories"
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("fetch all sub-categories failed");
  } catch (error) {
    console.error("fetch all sub-categories API error:", error);
    throw error;
  }
};

export const fetchSubCategoryByIdApi = async (id: string) => {
  try {
    const response = await axiosInstance.get<SubCategoryRes>(
      `/sub-categories/${id}`
    );

    if (response.status === 200) {
      return response.data.data;
    }

    throw new Error("fetch sub-category by id failed");
  } catch (error) {
    console.error("fetch sub-category by id API error:", error);
    throw error;
  }
};

export const fetchSubCategoriesByMainCategoryIdApi = async (id: string) => {
  try {
    const response = await axiosInstance.get<SubCategoriesByMainCategoryId>(
      `/sub-categories/main-category/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("fetch subCategories by main-category id API error:", error);
    throw error;
  }
};

/* Category Api */
export const fetchCategoryById = async (id: string) => {
  try {
    const response = await axiosInstance.get<CategoryRes>(`/categories/${id}`);

    if (response.status === 200) {
      return response.data.data;
    }

    throw new Error("fetch category by id failed");
  } catch (error) {
    console.error("fetch category by id API error:", error);
    throw error;
  }
};

export const fetchCategoriesBySubCategoryIdApi = async (id: string) => {
  try {
    const response = await axiosInstance.get<ListCategory>(
      `/categories/sub-category/${id}`
    );

    if (response.status === 200) {
      return response.data.data;
    }

    throw new Error("fetch categories by sub-category id failed");
  } catch (error) {
    console.error("fetch categories by sub-category id API error:", error);
    throw error;
  }
};
