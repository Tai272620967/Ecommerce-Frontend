"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserProfileApi, updateCurrentUserProfileApi } from "@/base/utils/api/user";
import { User } from "@/base/types/user";
import { message } from "antd";
import UserProfileForm from "./components/UserProfileForm";
import "./page.scss";
import authStorage from "@/base/storage/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authStorage.authenticated()) {
      router.push("/auth/login");
      return;
    }
    
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUserProfileApi();
      
      // Handle different response structures
      const userData = response?.data || response;
      setUser(userData);
    } catch (error) {
      message.error("Failed to fetch profile");
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (userData: Partial<User>, avatarFile?: File) => {
    try {
      await updateCurrentUserProfileApi(userData, avatarFile);
      message.success("Profile updated successfully");
      
      // Refresh user data
      await fetchUserProfile();
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="profile-page__wrapper">
        <div className="profile-page__title">
          <h1>My Profile</h1>
        </div>
        <div>Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page__wrapper">
        <div className="profile-page__title">
          <h1>My Profile</h1>
        </div>
        <div>User not found</div>
      </div>
    );
  }

  return (
    <div className="profile-page__wrapper">
      <div className="profile-page__title">
        <h1>My Profile</h1>
      </div>
      <div className="profile-page__content">
        <UserProfileForm user={user} onUpdate={handleUpdateProfile} />
      </div>
    </div>
  );
}

