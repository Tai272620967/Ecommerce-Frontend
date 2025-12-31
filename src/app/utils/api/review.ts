import axiosInstance from "../axiosConfig";
import { Review, ReviewStats, ReviewDTO } from "@/base/types/review";

export const getReviewsApi = async (
  productId: number,
  page: number = 1,
  size: number = 10
): Promise<{ content: Review[]; totalElements: number; totalPages: number }> => {
  try {
    const response = await axiosInstance.get(`/products/${productId}/reviews`, {
      params: { page: page - 1, size },
    });
    // Handle nested data structure: response.data.data.content
    const reviewsData = response.data?.data || response.data;
    
    // Spring Data Page response structure
    if (reviewsData && Array.isArray(reviewsData.content)) {
      return {
        content: reviewsData.content,
        totalElements: reviewsData.totalElements || 0,
        totalPages: reviewsData.totalPages || 0,
      };
    }
    
    // Fallback if response is array directly
    if (Array.isArray(response.data)) {
      return {
        content: response.data,
        totalElements: response.data.length,
        totalPages: 1,
      };
    }
    
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
    };
  } catch (error) {
    throw error;
  }
};

export const createReviewApi = async (
  productId: number,
  reviewData: ReviewDTO
): Promise<Review> => {
  try {
    const response = await axiosInstance.post(
      `/products/${productId}/reviews`,
      reviewData
    );
    // Handle nested data structure: response.data.data
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReviewApi = async (
  productId: number,
  reviewId: number,
  reviewData: ReviewDTO
): Promise<Review> => {
  try {
    const response = await axiosInstance.put(
      `/products/${productId}/reviews/${reviewId}`,
      reviewData
    );
    // Handle nested data structure: response.data.data
    return response.data?.data || response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReviewApi = async (
  productId: number,
  reviewId: number
): Promise<void> => {
  try {
    await axiosInstance.delete(`/products/${productId}/reviews/${reviewId}`);
  } catch (error) {
    throw error;
  }
};

export const getReviewStatsApi = async (productId: number): Promise<ReviewStats> => {
  try {
    const response = await axiosInstance.get(
      `/products/${productId}/reviews/stats`
    );
    // Handle nested data structure: response.data.data
    const statsData = response.data?.data || response.data;
    // Ensure we always return valid numbers
    return {
      averageRating: statsData?.averageRating ?? 0,
      reviewCount: statsData?.reviewCount ?? 0,
    };
  } catch (error) {
    // Return default values on error
    return {
      averageRating: 0,
      reviewCount: 0,
    };
  }
};

