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
import { VALIDATE_MESSAGES } from "@/base/utils/constant/constant";

export default function RegistrationMailAddress() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);

  const yupSchema = yup.object().shape({
    to: yup.string().email(VALIDATE_MESSAGES.VALID_EMAIL).required(VALIDATE_MESSAGES.FIELD_REQUIRED),
  });

  const defaultValues = {
    to: "",
    subject: "[AMAX Online Store] Verification Code Issued",
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
      // Skip email verification, go directly to registration form
      // Save email to localStorage for registration form
      localStorage.setItem("email", data.to);
      router.push("/auth/registration/edit/new");
    } catch (error: any) {
      if (error.response?.data?.error) {
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
        Member Registration Email Address
      </h1>
      <div className="registration-mail-layout">
        <div className="registration-mail-content">
          <div className="registration-mail-message">
            <span>Please enter your email address for member registration.</span>
          </div>
          <div className="registration-mail-message">
            <span>The email address will be used for login.</span>
          </div>
          <div className="registration-mail-input__wrapper">
            <InputField
              className="registration-mail-input"
              name="to"
              register={register}
              errors={errors}
              placeHolder="abcdef1234@amax.com"
            />
          </div>
          <ul className="registration-mail-note-list">
            <li>
              <span>※ The email address will be used for login.</span>
            </li>
            <li>
              <span>
                ※
                If you have domain restrictions set in your email settings, please allow (@amax.net) to receive emails.
              </span>
            </li>
            <li>
              <span>
                ※
                In accordance with internet standard specifications, some email addresses cannot be registered. For more details, please check
                <a href="https://faq.amax.com/--656d4e431c58e70026d3c45f">
                  here
                </a>
                .
              </span>
            </li>
            <li>
              <span>
                ※ For customers using Gmail and similar services, emails may be automatically sorted into "Promotions" or "Spam" folders. If you cannot confirm receipt, please check these folders as well.
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
            {!isLoading && "Continue to Registration"}
          </Button>
        </div>
    </form>
  );
}
