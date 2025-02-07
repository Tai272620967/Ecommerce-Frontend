"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/base/components/Button/Button";
import "./ProductDetail.scss";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/base/types/Product";
import { fetchProductByIdApi } from "@/base/utils/api/product";
import { convertToNumberFormat } from "@/base/utils";
import { useForm } from "react-hook-form";
import InputField from "@/base/components/Input/Input";
import { useAppDispatch, useAppSelector } from "@/base/redux/hook";
import { addToCartApi } from "@/base/utils/api/cart";
import { message } from "antd";
import { setTotalQuantity } from "@/base/redux/features/cartSlice";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);

  console.log("isLoading", isLoading);

  const user = useAppSelector((state) => state.user.user);
  // const cart = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();

  const defaultValues = {
    userId: null,
    productId: Number(productId),
    quantity: quantity,
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    // resolver: yupResolver(yupSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetchProductByIdApi(productId);
        if (response) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductById();
  }, [productId]);

  // Hàm tăng số lượng
  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      setValue("quantity", newQuantity); // Cập nhật giá trị input
      return newQuantity;
    });
  };

  // Hàm giảm số lượng
  const handelDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => {
        const newQuantity = prevQuantity - 1;
        setValue("quantity", newQuantity); // Cập nhật giá trị input
        return newQuantity;
      });
    }
  };

  const handleAddToCart = async (data: Record<string, any>) => {
    setIsLoading(true);
    data.userId = user?.id;

    try {
      const response = await addToCartApi(data);
      if (response.statusCode == 200) {
        message.success(response.data.message);
        dispatch(
          setTotalQuantity({ totalQuantity: response.data.totalQuantity })
        );
      }
    } catch (error) {
      console.error("Add to cart Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="product-detail__wrapper"
      onSubmit={handleSubmit(handleAddToCart)}
    >
      <div className="product-detail__bread-crumbs">
        <ul className="product-detail__bread-crumbs__list">
          <li className="product-detail__bread-crumbs__list__item">
            <a href="">無印良品</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="#D8D8D9"
              className="BreadCrumbs_list__icon__vqjGm"
            >
              <path d="m6 13 5-5-5-5"></path>
            </svg>
          </li>
          <li className="product-detail__bread-crumbs__list__item">
            <a href="">家具・収納・家電</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="#D8D8D9"
              className="BreadCrumbs_list__icon__vqjGm"
            >
              <path d="m6 13 5-5-5-5"></path>
            </svg>
          </li>
          <li className="product-detail__bread-crumbs__list__item">
            <a href="">家具</a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="#D8D8D9"
              className="BreadCrumbs_list__icon__vqjGm"
            >
              <path d="m6 13 5-5-5-5"></path>
            </svg>
          </li>
        </ul>
      </div>
      <div className="product-detail">
        <div className="product-detail__image">
          <div className="product-detail__image__thumbnail-list">
            <div className="product-detail__image__thumbnail-list__item">
              <Image
                className="navbar-icon"
                src="/images/products/furniture/F-1.avif"
                alt="Heart icon"
                width={48}
                height={48}
              />
            </div>
            <div className="product-detail__image__thumbnail-list__item">
              <Image
                className="navbar-icon"
                src="/images/products/furniture/F-1.avif"
                alt="Heart icon"
                width={48}
                height={48}
              />
            </div>
            <div className="product-detail__image__thumbnail-list__item">
              <Image
                className="navbar-icon"
                src="/images/products/furniture/F-1.avif"
                alt="Heart icon"
                width={48}
                height={48}
              />
            </div>
            <div className="product-detail__image__thumbnail-list__item">
              <Image
                className="navbar-icon"
                src="/images/products/furniture/F-1.avif"
                alt="Heart icon"
                width={48}
                height={48}
              />
            </div>
            <div className="product-detail__image__thumbnail-list__item">
              <Image
                className="navbar-icon"
                src="/images/products/furniture/F-1.avif"
                alt="Heart icon"
                width={48}
                height={48}
              />
            </div>
            <div className="product-detail__image__thumbnail-list__item">
              <Image
                className="navbar-icon"
                src="/images/products/furniture/F-1.avif"
                alt="Heart icon"
                width={48}
                height={48}
              />
            </div>
          </div>
          <div className="product-detail__image__main-photo">
            <div className="product-detail__image__thumbnail-list__item">
              {product?.imageUrl && (
                <Image
                  src={process.env.NEXT_PUBLIC_API_BASE_URI + product?.imageUrl as string}
                  alt="Main image"
                  width={734}
                  height={734}
                />
              )}
            </div>
          </div>
        </div>
        <div className="product-detail__description">
          <div className="product-detail__description__headline">
            <h1 className="product-detail__description__headline__title">
              {product?.name}
            </h1>
          </div>
          <div className="product-detail__description__info">
            <div className="product-detail__description__info__content">
              <div className="product-detail__description__info__main">
                <p className="product-detail__description__info__main__text">
                  シングル
                </p>
                <p className="product-detail__description__info__main__product-number">
                  <span className="product-detail__description__info__main__product-number__title">
                    商品番号
                  </span>
                  <span className="product-detail__description__info__main__product-number__value">
                    12851660
                  </span>
                </p>
              </div>
              <div className="product-detail__description__info__heart__wrapper">
                <button
                  type="button"
                  className="product-detail__description__info__heart__button"
                >
                  <span className="product-detail__description__info__heart__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#FFFFFF"
                      stroke="#E0CEAA"
                      color="#FFFFFF"
                    >
                      <path d="M14.63 2.047c-3.47-.433-4.498 2.226-4.68 2.846 0 .035-.057.035-.068 0-.194-.621-1.21-3.28-4.681-2.846-4.407.551-5.251 6.185-2.98 8.844 1.541 1.792 5.913 6.325 7.295 7.766a.534.534 0 0 0 .776 0l7.306-7.766c2.226-2.507 1.427-8.293-2.968-8.832v-.012z"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            <div className="product-detail__description__info__rating">
              <div className="product-detail__description__info__rating__inner">
                <div className="product-detail__description__info__rating__inner__star__wrapper">
                  <span className="product-detail__description__info__rating__inner__star">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                    >
                      <g clipPath="url(#20px_star_BEIGE_svg__a)">
                        <path
                          fill="#E0CEAA"
                          d="M18.19 8.09a.75.75 0 0 0-.72-.52h-5.16l-1.6-4.91a.74.74 0 0 0-.71-.531.74.74 0 0 0-.71.531l-1.6 4.91H2.53a.75.75 0 0 0-.72.52.74.74 0 0 0 .28.84l4.17 3-1.59 4.95a.75.75 0 0 0 .27.83.72.72 0 0 0 .88 0l4.18-3 4.18 3a.71.71 0 0 0 .44.15.73.73 0 0 0 .44-.15.75.75 0 0 0 .27-.83L13.74 12l4.17-3a.74.74 0 0 0 .28-.91z"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="20px_star_BEIGE_svg__a">
                          <path fill="#fff" d="M0 0h20v20H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span className="product-detail__description__info__rating__inner__star">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                    >
                      <g clipPath="url(#20px_star_BEIGE_svg__a)">
                        <path
                          fill="#E0CEAA"
                          d="M18.19 8.09a.75.75 0 0 0-.72-.52h-5.16l-1.6-4.91a.74.74 0 0 0-.71-.531.74.74 0 0 0-.71.531l-1.6 4.91H2.53a.75.75 0 0 0-.72.52.74.74 0 0 0 .28.84l4.17 3-1.59 4.95a.75.75 0 0 0 .27.83.72.72 0 0 0 .88 0l4.18-3 4.18 3a.71.71 0 0 0 .44.15.73.73 0 0 0 .44-.15.75.75 0 0 0 .27-.83L13.74 12l4.17-3a.74.74 0 0 0 .28-.91z"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="20px_star_BEIGE_svg__a">
                          <path fill="#fff" d="M0 0h20v20H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span className="product-detail__description__info__rating__inner__star">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                    >
                      <g clipPath="url(#20px_star_BEIGE_svg__a)">
                        <path
                          fill="#E0CEAA"
                          d="M18.19 8.09a.75.75 0 0 0-.72-.52h-5.16l-1.6-4.91a.74.74 0 0 0-.71-.531.74.74 0 0 0-.71.531l-1.6 4.91H2.53a.75.75 0 0 0-.72.52.74.74 0 0 0 .28.84l4.17 3-1.59 4.95a.75.75 0 0 0 .27.83.72.72 0 0 0 .88 0l4.18-3 4.18 3a.71.71 0 0 0 .44.15.73.73 0 0 0 .44-.15.75.75 0 0 0 .27-.83L13.74 12l4.17-3a.74.74 0 0 0 .28-.91z"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="20px_star_BEIGE_svg__a">
                          <path fill="#fff" d="M0 0h20v20H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span className="product-detail__description__info__rating__inner__star">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                    >
                      <g clipPath="url(#20px_star_BEIGE_svg__a)">
                        <path
                          fill="#E0CEAA"
                          d="M18.19 8.09a.75.75 0 0 0-.72-.52h-5.16l-1.6-4.91a.74.74 0 0 0-.71-.531.74.74 0 0 0-.71.531l-1.6 4.91H2.53a.75.75 0 0 0-.72.52.74.74 0 0 0 .28.84l4.17 3-1.59 4.95a.75.75 0 0 0 .27.83.72.72 0 0 0 .88 0l4.18-3 4.18 3a.71.71 0 0 0 .44.15.73.73 0 0 0 .44-.15.75.75 0 0 0 .27-.83L13.74 12l4.17-3a.74.74 0 0 0 .28-.91z"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="20px_star_BEIGE_svg__a">
                          <path fill="#fff" d="M0 0h20v20H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span className="product-detail__description__info__rating__inner__star">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                    >
                      <g clipPath="url(#20px_star_BEIGE_svg__a)">
                        <path
                          fill="#E0CEAA"
                          d="M18.19 8.09a.75.75 0 0 0-.72-.52h-5.16l-1.6-4.91a.74.74 0 0 0-.71-.531.74.74 0 0 0-.71.531l-1.6 4.91H2.53a.75.75 0 0 0-.72.52.74.74 0 0 0 .28.84l4.17 3-1.59 4.95a.75.75 0 0 0 .27.83.72.72 0 0 0 .88 0l4.18-3 4.18 3a.71.71 0 0 0 .44.15.73.73 0 0 0 .44-.15.75.75 0 0 0 .27-.83L13.74 12l4.17-3a.74.74 0 0 0 .28-.91z"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="20px_star_BEIGE_svg__a">
                          <path fill="#fff" d="M0 0h20v20H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </div>
                <div className="product-detail__description__info__rating__inner__score">
                  <span className="product-detail__description__info__rating__inner__score__number">
                    4.3
                  </span>
                  <span className="product-detail__description__info__rating__inner__score__fraction-bar">
                    /
                  </span>
                  <span className="product-detail__description__info__rating__inner__score__denomiator">
                    5
                  </span>
                  <a
                    href="#productReviews"
                    className="product-detail__description__info__rating__inner__score__amount"
                  >
                    (188件)
                  </a>
                </div>
              </div>
            </div>
            <div className="product-detail__description__info__choice-group">
              <div className="product-detail__description__info__choice-group__heading">
                <p className="product-detail__description__info__choice-group__heading__text">
                  サイズ
                </p>
              </div>
              <ul className="product-detail__description__info__choice-group__button__wrapper">
                <li className="product-detail__description__info__choice-group__button__item">
                  <button className="product-detail__description__info__choice-group__button" type="button">
                    <span>スモール</span>
                  </button>
                </li>
                <li className="product-detail__description__info__choice-group__button__item">
                  <button className="product-detail__description__info__choice-group__button" type="button">
                    <span>シングル</span>
                  </button>
                </li>
                <li className="product-detail__description__info__choice-group__button__item">
                  <button className="product-detail__description__info__choice-group__button" type="button">
                    <span>セミダブル</span>
                  </button>
                </li>
                <li className="product-detail__description__info__choice-group__button__item">
                  <button className="product-detail__description__info__choice-group__button" type="button">
                    <span>ダブル</span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="product-detail__description__info__price-group">
              <div className="product-detail__description__info__price-group__box">
                <span className="product-detail__description__info__price-group__box__text">
                  本体価格：
                </span>
                <span className="product-detail__description__info__price-group__box__text">
                  消費税込みで
                </span>
                <span className="product-detail__description__info__price-group__box__price-value">
                  {convertToNumberFormat(product?.minPrice)}
                </span>
                <span className="product-detail__description__info__price-group__box__price-unit">
                  円
                </span>
              </div>
              <div className="product-detail__description__info__price-group__box">
                <span className="product-detail__description__info__price-group__box__text">
                  合計価格：消費税込みで
                </span>
                <span className="product-detail__description__info__price-group__box__price-value">
                  {convertToNumberFormat(product?.minPrice)}
                </span>
                <span className="product-detail__description__info__price-group__box__price-unit">
                  円
                </span>
              </div>
            </div>
            <div className="product-detail__description__info__counter-group">
              <button
                className="product-detail__description__info__counter-group__button-decrease"
                type="button"
                onClick={handelDecreaseQuantity}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#C4C4C6"
                >
                  <g clipPath="url(#16px_remove_svg__a)">
                    <path d="M14 8H2"></path>
                  </g>
                  <defs>
                    <clipPath id="16px_remove_svg__a">
                      <path fill="#fff" d="M0 0h16v16H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <InputField
                className="product-detail__description__info__counter-group__input"
                name="quantity"
                register={register}
                errors={errors}
                value={quantity}
              />
              <button
                className="product-detail__description__info__counter-group__button-increase"
                type="button"
                onClick={handleIncreaseQuantity}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  stroke="#3C3C43"
                >
                  <path d="M2 8h12M8 14V2"></path>
                </svg>
              </button>
            </div>
            <div className="product-detail__description__info__cart-button-wrapper">
              <Button className="product-detail__description__info__cart-button">
                <span className="product-detail__description__info__cart-button__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#FFFFFF"
                  >
                    <path
                      stroke="#FFF"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      strokeWidth="1.5"
                      d="M1 4.322h2.547c.075 0 .15.062.162.137l1.336 8.566c0 .075.075.137.162.137H16.82a.16.16 0 0 0 .162-.137l1.586-8.304"
                    ></path>
                    <path
                      fill="#FFF"
                      d="M6.732 18.658a2.035 2.035 0 1 0 0-4.07 2.035 2.035 0 0 0 0 4.07zm8.541 0a2.035 2.035 0 1 0 0-4.07 2.035 2.035 0 0 0 0 4.07z"
                    ></path>
                    <g stroke="#FFF" strokeLinecap="round" strokeWidth="2">
                      <path d="M11 3v6M8 6h6"></path>
                    </g>
                  </svg>
                </span>
                <span>カートに入れる</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductDetail;
