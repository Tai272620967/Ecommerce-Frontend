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

export const updateUserApi = async (
  id: number,
  userData: Partial<User>,
  avatarFile?: File
): Promise<any> => {
  try {
    const formData = new FormData();
    
    // Add user data fields
    if (userData.firstName) formData.append("firstName", userData.firstName);
    if (userData.lastName) formData.append("lastName", userData.lastName);
    if (userData.kataFirstName) formData.append("kataFirstName", userData.kataFirstName);
    if (userData.kataLastName) formData.append("kataLastName", userData.kataLastName);
    if (userData.address1) formData.append("address1", userData.address1);
    if (userData.address2) formData.append("address2", userData.address2);
    if (userData.address3) formData.append("address3", userData.address3);
    if (userData.address4) formData.append("address4", userData.address4);
    if (userData.phone) formData.append("phone", userData.phone);
    if (userData.birthday) formData.append("birthday", userData.birthday);
    if (userData.gender) formData.append("gender", userData.gender);
    
    // Add avatar file if provided
    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }
    
    const response = await axiosInstance.put(`/users/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update user API error:", error);
    throw error;
  }
};

export const getCurrentUserProfileApi = async (): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.get<UserResponse>("/users/me");
    return response.data;
  } catch (error) {
    console.error("Get current user profile API error:", error);
    throw error;
  }
};

export const updateCurrentUserProfileApi = async (
  userData: Partial<User>,
  avatarFile?: File
): Promise<any> => {
  try {
    const formData = new FormData();
    
    // Add user data fields
    if (userData.firstName) formData.append("firstName", userData.firstName);
    if (userData.lastName) formData.append("lastName", userData.lastName);
    if (userData.kataFirstName) formData.append("kataFirstName", userData.kataFirstName);
    if (userData.kataLastName) formData.append("kataLastName", userData.kataLastName);
    if (userData.address1) formData.append("address1", userData.address1);
    if (userData.address2) formData.append("address2", userData.address2);
    if (userData.address3) formData.append("address3", userData.address3);
    if (userData.address4) formData.append("address4", userData.address4);
    if (userData.phone) formData.append("phone", userData.phone);
    if (userData.birthday) formData.append("birthday", userData.birthday);
    if (userData.gender) formData.append("gender", userData.gender);
    
    // Add avatar file if provided
    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }
    
    const response = await axiosInstance.put("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update current user profile API error:", error);
    throw error;
  }
};

