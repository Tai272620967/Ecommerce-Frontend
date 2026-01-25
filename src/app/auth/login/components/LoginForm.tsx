"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./LoginForm.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../../../../public/images/logo-muji.svg"; // Import SVG
import { useAppDispatch } from "@/base/redux/hook";
import { login } from "@/base/redux/features/authSlice";
import { loginApi } from "@/base/utils/api/auth";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { Button } from "@/base/components/Button/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/base/components/Input/Input";
import { AUTH_MESSAGES, SUCCESS_MESSAGES,VALIDATE_MESSAGES } from "@/base/utils/constant/constant";
import authStorage from "@/base/storage/auth";
import { cartTotalQuantityApi } from "@/base/utils/api/cart";
import { setTotalQuantity } from "@/base/redux/features/cartSlice";
import { getRoleFromToken } from "@/base/utils/jwt";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);

  const yupSchema = yup.object().shape({
    username: yup
      .string()
      .email(VALIDATE_MESSAGES.VALID_EMAIL)
      .required(VALIDATE_MESSAGES.EMAIL_REQUIRED),
    password: yup.string().required(VALIDATE_MESSAGES.PASSWORD_REQUIRED),
  });

  const defaultValues = {
    username: "",
    password: "",
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const fetchCartTotalQuantity = async () => {
    try {
      const cartTotalQuantityRes = await cartTotalQuantityApi();
      if (cartTotalQuantityRes) {
        // setCartTotalQuantity(cartTotalQuantityRes.data.totalQuantity);
        dispatch(setTotalQuantity({ totalQuantity: cartTotalQuantityRes.data.totalQuantity }));
      }
    } catch (error) {
      // Error fetching cart total quantity
    }
  };

  const handleLoginSubmit = async (data: Record<string, any>) => {
    setIsLoading(true);

    try {
      const responseData = await loginApi(data);

      if (responseData) {
        message.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        fetchCartTotalQuantity();
      }

      // Get role from JWT token if not in response
      const accessToken = responseData.data.access_token;
      let userRole = responseData.data.user?.role;
      
      // If role not in response, try to get from JWT token
      if (!userRole && accessToken) {
        userRole = getRoleFromToken(accessToken) || "USER";
      }

      // Ensure role is included in user object
      const userWithRole = {
        ...responseData.data.user,
        role: userRole || "USER",
      };

      dispatch(
        login({
          user: userWithRole,
          accessToken: accessToken,
        })
      );

      authStorage.setAccessToken(accessToken);

      // Redirect to dashboard if admin, otherwise to home
      if (userRole === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      message.error(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = () => {
    router.push("/auth/registration/edit/new");
  };

  return (
    <form
      className="login-container"
      onSubmit={handleSubmit(handleLoginSubmit)}
    >
      <div className="logo">
        <Logo />
      </div>
      <h4>Login</h4>
      <div className="login-form__wrapper">
        <div className="login-form__wrap__inner">
          <div className="login-form__content">
            <p className="login-form__content__title">For Members</p>
            <p className="login-form__content__text">
              Login with email address and password
            </p>
            <InputField
              className="login-input"
              name="username"
              register={register}
              errors={errors}
              placeHolder="Email Address"
            />
            <InputField
              className="login-input"
              name="password"
              register={register}
              errors={errors}
              type="password"
              placeHolder="Password"
            />
            <div className="login-form-button__wrapper">
              <Button className="login-form__button mt-0" isLoading={isLoading}>
                {!isLoading && "Login"}
              </Button>
            </div>
            <div className="login-form__forget-pw-button">
              <a href="#">Forgot Password</a>
            </div>
          </div>
        </div>
      </div>
      <div className="login-form__wrapper redirect-registration-page">
        <div className="login-form__wrapper__inner">
          <div className="login-form__content">
            <p className="login-form__content__title">New Member Registration</p>
            <div className="login-form-button__wrapper">
              <Button
                className="redirect-registration__button mt-0"
                type="button"
                onClick={handleRedirect}
              >
                Register as New Member
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
