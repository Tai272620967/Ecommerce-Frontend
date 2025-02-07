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
        message.error("住所が見つかりませんでした");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      message.error("住所の取得中にエラーが発生しました");
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
      <h1 className="registration-mailaddress__title">メンバーの登録</h1>
      <p>
        メンバー登録ができない場合は「メンバー登録の手順」をご確認ください。
      </p>
      <div className="registration-mail-layout">
        <div className="registration-mail-content">
          <div className="registration-mail-message">
            <span>ログイン情報</span>
            <br />
            <span>メールアドレス（ログインID）</span>
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
              label="ご希望のパスワード（必須）"
              type="password"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>※英字、数字、記号が使用可能です。</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="confirmPassword"
              register={register}
              errors={errors}
              placeHolder="＊＊＊＊＊＊＊＊"
              type="password"
              label="パスワードの確認（必須）"
              isCustom
            />
          </div>
        </div>
      </div>

      <div className="registration-mail-layout">
        <div className="registration-mail-content">
          <div className="registration-mail-message">
            <span>お客様の情報</span>
            <br />
            <span>メールアドレス（ログインID）</span>
            <br />
            <span>{emailValue}</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="firstName"
              register={register}
              errors={errors}
              placeHolder="無印"
              label="氏名（必須）"
              isCustom
            />
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="lastName"
              register={register}
              errors={errors}
              placeHolder="太郎"
              isCustom
            />
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="kataFirstName"
              register={register}
              errors={errors}
              label="フリガナ（必須）"
              placeHolder="ムジルシ"
              isCustom
            />
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="kataLastName"
              register={register}
              errors={errors}
              placeHolder="タロウ"
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
              label="郵便番号（必須）"
              placeHolder="112-0004"
              isCustom
              isCustomLabel
              // maxLength={8}
            />
            <Button className="zipcode-button" onClick={handleGetAddressByPostalCode} type="button">住所自動入力</Button>
          </div>
          <div className="registration-account__text">
            <span>
              ※郵便番号を入力して「住所自動入力」ボタンを押すと、県・市区町村名が入力されます。
            </span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="address1"
              register={register}
              errors={errors}
              label="住所（必須）"
              placeHolder="東京都文京区"
              isCustom
            />
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="address2"
              register={register}
              errors={errors}
              label="以降の住所（必須）"
              placeHolder="後楽"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>
              ※誤配送が多く発生しています。お届け先に誤りがないか、今一度ご確認ください。
            </span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="address3"
              register={register}
              errors={errors}
              label="丁目・番地（必須）"
              placeHolder="2丁目5番1号"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>※番地がない場合は「番地なし」とご入力ください。</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="address4"
              register={register}
              errors={errors}
              label="ビル・マンション・部屋番号"
              placeHolder="○○マンション１２３号室"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>※部屋番号まで必ずご入力ください。</span>
          </div>
          <div className="registration-mail-input__wrapper registration-account">
            <InputField
              className="registration-mail-input"
              name="phone"
              register={register}
              errors={errors}
              label="お届け時に連絡可能な電話番号（必須）"
              placeHolder="0000000000"
              isCustom
            />
          </div>
          <div className="registration-account__text">
            <span>※ハイフンなしの電話番号をご入力ください。</span>
          </div>
          <div className="registration-account--birthday__title">
            <span>生年月日</span>
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
              <span>年</span>
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
              <span>月</span>
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
              <span>日</span>
            </div>
          </div>
          <div className="registration-account__text">
            <span>
              ※誕生日をご登録いただくと、誕生月中のお買い物で、誕生日特典の対象となります。
              <span>
                <a href="#" className="registration-account__text__link">
                  詳細を見る
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
                <span>男性</span>
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
                <span>女性</span>
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
                <span>選択しない</span>
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
          {!isLoading && "規約に同意して登録する"}
        </Button>
      </div>
    </form>
  );
}
