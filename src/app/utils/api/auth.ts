/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosConfig";

export const loginApi = async (data: Record<string, any>) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Login failed");
  } catch (error) {
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Logout failed");
  } catch (error) {
    // Logout error
  }
};

export const registerAccountApi = async (data: Record<string, any>) => {
  try {
    const response = await axiosInstance.post("/users/register", data);

    if (response.status === 201) {
      return response.data;
    }

    throw new Error("Register account fail");
  } catch (error) {
    // Register account error
  }
};

export const getLoggedAccountApi = async () => {
  try {
    const response = await axiosInstance.get("/auth/account");

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Get logged account fail");
  } catch (error) {
    throw error;
  }
}
