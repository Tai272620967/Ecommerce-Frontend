"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/base/components/Input/Input";
import { Button } from "@/base/components/Button/Button";
import { message } from "antd";
import { verifyOtpCodeApi } from "@/base/utils/api/verifyOtpCode";
import { checkRegistMailAddressApi } from "@/base/utils/api/checkRegistMailAddress";
import { VALIDATE_MESSAGES } from "@/base/utils/constant/constant";

export default function CheckVerifyCode() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [emailValue, setEmailValue] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmailValue(storedEmail);
    }
  }, []);

  const yupSchema = yup.object().shape({
    verifyCode: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
  });

  const defaultValues = {
    email: emailValue,
    verifyCode: "",
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const handleVerifyOtpCode = async (data: Record<string, any>) => {
    setIsLoading(true);
    data.email = emailValue;

    try {
      const responseData = await verifyOtpCodeApi(data);

      if (responseData.data.verifiedOtp) {
        message.success(responseData.data.message);
        router.push("/auth/registration/edit/new");
      }
    } catch (error: any) {
      if (error.response.data) {
        message.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMail = async () => {
    try {
      if (emailValue) {
        const responseData = await checkRegistMailAddressApi({
          to: emailValue,
          subject: "[MUJI Online Store] Verification Code Issued",
        });

        if (responseData.data.verifyEmail) {
          message.success(responseData.data.message);
        }
      }
    } catch (error) {
      console.log("error", error);
      message.error("Send mail failed. Please try again.");
    } finally {
    }
  };

  // console.log(errors, "errors");
  // console.log(watch(), "watch");

  return (
    <form
      onSubmit={handleSubmit(handleVerifyOtpCode)}
      className="registration-mailaddress-container check-verify-code"
    >
      <h1 className="registration-mailaddress__title">Enter Verification Code</h1>
      <div className="registration-mail-layout">
        <div className="registration-mail-content">
          <div className="registration-mail-message">
            <span>
              Please enter the verification code sent to your email address.
            </span>
          </div>
          <div className="registration-mail-input__wrapper">
            <InputField
              className="registration-mail-input"
              name="verifyCode"
              register={register}
              errors={errors}
              placeHolder="Verification Code"
            />
          </div>
          <div>
            <div className="check-verify-code__button-wrapper">
              <button
                className="check-verify-code__resend-button"
                onClick={() => handleSendMail()}
                type="button"
              >
                Resend Verification Code
              </button>
            </div>
            <div className="check-verify-code__message-wrapper">
              <span className="check-verify-code__message">
                Verification code has been resent. Please check your email.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="registration-button-wrapper registration-button-wrapper--mt-large">
        <Button
          className="login-button mt-20 registration-button"
          isLoading={isLoading}
        >
          {!isLoading && "Submit Verification Code"}
        </Button>
      </div>
    </form>
  );
}
