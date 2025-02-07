"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordion from "react-bootstrap/Accordion";
import "./AccordionCategory.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Category } from "@/base/types/category";

interface AccordionCusProps {
  header?: string;
  items?: any[];
  icon?: string;
}

const AccordionCategory: React.FC<AccordionCusProps> = ({
  header,
  items = [],
  icon,
}) => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  //   const handleSelect = (id: number, path: string) => {
  //     setSelectedIndex(id);
  //     // router.push(path);
  //   };

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className="accordion-category-header__wrapper">
            <Image
              src="/images/apps.svg"
              alt="Products Icon"
              width={14}
              height={14}
            />
            <span className="accordion-category-header__title">{header}</span>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <ul className="accordion-category-items__wrapper">
            {items.map((item, index) => (
              <li
                key={index}
                className={`accordion-category-item__row ${
                  selectedIndex == item.id ? "selected" : ""
                }`}
                // onClick={() => handleSelect(item.id, item.path)}
              >
                <div className="accordion-category-item__row__name">
                  <Image
                    src="/images/apps.svg"
                    alt="Products Icon"
                    width={14}
                    height={14}
                  />
                  {item.name}
                </div>
                <ul className="accordion-category-item__row__list">
                  {item.categories.map((category: Category, index: number) => (
                    <li key={index}>{category.name}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default AccordionCategory;
