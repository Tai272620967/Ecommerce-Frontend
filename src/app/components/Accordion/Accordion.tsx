"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordion from "react-bootstrap/Accordion";
import "./Accordion.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AccordionCusProps {
  header?: string;
  items?: any[];
  icon?: string;
}

const AccordionCustom: React.FC<AccordionCusProps> = ({
  header,
  items = [],
  icon,
}) => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (id: number, path: string) => {
    setSelectedIndex(id);
    router.push(path);
  };

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className="accordion-header__wrapper">
            {icon && (
              <Image src={icon} alt="Products Icon" width={16} height={16} />
            )}
            <span className="accordion-header__title">{header}</span>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <ul className="accordion-items__wrapper">
            {items.map((item, index) => (
              <li
                key={index}
                className={`accordion-item__row ${
                  selectedIndex == item.id ? "selected" : ""
                }`}
                onClick={() => handleSelect(item.id, item.path)}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default AccordionCustom;
