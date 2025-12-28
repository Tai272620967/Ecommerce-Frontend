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
import { getAddressByPostalCode } from "@/base/utils/api/getAddressByPostalCode";
import { registerAccountApi } from "@/base/utils/api/auth";
import { VALIDATE_MESSAGES, SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/base/utils/constant/constant";

export default function RegisterAccount() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [emailValue, setEmailValue] = useState<string | null>("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmailValue(storedEmail);
    }
  }, []);

  const yupSchema = yup.object().shape({
    password: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], VALIDATE_MESSAGES.CONFIRM_PASSWORD_IS_NOT_MATCHED)
      .required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    firstName: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    lastName: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    kataFirstName: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    kataLastName: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    postalCode: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    address1: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    address2: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    address3: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
    phone: yup.string().required(VALIDATE_MESSAGES.FIELD_REQUIRED),
  });

  const defaultValues = {
    email: emailValue,
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    kataFirstName: "",
    kataLastName: "",
    postalCode: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    phone: "",
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const handleGetAddressByPostalCode = async () => {
    const postalCodeValue = watch("postalCode"); // Get the current postal code value from the form
    if (!postalCodeValue) {
      message.error(VALIDATE_MESSAGES.POSTAL_CODE_REQUIRED);
      return;
    }
  
    try {
      const address = await getAddressByPostalCode(postalCodeValue);
      if (address) {
        // Optionally, you can update the address fields in the form
        setValue("address1", address.prefecture || "");
        setValue("address2", address.city || "");
        setValue("address3", address.area || "");
      } else {
        message.error("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      message.error("An error occurred while fetching the address");
    }
  };  

  const handleRegisterAccount = async (data: Record<string, any>) => {
    data.email = localStorage.getItem("email");
    setIsLoading(true);

    try {
      const responseData = await registerAccountApi(data);

      if (responseData) {
        message.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Register Account fail: ", error);
      message.error(ERROR_MESSAGES.REGISTER_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(errors, "errors");
  // console.log(watch(), "watch");

  return (
    <form
      onSubmit={handleSubmit(handleRegisterAccount)}
      className="registration-mailaddress-container check-verify-code"
    >
      <h1 className="registration-mailaddress__title">Member Registration</h1>
      <p>
        If you are unable to register, please check the "Member Registration Instructions".
      </p>
      <div className="registration-mail-layout">
        <div className="registration-mail-content">
          <div className="registration-mail-message">
            <span>Login Information</span>
            <br />
            <span>Email Address (Login ID)</span>
            <br />
            <span>{emailValue}</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="password"
              register={register}
              errors={errors}
              placeHolder="＊＊＊＊＊＊＊＊"
              label="Desired Password (Required)"
              type="password"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>※Letters, numbers, and symbols can be used.</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="confirmPassword"
              register={register}
              errors={errors}
              placeHolder="＊＊＊＊＊＊＊＊"
              type="password"
              label="Confirm Password (Required)"
              isCustom
            />
          </div>
        </div>
      </div>

      <div className="registration-mail-layout">
        <div className="registration-mail-content">
          <div className="registration-mail-message">
            <span>Customer Information</span>
            <br />
            <span>Email Address (Login ID)</span>
            <br />
            <span>{emailValue}</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="firstName"
              register={register}
              errors={errors}
              placeHolder="John"
              label="First Name (Required)"
              isCustom
            />
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="lastName"
              register={register}
              errors={errors}
              placeHolder="Smith"
              isCustom
            />
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="kataFirstName"
              register={register}
              errors={errors}
              label="Furigana (First Name) (Required)"
              placeHolder="John"
              isCustom
            />
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="kataLastName"
              register={register}
              errors={errors}
              label="Furigana (Last Name) (Required)"
              placeHolder="Smith"
              isCustom
            />
          </div>
          <div className="registration-mail-input__wrapper registration-account--address">
            <div className="registration-account--address__symbol">
              <span>〒</span>
            </div>
            <InputField
              className="registration-mail-input"
              name="postalCode"
              register={register}
              errors={errors}
              label="Postal Code (Required)"
              placeHolder="112-0004"
              isCustom
              isCustomLabel
              // maxLength={8}
            />
            <Button className="zipcode-button" onClick={handleGetAddressByPostalCode} type="button">Auto-fill Address</Button>
          </div>
          <div className="registration-account__text">
            <span>
              ※Enter your postal code and click the "Auto-fill Address" button to automatically fill in the prefecture and city/town name.
            </span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="address1"
              register={register}
              errors={errors}
              label="Address (Required)"
              placeHolder="Tokyo, Bunkyo-ku"
              isCustom
            />
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="address2"
              register={register}
              errors={errors}
              label="Address Line 2 (Required)"
              placeHolder="Koraku"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>
              ※Many delivery errors occur. Please double-check that your delivery address is correct.
            </span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="address3"
              register={register}
              errors={errors}
              label="Street Number (Required)"
              placeHolder="2-5-1"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>※If there is no street number, please enter "No street number".</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="address4"
              register={register}
              errors={errors}
              label="Building/Apartment/Room Number"
              placeHolder="○○ Apartment Room 123"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>※Please be sure to enter the room number.</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="phone"
              register={register}
              errors={errors}
              label="Phone Number for Delivery Contact (Required)"
              placeHolder="0000000000"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>※Please enter your phone number without hyphens.</span>
          </div>
          <div className="registration-account--birthday__title">
            <span>Date of Birth</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account--birthday">
            <div>
              <InputField
                className="registration-mail-input"
                name="year"
                register={register}
                errors={errors}
                isCustom
              />
            </div>
            <div className="registration-account--birthday__text">
              <span>Year</span>
            </div>
            <div className="registration-account--birthday__month">
              <InputField
                className="registration-mail-input"
                name="month"
                register={register}
                errors={errors}
                isCustom
              />
            </div>
            <div className="registration-account--birthday__text">
              <span>Month</span>
            </div>
            <div className="registration-account--birthday__day">
              <InputField
                className="registration-mail-input"
                name="day"
                register={register}
                errors={errors}
                isCustom
              />
            </div>
            <div className="registration-account--birthday__text">
              <span>Day</span>
            </div>
          </div>
          <div className="registration-account__text">
            <span>
              ※By registering your birthday, you will be eligible for birthday benefits when shopping during your birth month.
              <span>
                <a href="#" className="registration-account__text__link">
                  View Details
                </a>
              </span>
            </span>
          </div>
          <div className="registration-account-gender-wrapper">
            <div className="registration-account-gender__input-group">
              <InputField
                className="input-field--type-radio"
                name="men"
                register={register}
                errors={errors}
                type="radio"
                isCustom
              />
              <div className="registration-account-gender__input-group__text">
                <span>Male</span>
              </div>
            </div>
            <div className="registration-account-gender__input-group">
              <InputField
                className="input-field--type-radio"
                name="women"
                register={register}
                errors={errors}
                type="radio"
                isCustom
              />
              <div className="registration-account-gender__input-group__text">
                <span>Female</span>
              </div>
            </div>
            <div className="registration-account-gender__input-group">
              <InputField
                className="input-field--type-radio"
                name="other"
                register={register}
                errors={errors}
                type="radio"
                isCustom
              />
              <div className="registration-account-gender__input-group__text">
                <span>Prefer not to say</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="registration-button-wrapper registration-button-wrapper--mt-large">
        <Button
          className="login-button mt-20 registration-button"
          isLoading={isLoading}
        >
          {!isLoading && "Agree to Terms and Register"}
        </Button>
      </div>
    </form>
  );
}
