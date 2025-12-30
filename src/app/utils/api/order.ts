import { Order, OrderDTO, OrderResponse, OrdersResponse, OrdersPaginationResponse } from "@/base/types/order";
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
    // API returns List<ResOrderDTO> directly, not wrapped in OrdersResponse
    const response = await axiosInstance.get<Order[]>("/orders");
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

export const fetchAllOrdersApi = async (
  page: number = 1,
  size: number = 20
): Promise<OrdersPaginationResponse> => {
  try {
    // Use admin endpoint which has role check
    const response = await axiosInstance.get<OrdersPaginationResponse>("/admin/orders", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch all orders API error:", error);
    throw error;
  }
};

