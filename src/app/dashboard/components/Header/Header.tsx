"use client";
import "./Header.scss";
import Image from "next/image";
import UserMenu from "@/base/components/UserMenu/UserMenu";

export const HeaderDashboard: React.FC = () => {
  return (
    <div className="header__wrapper">
      <div className="header__logo">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={180}
          height={60}
          style={{ objectFit: "contain" }}
        />
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
