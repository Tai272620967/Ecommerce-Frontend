/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartItemsResponse, CartResponse, DeleteCartItemResponse, UpdatedCartItem } from "@/base/types/cart";
import axiosInstance from "../axiosConfig";

export const addToCartApi = async (data: Record<string, any>) => {
  try {
    const response = await axiosInstance.post<CartResponse>("/add", data);
    return response.data;
  } catch (error) {
    console.error("Add to cart API error:", error);
    throw error;
  }
};

export const cartTotalQuantityApi = async () => {
  try {
    const response = await axiosInstance.get<CartResponse>("/cart/quantity");
    return response.data;
  } catch (error) {
    console.error("Cart total quantity API error:", error);
    throw error;
  }
};

export const fetchAllCartItemsByCartIdApi = async () => {
  try {
    const response = await axiosInstance.get<CartItemsResponse>("/cart");
    return response.data;
  } catch (error) {
    console.error("Get all cart items by cartId API error:", error);
    throw error;
  }
}

export const updateCartItemQuantityApi = async (data: Record<string, any>) => {
  try {
    const response = await axiosInstance.put<UpdatedCartItem>("/cart-item", data);
    return response.data;
  } catch (error) {
    console.error("Update cart item quantity API error:", error);
    throw error;
  }
}

export const deleteCartItemByIdApi = async (id: string) => {
  try {
    const response = await axiosInstance.delete<DeleteCartItemResponse>(`/cart-item/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete cart item by id API error:", error);
    throw error;
  }
}
