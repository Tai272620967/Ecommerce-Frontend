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
          <p className="category-modal__right__box__menu-title">おすすめ情報</p>
          <ul>
            <li>特集</li>
            <li>新商品</li>
            <li>読みもの</li>
            <li>イベント</li>
            <li>インテリアの相談予約</li>
          </ul>
        </div>
        <div className="category-modal__right__box">
          <p className="category-modal__right__box__menu-title">お買い得</p>
          <ul>
            <li>まとめ買い</li>
            <li>SALE</li>
            <li>もったいない市</li>
          </ul>
        </div>
        <div className="category-modal__right__box">
          <p className="category-modal__right__box__menu-title">
            月額定額サービス
          </p>
          <ul>
            <li>月額定額サービストップ</li>
          </ul>
        </div>
        <div className="category-modal__right__box">
          <p className="category-modal__right__box__menu-title">カタログ</p>
          <ul>
            <li>収納・家具・家電・ファブリック</li>
          </ul>
        </div>
        <div className="category-modal__right__box">
          <ul>
            <li>店舗を探す</li>
            <li>ネットストアの便利なサービス</li>
            <li>良品計画について</li>
            <li>無印良品の募金券</li>
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
