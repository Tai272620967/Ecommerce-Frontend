import { Product } from "@/base/types/Product";
import axiosInstance from "../axiosConfig";

export const addToWishlistApi = async (productId: number): Promise<string> => {
  try {
    const response = await axiosInstance.post<{ message: string }>(`/wishlist/${productId}`);
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const removeFromWishlistApi = async (productId: number): Promise<string> => {
  try {
    const response = await axiosInstance.delete<{ message: string }>(`/wishlist/${productId}`);
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const getWishlistApi = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get("/wishlist");
    // Handle different response structures
    let data = response.data;
    
    // If response.data is wrapped in another object, extract it
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Check if data has a 'data' property that is an array
      if (Array.isArray(data.data)) {
        data = data.data;
      } else if (Array.isArray(data.result)) {
        data = data.result;
      } else {
        // If it's an object but not an array, return empty array
        return [];
      }
    }
    
    // Ensure data is always an array
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error) {
    return [];
  }
};

export const checkWishlistApi = async (productId: number): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/wishlist/check/${productId}`);
    // Ensure we return a proper boolean value
    const data = response.data;
    if (typeof data === 'boolean') {
      return data;
    }
    // If response is wrapped in an object, try to extract boolean value
    if (data && typeof data === 'object') {
      if (typeof data.data === 'boolean') {
        return data.data;
      }
      if (typeof data.result === 'boolean') {
        return data.result;
      }
    }
    // Default to false if we can't determine the value
    return false;
  } catch (error) {
    return false;
  }
};

export const getWishlistCountApi = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get<number>("/wishlist/count");
    return response.data;
  } catch (error) {
    return 0;
  }
};

