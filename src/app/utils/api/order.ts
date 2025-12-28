import { OrderDTO, OrderResponse, OrdersResponse } from "@/base/types/order";
import axiosInstance from "../axiosConfig";

export const createOrderApi = async (data: OrderDTO) => {
  try {
    const response = await axiosInstance.post<OrderResponse>("/orders", data);
    return response.data;
  } catch (error) {
    console.error("Create order API error:", error);
    throw error;
  }
};

export const getOrdersApi = async () => {
  try {
    const response = await axiosInstance.get<OrdersResponse>("/orders");
    return response.data;
  } catch (error) {
    console.error("Get orders API error:", error);
    throw error;
  }
};

export const getOrderByIdApi = async (id: number) => {
  try {
    const response = await axiosInstance.get<OrderResponse>(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get order by id API error:", error);
    throw error;
  }
};

