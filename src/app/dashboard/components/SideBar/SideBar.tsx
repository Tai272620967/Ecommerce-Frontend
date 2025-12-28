"use client";
import { useState } from "react";
import "./SideBar.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AccordionCustom from "@/base/components/Accordion/Accordion";

const SideBar: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();

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
    {
      id: 4,
      text: "Chart",
      icon: "/images/chart-simple.svg",
      path: "/dashboard/chart",
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

  const handleSelect = (id: number, path: string) => {
    setSelectedIndex(id);
    router.push(path);
  };

  return (
    <div className="sidebar__wrapper">
      <div className="sidebar__title">
        <Image src="/images/logo-muji.svg" width={150} height={30} alt="Logo" />
      </div>
      <ul className="sidebar__list">
        {items.map((item) => {
          // Render AccordionCustom for Users, Products, Orders
          if (
            ["Users", "Products", "Orders"].includes(item.text)
          ) {
            const accordionItems = getAccordionItems(item.text);
            return (
              <AccordionCustom
                key={item.id}
                header={item.text}
                items={accordionItems}
                icon={item.icon}
              />
            );
          }

          // Render regular <li> for Overview and Chart
          return (
            <li
              key={item.id}
              className={`sidebar__list__item ${
                selectedIndex === item.id ? "selected" : ""
              }`}
              onClick={() => handleSelect(item.id, item.path)}
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
