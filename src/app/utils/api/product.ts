/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Product,
  ProductResponse,
  ProductsResponse,
} from "@/base/types/Product";
import axiosInstance from "@/utils/axiosConfig";
import axios from "axios";

export const fetchAllProductApi = async (
  page: number = 1,
  size: number = 10
) => {
  try {
    const response = await axiosInstance.get<ProductsResponse>("/products", {
      params: { page, size },
    });

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Fetch all product failed");
  } catch (error) {
    console.error("Fetch all product API error:", error);
    throw error;
  }
};

export const fetchProductsBySubCategoryId = async (
  categoryId: string,
  page: number = 1,
  size: number = 4
): Promise<ProductsResponse> => {
  try {
    const response = await axiosInstance.get<ProductsResponse>(
      `/products/sub-category/${categoryId}`,
      {
        params: { page, size }, // Đảm bảo rằng params chứa đúng `page` và `size`
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Fetch product by categoryId API error:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Failed to fetch products by categoryId.");
  }
};

export const fetchProductsByCategoryId = async (
  categoryId: string,
  page: number = 1,
  size: number = 4
): Promise<ProductsResponse> => {
  try {
    const response = await axiosInstance.get<ProductsResponse>(
      `/products/category/${categoryId}`,
      {
        params: { page, size }, // Đảm bảo rằng params chứa đúng `page` và `size`
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Fetch product by categoryId API error:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Failed to fetch products by categoryId.");
  }
};

export const fetchProductByIdApi = async (
  id: string
): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get<ProductResponse>(
      `/products/detail/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Fetch product by id API error:", error);
    throw error;
  }
};

export const createProductApi = async (formData: FormData) => {
  try {
    // Gửi request với FormData
    const response = await axiosInstance.post<Product>("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Create product API error:", error);
    throw error;
  }
};
