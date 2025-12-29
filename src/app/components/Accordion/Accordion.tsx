"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordion from "react-bootstrap/Accordion";
import "./Accordion.scss";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface AccordionCusProps {
  header?: string;
  items?: any[];
  icon?: string;
  isActive?: boolean;
}

const AccordionCustom: React.FC<AccordionCusProps> = ({
  header,
  items = [],
  icon,
  isActive = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleSelect = (path: string) => {
    router.push(path);
  };

  // Check if current pathname matches item path
  const isItemActive = (itemPath: string) => {
    return pathname === itemPath;
  };

  // Check if any item is active to determine if accordion should be open
  const hasActiveItem = items.some((item) => isItemActive(item.path));
  const shouldBeOpen = isActive || hasActiveItem;

  // Update activeKey when pathname changes
  useEffect(() => {
    if (shouldBeOpen) {
      setActiveKey("0");
    }
  }, [shouldBeOpen, pathname]);

  return (
    <Accordion activeKey={activeKey || undefined} onSelect={(key) => setActiveKey(key as string | null)}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className={`accordion-header__wrapper ${shouldBeOpen ? "active" : ""}`}>
            {icon && (
              <Image src={icon} alt="Products Icon" width={16} height={16} />
            )}
            <span className="accordion-header__title">{header}</span>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <ul className="accordion-items__wrapper">
            {items.map((item) => {
              const itemIsActive = isItemActive(item.path);
              return (
                <li
                  key={item.id}
                  className={`accordion-item__row ${
                    itemIsActive ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(item.path)}
                >
                  {item.text}
                </li>
              );
            })}
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default AccordionCustom;
