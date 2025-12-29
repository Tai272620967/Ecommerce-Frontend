"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserByIdApi, updateUserApi } from "@/base/utils/api/user";
import { User } from "@/base/types/user";
import { message } from "antd";
import UserDetailForm from "../components/UserDetailForm";
import "./page.scss";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? Number(params.id) : null;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getUserByIdApi(userId!);
      
      // Handle different response structures
      const userData = response?.data || response;
      setUser(userData);
    } catch (error) {
      message.error("Failed to fetch user details");
      router.push("/dashboard/user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData: Partial<User>, avatarFile?: File) => {
    try {
      if (!userId) return;
      
      await updateUserApi(userId, userData, avatarFile);
      message.success("User updated successfully");
      
      // Refresh user data
      await fetchUser();
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="user-detail-page__wrapper">
        <div className="user-detail-page__title">
          <h1>User Detail</h1>
        </div>
        <div>Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-detail-page__wrapper">
        <div className="user-detail-page__title">
          <h1>User Detail</h1>
        </div>
        <div>User not found</div>
      </div>
    );
  }

  return (
    <div className="user-detail-page__wrapper">
      <div className="user-detail-page__title">
        <h1>User Detail</h1>
      </div>
      <div className="user-detail-page__content">
        <UserDetailForm user={user} onUpdate={handleUpdateUser} />
      </div>
    </div>
  );
}

