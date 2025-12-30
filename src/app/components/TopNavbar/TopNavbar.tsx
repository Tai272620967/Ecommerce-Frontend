"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserMenu from "../UserMenu/UserMenu";
import { useAppSelector } from "@/base/redux/hook";
import "./TopNavbar.scss";

const TopNavbar: React.FC = () => {
  const router = useRouter();
  const cart = useAppSelector((state) => state.cart);
  const wishlist = useAppSelector((state) => state.wishlist);

  return (
    <div className="top-navbar">
      <div className="top-navbar__container">
        <div className="top-navbar__left">
          <span className="top-navbar__header-text top-navbar__header-text--left">
            Online Store Exclusive
          </span>
          <span className="top-navbar__header-text top-navbar__header-text--center">
            Apparel, Daily Goods, etc. Tax included
            <span className="top-navbar__header-text-large">5,000</span>
            $ or more purchase
          </span>
          <span className="top-navbar__header-text top-navbar__header-text--right">
            Free Shipping
          </span>
        </div>
        <div className="top-navbar__right">
          <UserMenu />
          <button
            className="top-navbar__icon-button top-navbar__wishlist-button"
            onClick={() => router.push("/wishlist")}
            aria-label="Wishlist"
          >
            {wishlist?.totalCount > 0 && (
              <span className="top-navbar__wishlist-count">{wishlist.totalCount}</span>
            )}
            <Image
              className="top-navbar__icon"
              src="/images/heart.png"
              alt="Wishlist"
              width={20}
              height={20}
            />
          </button>
          <button
            className="top-navbar__icon-button top-navbar__cart-button"
            onClick={() => router.push("/cart")}
            aria-label="Cart"
          >
            <span className="top-navbar__cart-count">{cart?.totalQuantity || 0}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="16"
              fill="none"
              className="top-navbar__cart-icon"
            >
              <path
                stroke="#3C3C43"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="1.5"
                d="M1 .972h1.838c.075 0 .15.062.162.137l1.336 8.567c0 .075.075.137.163.137H17.5a.16.16 0 0 0 .162-.137l1.586-8.305"
              ></path>
              <path
                fill="#3C3C43"
                d="M6.732 15.307a2.035 2.035 0 1 0 0-4.07 2.035 2.035 0 0 0 0 4.07ZM15.273 15.307a2.035 2.035 0 1 0 0-4.07 2.035 2.035 0 0 0 0 4.07Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;

