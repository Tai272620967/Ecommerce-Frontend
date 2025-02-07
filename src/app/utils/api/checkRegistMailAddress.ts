/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosConfig";

export const checkRegistMailAddressApi = async (data: Record<string, any>) => {
  try {
    const response = await axiosInstance.post("/users/checkRegistMailAddress", data);

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Send mail failed");
  } catch (error) {
    console.error("Send mail API error:", error);
    throw error;
  }
};