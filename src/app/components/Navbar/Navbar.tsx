"use client";
import "./Navbar.scss";
import Image from "next/image";
import Logo from "../../../../public/images/logo-muji.svg";
import UserMenu from "../UserMenu/UserMenu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Category, SubCategory } from "@/base/types/category";
import { fetchAllMainCategoryApi, fetchSubCategoriesApi } from "@/base/utils/api/category";
import CategoryModal from "./CategoryModal/CategoryModal";
import { useAppDispatch, useAppSelector } from "@/base/redux/hook";
import { cartTotalQuantityApi } from "@/base/utils/api/cart";
import authStorage from "@/base/storage/auth";
import { setTotalQuantity } from "@/base/redux/features/cartSlice";
import { useRouter } from "next/navigation";

interface NavbarProps {
  subCategories?: SubCategory[];
}

const NavbarCommon: React.FC<NavbarProps> = () => {
  // console.log("subCategories", subCategories)
  const [mainCategoryId, setMainCategoryId] = useState<number | null>(null);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategoriesData, setSubCategoriesData] = useState<SubCategory[]>([]);
  const [subCategoriesDataFilter, setSubCategoriesDataFilter] = useState<
    SubCategory[]
  >([]);
  const router = useRouter();

  const cart = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();

  const [isShowCategoryModal, setIsShowCategoryModal] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchSubCategories = async () => {
      const response = await fetchSubCategoriesApi();
      try {
        if (response) {
          setSubCategoriesData(response.data.result);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchSubCategories();
    // if (subCategories) {
    //   setSubCategoriesData(subCategories);
    // }

    const fetchCartTotalQuantity = async () => {
      try {
        const cartTotalQuantityRes = await cartTotalQuantityApi();
        if (cartTotalQuantityRes) {
          dispatch(setTotalQuantity({ totalQuantity: cartTotalQuantityRes.data.totalQuantity }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (authStorage.getAccessToken()) {
      fetchCartTotalQuantity();
    }
  }, []);

  const handleChangeMainCategory = (mainCategoryId: number) => {
    setSubCategoriesDataFilter(
      subCategoriesData?.filter(
        (category) => category.mainCategory?.id === mainCategoryId
      ) || []
    );
  };

  useEffect(() => {
    const fetchAllMainCategories = async () => {
      try {
        const response = await fetchAllMainCategoryApi();
        if (response) {
          setMainCategories(response.data.result);
        }
      } catch (err) {
        // setError("Failed to fetch categories");
        console.error(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchAllMainCategories();
  }, []);

  const handleShowCategoryModal = (id: number) => {
    if (id === mainCategoryId) {
      // Nếu ID category hiện tại giống ID đang chọn, tắt modal
      setIsShowCategoryModal(false);
      setMainCategoryId(null);
      setSubCategoriesDataFilter([]);
    } else {
      // Nếu ID khác, hiển thị modal với nội dung mới
      setIsShowCategoryModal(true);
      setMainCategoryId(id);
      handleChangeMainCategory(id);
      document.body.style.overflow = "hidden"; // Khóa cuộn trang
    }
  };

  const handleCloseCategoryModal = () => {
    setIsShowCategoryModal(false);
    setMainCategoryId(null);
    document.body.style.overflow = ""; // Khôi phục cuộn trang
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        <Link
          href={"/"}
          className="navbar-logo"
          onClick={handleCloseCategoryModal}
        >
          <Logo />
        </Link>
        <div className="navbar-center">
          <ul>
            {mainCategories.map((category) => (
              <li
                key={category.id}
                onClick={() => handleShowCategoryModal(category.id)}
                className={
                  mainCategoryId === category.id ? "selected-category" : ""
                }
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-right">
          <Image
            className="navbar-icon"
            src="/images/search-interface-symbol.png"
            alt="Search icon"
            width={24}
            height={24}
          />
          <UserMenu />
          <Image
            className="navbar-icon"
            src="/images/heart.png"
            alt="Heart icon"
            width={24}
            height={24}
          />
          <div className="cartIcon-wrapper" onClick={() => router.push("/cart")}>
            <span className="cartIcon-itemCount">{cart?.totalQuantity}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="16"
              fill="none"
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
          </div>
          <Image
            className="navbar-icon"
            src="/images/attention.png"
            alt="Attention icon"
            width={24}
            height={24}
          />
        </div>
      </div>
      {isShowCategoryModal && (
        <div className="category-modal__wrapper">
          {isShowCategoryModal && (
            <CategoryModal
              categories={subCategoriesDataFilter}
              handleCloseModal={handleCloseCategoryModal}
            />
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarCommon;
