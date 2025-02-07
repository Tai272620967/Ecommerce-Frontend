"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/base/components/Input/Input";
import { Button } from "@/base/components/Button/Button";
import { message } from "antd";
import { checkRegistMailAddressApi } from "@/base/utils/api/checkRegistMailAddress";
import { VALIDATE_MESSAGES } from "@/base/utils/constant/constant";

export default function RegistrationMailAddress() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);

  const yupSchema = yup.object().shape({
    to: yup.string().email(VALIDATE_MESSAGES.VALID_EMAIL).required(VALIDATE_MESSAGES.FIELD_REQUIRED),
  });

  const defaultValues = {
    to: "",
    subject: "［無印良品ネットストア］認証コード発行",
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const handleCheckRegistMailAddress = async (data: Record<string, any>) => {
    setIsLoading(true);

    try {
      const responseData = await checkRegistMailAddressApi(data);

      if (responseData.data.verifyEmail) {
        message.success(responseData.data.message);
        router.push("/auth/registration/mailaddress/checkVerifyCode");
        localStorage.setItem("email", data.to);
      }

    } catch (error: any) {
      if (error.response.data.error) {
        message.error(error.response.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(errors, "errors");
  // console.log(watch(), "watch");

  return (
    <form
      onSubmit={handleSubmit(handleCheckRegistMailAddress)}
      className="registration-mailaddress-container"
    >
      <h1 className="registration-mailaddress__title">
        会員登録メールアドレス入力
      </h1>
      <div className="registration-mail-layout">
        <div className="registration-mail-content">
          <div className="registration-mail-message">
            <span>会員登録のため、メールアドレスの認証をいたします。</span>
          </div>
          <div className="registration-mail-message">
            <span>受信が可能なメールアドレスを入力してください。</span>
          </div>
          <div className="registration-mail-message">
            <span>
              ご入力いただいたメールアドレスに、認証コードをお送りします。
            </span>
          </div>
          <div className="registration-mail-input__wrapper">
            <InputField
              className="registration-mail-input"
              name="to"
              register={register}
              errors={errors}
              placeHolder="abcdef1234@muji.com"
            />
          </div>
          <ul className="registration-mail-note-list">
            <li>
              <span>※ メールアドレスは、ログインに使用します。</span>
            </li>
            <li>
              <span>
                ※
                受信メールの設定でドメイン制限をされている方は、（@muji.net）が受信できるよう解除してください。
              </span>
            </li>
            <li>
              <span>
                ※
                インターネット標準仕様に則り、登録いただけないメールアドレスがございます。詳しくは
                <a href="https://faq.muji.com/--656d4e431c58e70026d3c45f">
                  こちら
                </a>
                にてご確認ください。
              </span>
            </li>
            <li>
              <span>
                ※Gmail等をご利用のお客様は、自動的に「プロモーション」や「迷惑メール」フォルダに振り分けられる場合があります。受信が確認できない場合、上記フォルダも確認ください。
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="registration-button-wrapper">
          <Button
            className="login-button mt-0 registration-button"
            isLoading={isLoading}
          >
            {!isLoading && "認証コードを送る"}
          </Button>
        </div>
    </form>
  );
}
