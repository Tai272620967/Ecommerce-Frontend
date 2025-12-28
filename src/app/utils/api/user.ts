import { UsersResponse, UserResponse } from "@/base/types/user";
import axiosInstance from "../axiosConfig";

export const fetchAllUsersApi = async (
  page: number = 1,
  size: number = 20
): Promise<UsersResponse> => {
  try {
    const response = await axiosInstance.get<UsersResponse>("/users", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch all users API error:", error);
    throw error;
  }
};

export const deleteUserApi = async (userId: number) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Delete user API error:", error);
    throw error;
  }
};

export const getUserByIdApi = async (id: number): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.get<UserResponse>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get user by id API error:", error);
    throw error;
  }
};

