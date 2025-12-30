"use client";
import { useState, useEffect } from "react";
import "./SideBar.scss";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import AccordionCustom from "@/base/components/Accordion/Accordion";

const SideBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { id: 0, text: "Overview", icon: "/images/home.svg", path: "/dashboard" },
    {
      id: 1,
      text: "Users",
      icon: "/images/circle-user.svg",
      path: "/dashboard/user",
    },
    {
      id: 2,
      text: "Products",
      icon: "/images/box-open.svg",
      path: "/dashboard/product",
    },
    {
      id: 3,
      text: "Orders",
      icon: "/images/rectangle-list.svg",
      path: "/dashboard/order",
    },
  ];

  // Define dynamic accordionItems based on the selected item
  const getAccordionItems = (itemText: string) => {
    switch (itemText) {
      case "Users":
        return [
          { id: 1, text: "List User", path: "/dashboard/user" },
        ];
      case "Products":
        return [
          { id: 1, text: "List Product", path: "/dashboard/product" },
          { id: 2, text: "Create Product", path: "/dashboard/product/create" },
        ];
      case "Orders":
        return [
          { id: 1, text: "List Orders", path: "/dashboard/order" },
        ];
      default:
        return [];
    }
  };

  const handleSelect = (path: string) => {
    router.push(path);
  };

  // Check if current pathname matches item path
  const isItemActive = (itemPath: string) => {
    if (pathname === itemPath) {
      return true;
    }
    // For nested routes, check if pathname starts with item path
    // e.g., /dashboard/product/create should highlight Products
    if (pathname?.startsWith(itemPath + "/")) {
      return true;
    }
    return false;
  };

  return (
    <div className="sidebar__wrapper">
      <div className="sidebar__title">
        <Image 
          src="/images/logo-muji.svg" 
          width={120} 
          height={24} 
          alt="Logo" 
          style={{ objectFit: "contain" }}
        />
      </div>
      <ul className="sidebar__list">
        {items.map((item) => {
          // Render AccordionCustom for Users, Products, Orders
          if (
            ["Users", "Products", "Orders"].includes(item.text)
          ) {
            const accordionItems = getAccordionItems(item.text);
            const isActive = isItemActive(item.path);
            return (
              <AccordionCustom
                key={item.id}
                header={item.text}
                items={accordionItems}
                icon={item.icon}
                isActive={isActive}
              />
            );
          }

          // Render regular <li> for Overview and Chart
          const isActive = isItemActive(item.path);
          return (
            <li
              key={item.id}
              className={`sidebar__list__item ${
                isActive ? "selected" : ""
              }`}
              onClick={() => handleSelect(item.path)}
            >
              <Image
                src={item.icon}
                alt={`${item.text} icon`}
                width={16}
                height={16}
              />
              <span className="sidebar__list__item-text">{item.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
