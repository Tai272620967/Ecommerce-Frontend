"use client";
import InputField from "@/base/components/Input/Input";
import "./Header.scss";
import { useForm } from "react-hook-form";
import { Button } from "@/base/components/Button/Button";
import Image from "next/image";
import UserMenu from "@/base/components/UserMenu/UserMenu";

export const HeaderDashboard: React.FC = () => {
  const defaultValues = {
    // userId: null,
    // productId: Number(productId),
    // quantity: quantity,
  };

  const {
    register,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(yupSchema),
    defaultValues,
  });

  return (
    <div className="header__wrapper">
      <div className="header__logo">
        <Image
          src="/images/logo-muji.svg"
          alt="MUJI Logo"
          width={120}
          height={24}
        />
        <span className="header__logo__text">無印良品</span>
      </div>
      <form className="header__search-form">
        <InputField
          name="search"
          register={register}
          errors={errors}
          className="header__search-input"
          placeHolder="Search..."
        />
        <Button className="header__search-button">
          <Image
            src="/images/search.svg"
            alt="Search icon"
            width={16}
            height={16}
          />
        </Button>
      </form>
      <div className="header__right">
        <div className="header__right__notification">
          <Image
            src="/images/bell-notification-social-media.svg"
            alt="Notification icon"
            width={20}
            height={20}
          />
        </div>
        <UserMenu />
      </div>
    </div>
  );
};

export default HeaderDashboard;
