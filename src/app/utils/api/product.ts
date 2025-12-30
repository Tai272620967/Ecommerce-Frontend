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
  size: number = 10,
  sort?: string
) => {
  try {
    const params: any = { page, size };
    if (sort && sort !== "default") {
      // Convert frontend sort format to Spring Data format
      // price-asc -> minPrice,asc
      // price-desc -> maxPrice,desc
      // name-asc -> name,asc
      // name-desc -> name,desc
      // newest -> id,desc
      let sortParam = "";
      switch (sort) {
        case "price-asc":
          sortParam = "minPrice,asc";
          break;
        case "price-desc":
          sortParam = "maxPrice,desc";
          break;
        case "name-asc":
          sortParam = "name,asc";
          break;
        case "name-desc":
          sortParam = "name,desc";
          break;
        case "newest":
          sortParam = "id,desc";
          break;
        default:
          break;
      }
      if (sortParam) {
        params.sort = sortParam;
      }
    }
    
    const response = await axiosInstance.get<ProductsResponse>("/products", {
      params,
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
  size: number = 4,
  sort?: string
): Promise<ProductsResponse> => {
  try {
    const params: any = { page, size };
    if (sort && sort !== "default") {
      let sortParam = "";
      switch (sort) {
        case "price-asc":
          sortParam = "minPrice,asc";
          break;
        case "price-desc":
          sortParam = "maxPrice,desc";
          break;
        case "name-asc":
          sortParam = "name,asc";
          break;
        case "name-desc":
          sortParam = "name,desc";
          break;
        case "newest":
          sortParam = "id,desc";
          break;
        default:
          break;
      }
      if (sortParam) {
        params.sort = sortParam;
      }
    }
    
    const response = await axiosInstance.get<ProductsResponse>(
      `/products/sub-category/${categoryId}`,
      {
        params,
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
  size: number = 4,
  sort?: string
): Promise<ProductsResponse> => {
  try {
    const params: any = { page, size };
    if (sort && sort !== "default") {
      let sortParam = "";
      switch (sort) {
        case "price-asc":
          sortParam = "minPrice,asc";
          break;
        case "price-desc":
          sortParam = "maxPrice,desc";
          break;
        case "name-asc":
          sortParam = "name,asc";
          break;
        case "name-desc":
          sortParam = "name,desc";
          break;
        case "newest":
          sortParam = "id,desc";
          break;
        default:
          break;
      }
      if (sortParam) {
        params.sort = sortParam;
      }
    }
    
    const response = await axiosInstance.get<ProductsResponse>(
      `/products/category/${categoryId}`,
      {
        params,
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

export const updateProductApi = async (productId: number, formData: FormData) => {
  try {
    const response = await axiosInstance.put<Product>(`/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update product API error:", error);
    throw error;
  }
};

export const deleteProductApi = async (productId: number) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Delete product API error:", error);
    throw error;
  }
};

export const searchProductsApi = async (
  searchQuery: string,
  page: number = 1,
  size: number = 20,
  sort?: string
): Promise<ProductsResponse> => {
  try {
    const params: any = { page, size };
    
    if (sort && sort !== "default") {
      let sortParam = "";
      switch (sort) {
        case "price-asc":
          sortParam = "minPrice,asc";
          break;
        case "price-desc":
          sortParam = "maxPrice,desc";
          break;
        case "name-asc":
          sortParam = "name,asc";
          break;
        case "name-desc":
          sortParam = "name,desc";
          break;
        case "newest":
          sortParam = "id,desc";
          break;
        default:
          break;
      }
      if (sortParam) {
        params.sort = sortParam;
      }
    }
    
    // Only add filter if searchQuery is not empty
    if (searchQuery && searchQuery.trim()) {
      // Spring Filter format: filter=name~'*query*'
      const trimmedQuery = searchQuery.trim();
      params.filter = `name~'*${trimmedQuery}*'`;
    }
    
    const response = await axiosInstance.get<ProductsResponse>("/products", {
      params,
    });
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error("Search products failed");
  } catch (error) {
    throw error;
  }
};
