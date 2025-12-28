"use client";
import { SubCategory } from "@/base/types/category";
import "./CategoryModal.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CategoryModalProps {
  categories?: SubCategory[];
  handleCloseModal?: () => void;
}

const divideCategories = (categories: SubCategory[], parts: number) => {
  const chunkSize = Math.ceil(categories.length / parts);
  return Array.from({ length: parts }, (_, i) =>
    categories.slice(i * chunkSize, (i + 1) * chunkSize)
  );
};

const CategoryModal: React.FC<CategoryModalProps> = ({
  categories = [],
  handleCloseModal,
}) => {
  const router = useRouter();
  const leftCategories = divideCategories(categories, 3);

  const handleCategoryClick = (category: SubCategory) => {
    router.push(`/product/subCategory/${category.id}`);
    if (handleCloseModal) {
      handleCloseModal();
    }
  };

  return (
    <div className="category-modal__container">
      <div className="category-modal__left">
        {leftCategories.map((chunk, index) => (
          <ul key={index}>
            {chunk.map((category, idx) => (
              <li key={idx} onClick={() => handleCategoryClick(category)}>{category.name}</li>
            ))}
          </ul>
        ))}
      </div>
      <div className="category-modal__right">
        <div className="category-modal__right__box">
          <p className="category-modal__right__box__menu-title">Featured</p>
          <ul>
            <li>Special Features</li>
            <li>New Products</li>
            <li>Articles</li>
            <li>Events</li>
            <li>Interior Consultation Booking</li>
          </ul>
        </div>
        <div className="category-modal__right__box">
          <p className="category-modal__right__box__menu-title">Great Deals</p>
          <ul>
            <li>Bulk Purchase</li>
            <li>SALE</li>
            <li>Reuse Market</li>
          </ul>
        </div>
        <div className="category-modal__right__box">
          <p className="category-modal__right__box__menu-title">
            Monthly Subscription Service
          </p>
          <ul>
            <li>Monthly Subscription Service Top</li>
          </ul>
        </div>
        <div className="category-modal__right__box">
          <p className="category-modal__right__box__menu-title">Catalog</p>
          <ul>
            <li>Storage, Furniture, Appliances, Fabric</li>
          </ul>
        </div>
        <div className="category-modal__right__box">
          <ul>
            <li>Find Stores</li>
            <li>Online Store Convenient Services</li>
            <li>About Ryohin Keikaku</li>
            <li>MUJI Donation Vouchers</li>
          </ul>
        </div>
      </div>
      <div className="category-modal__close-modal-button">
        <Image
          className="navbar-icon"
          src="/images/cross.png"
          alt="Cross icon"
          width={15}
          height={15}
          onClick={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default CategoryModal;
