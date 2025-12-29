"use client";
import "./Header.scss";
import Image from "next/image";
import UserMenu from "@/base/components/UserMenu/UserMenu";

export const HeaderDashboard: React.FC = () => {
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
