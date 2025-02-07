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
      console.log("cartTotalQuantityRes", cartTotalQuantityRes.data.totalQuantity);
      if (cartTotalQuantityRes) {
        // setCartTotalQuantity(cartTotalQuantityRes.data.totalQuantity);
        dispatch(setTotalQuantity({ totalQuantity: cartTotalQuantityRes.data.totalQuantity }));
      }
    } catch (error) {
      console.error(error);
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

      dispatch(
        login({
          user: responseData.data.user,
          accessToken: responseData.data.access_token,
        })
      );

      authStorage.setAccessToken(responseData.data.access_token);

      router.push("/");
    } catch (error) {
      console.error("Login Error: ", error);
      message.error(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirect = () => {
    router.push("/auth/registration/mailaddress");
  };

  return (
    <form
      className="login-container"
      onSubmit={handleSubmit(handleLoginSubmit)}
    >
      <div className="logo">
        <Logo />
      </div>
      <h4>ログイン</h4>
      <div className="login-form__wrapper">
        <div className="login-form__wrap__inner">
          <div className="login-form__content">
            <p className="login-form__content__title">会員の方</p>
            <p className="login-form__content__text">
              メールアドレスとパスワードでログイン
            </p>
            <InputField
              className="login-input"
              name="username"
              register={register}
              errors={errors}
              placeHolder="メールアドレス"
            />
            <InputField
              className="login-input"
              name="password"
              register={register}
              errors={errors}
              type="password"
              placeHolder="パスワード"
            />
            <div className="login-form-button__wrapper">
              <Button className="login-form__button mt-0" isLoading={isLoading}>
                {!isLoading && "ログイン"}
              </Button>
            </div>
            <div className="login-form__forget-pw-button">
              <a href="#">パスワードを忘れたら</a>
            </div>
          </div>
        </div>
      </div>
      <div className="login-form__wrapper redirect-registration-page">
        <div className="login-form__wrapper__inner">
          <div className="login-form__content">
            <p className="login-form__content__title">新規会員登録</p>
            <div className="login-form-button__wrapper">
              <Button
                className="redirect-registration__button mt-0"
                type="button"
                onClick={handleRedirect}
              >
                新規メンバー登録
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
