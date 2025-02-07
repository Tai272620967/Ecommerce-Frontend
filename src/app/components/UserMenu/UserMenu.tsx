"use client";
import React, { useEffect } from "react";
import {
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/base/redux/hook";
import { useRouter } from "next/navigation";
import { logout, setLoggedAccount } from "@/base/redux/features/authSlice";
import { message } from "antd";
import { getLoggedAccountApi, logoutApi } from "@/base/utils/api/auth";
import authStorage from "@/base/storage/auth";
import { setTotalQuantity } from "@/base/redux/features/cartSlice";

const UserMenu: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const fetchUserInfo = async () => {
    if (!authStorage.getAccessToken()) {
      return;
    }

    try {
      const userData = await getLoggedAccountApi();

      if (userData) {
        dispatch(
          setLoggedAccount({
            user: userData.data.user,
            accessToken: "",
          })
        );
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const responseData = await logoutApi();

      if (responseData) {
        message.success("You have been logged out!");
        authStorage.clearAuthCookieData();
        dispatch(logout());
        dispatch(setTotalQuantity({ totalQuantity: 0 }));
      }

      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      message.error("Logout failed. Please try again.");
    }
  };

  const authenticatedItems: MenuProps["items"] = [
    {
      key: "1",
      label: user?.name || "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: "Billing",
      icon: <UserOutlined />,
    },
    {
      key: "4",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "5",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const guestItems: MenuProps["items"] = [
    {
      key: "1",
      label: "新規会員登録",
      icon: <UserOutlined />,
      onClick: () => router.push("/auth/registration/mailaddress"),
    },
    {
      key: "2",
      label: "ログイン",
      icon: <LoginOutlined />,
      onClick: () => router.push("/auth/login"),
    },
  ];

  const items = isAuthenticated ? authenticatedItems : guestItems;

  return (
    <Dropdown menu={{ items }} trigger={["hover"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Image
          className="navbar-icon"
          src="/images/user.png"
          alt="User icon"
          width={24}
          height={24}
        />
      </a>
    </Dropdown>
  );
};

export default UserMenu;
