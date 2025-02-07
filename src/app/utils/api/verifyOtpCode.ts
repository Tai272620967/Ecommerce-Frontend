/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosConfig";

export const verifyOtpCodeApi = async (data: Record<string, any>) => {
  try {
    const response = await axiosInstance.post("/users/checkVerifyCode", data);

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Verify Otp Code fail");
  } catch (error) {
    console.error("Verify Otp Code API error:", error);
    throw error;
  }
};