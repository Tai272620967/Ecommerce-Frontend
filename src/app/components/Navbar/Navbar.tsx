"use client";
import "./Navbar.scss";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Category, SubCategory } from "@/base/types/category";
import {
  fetchAllMainCategoryApi,
  fetchSubCategoriesApi,
} from "@/base/utils/api/category";
import CategoryModal from "./CategoryModal/CategoryModal";
import NavbarSearch from "../NavbarSearch/NavbarSearch";
import { useAppDispatch } from "@/base/redux/hook";
import { cartTotalQuantityApi } from "@/base/utils/api/cart";
import authStorage from "@/base/storage/auth";
import { setTotalQuantity } from "@/base/redux/features/cartSlice";

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
    };

    fetchSubCategories();
    // if (subCategories) {
    //   setSubCategoriesData(subCategories);
    // }

    const fetchCartTotalQuantity = async () => {
      try {
        const cartTotalQuantityRes = await cartTotalQuantityApi();
        if (cartTotalQuantityRes) {
          dispatch(
            setTotalQuantity({
              totalQuantity: cartTotalQuantityRes.data.totalQuantity,
            })
          );
        }
      } catch (error) {
        // Error fetching cart total quantity
      }
    };

    if (authStorage.getAccessToken()) {
      fetchCartTotalQuantity();
    }
  }, []);

  const handleChangeMainCategory = useCallback((mainCategoryId: number) => {
    setSubCategoriesDataFilter(
      subCategoriesData?.filter(
        (category) => category.mainCategory?.id === mainCategoryId
      ) || []
    );
  }, [subCategoriesData]);

  useEffect(() => {
    const fetchAllMainCategories = async () => {
      try {
        const response = await fetchAllMainCategoryApi();
        if (response) {
          setMainCategories(response.data.result);
        }
      } catch (err) {
        // Error fetching main categories
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
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={180}
            height={60}
            style={{ objectFit: "contain" }}
          />
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
        <div className="navbar-search-wrapper">
          <NavbarSearch categories={mainCategories} />
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
