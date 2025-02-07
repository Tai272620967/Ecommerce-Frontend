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
            width={14}
            height={14}
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
