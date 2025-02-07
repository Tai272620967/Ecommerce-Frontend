"use client";
import Link from "next/link";
import "./Cart.scss";
import Image from "next/image";
import InputField from "@/base/components/Input/Input";
import { useForm } from "react-hook-form";
import { Button } from "@/base/components/Button/Button";
import { useEffect, useMemo, useState } from "react";
import {
  cartTotalQuantityApi,
  deleteCartItemByIdApi,
  fetchAllCartItemsByCartIdApi,
  updateCartItemQuantityApi,
} from "@/base/utils/api/cart";
import { CartItem } from "@/base/types/cart";
import { convertToNumberFormat } from "@/base/utils";
import { useDispatch } from "react-redux";
import { setTotalQuantity } from "@/base/redux/features/cartSlice";
import { message } from "antd";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const defaultValues = {
    userId: null,
    // productId: Number(productId),
    // quantity: quantity,
  };

  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const totalItem = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const {
    register,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const dispatch = useDispatch();

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
      console.error(error);
    }
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */

  const handleUpdateCartItemQuantity = async (data: any) => {
    try {
      const response = await updateCartItemQuantityApi(data);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === response.data.id
            ? { ...item, quantity: response.data.quantity }
            : item
        )
      );

      fetchCartTotalQuantity();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCartItem = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteCartItemByIdApi(id);

      setTimeout(() => {
        message.success({
          content: response.data.message,
          className: 'custom-message',
        });        
        setIsDeleting(false);
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== Number(id))
        );
        fetchCartTotalQuantity();
        // dispatch(setTotalQuantity({ totalQuantity: totalItem }));
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAllCartItems = async () => {
      try {
        const response = await fetchAllCartItemsByCartIdApi();
        if (response) {
          console.log("response", response);
          setCartItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchAllCartItems();
  }, []);

  return (
    <div className="cart">
      {/* Overlay và spinner */}
      {isDeleting && (
        <div className="cart__overlay">
          <div className="cart__spinner" />
        </div>
      )}
      <div className="cart__header">
        <h1 className="cart__title">ショッピングカート</h1>
      </div>
      {cartItems.length > 0 ? (
        <div className="cart__items-wrapper">
          <div className="cart__item">
            <div className="cart__item-status">
              <span className="cart__item-status-message">
                商品の在庫はまだ確保されていません。
              </span>
              <span className="cart__item-status-message">
                次の画面に進むと30分在庫が確保されます。
              </span>
            </div>
            <h1 className="cart__item-header">
              <span className="cart__item-header-label">アイテム数</span>
              <span className="cart__item-header-count">2</span>
            </h1>
            <div className="cart__item-details">
              {cartItems?.map((cartItem) => (
                <div className="cart__item-row" key={cartItem.id}>
                  <div className="cart__item-thumbnail">
                    <Image
                      src={process.env.NEXT_PUBLIC_API_BASE_URI + cartItem.product.imageUrl}
                      alt="Sofa thumbnail"
                      width={150}
                      height={150}
                    />
                  </div>
                  <div className="cart__item-info">
                    <div className="cart__item-info-text">
                      <Link href={"/"} className="cart__item-name">
                        {cartItem.product.name}
                      </Link>
                      <p className="cart__item-standard">４本組・ナチュラル</p>
                      <p className="cart__item-price">
                        <span className="cart__item-price-value">
                          {convertToNumberFormat(cartItem.product.minPrice)}
                        </span>
                        <span className="cart__item-price-unit">円 / 点</span>
                      </p>
                      <p className="cart__item-code">
                        <span className="cart__item-code-value">
                          商品番号: 02528355
                        </span>
                      </p>
                    </div>
                    <div className="cart__item-info-button-wrapper">
                      <div className="cart__item-info-button">
                        <button
                          className="cart__item-info-button-decrease"
                          type="button"
                          onClick={() =>
                            handleUpdateCartItemQuantity({
                              cartId: cartItem.cart.id,
                              productId: cartItem.product.id,
                              quantity: cartItem.quantity - 1,
                            })
                          }
                        >
                          <svg role="img" width="10" height="10">
                            <svg id="icon_remove" viewBox="0 0 10 10">
                              <g>
                                <path
                                  d="M8,.75H0A.75.75,0,0,1-.75,0,.75.75,0,0,1,0-.75H8A.75.75,0,0,1,8.75,0,.75.75,0,0,1,8,.75Z"
                                  transform="translate(1 5)"
                                  fill="currentColor"
                                ></path>
                              </g>
                            </svg>
                          </svg>
                        </button>
                        <InputField
                          className="cart__item-info-input"
                          name={`quantity-${cartItem.id}`}
                          register={register}
                          errors={errors}
                          value={cartItem.quantity}
                        />
                        <button
                          className="cart__item-info-button-increase"
                          type="button"
                          onClick={() =>
                            handleUpdateCartItemQuantity({
                              cartId: cartItem.cart.id,
                              productId: cartItem.product.id,
                              quantity: cartItem.quantity + 1,
                            })
                          }
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
                      <div className="cart__item-info-detail">
                        <div className="cart__item-info-price-wrapper">
                          <p className="cart__item-info-price">
                            <span className="cart__item-info-price-label">
                              小計（消費税込）
                            </span>
                            <span className="cart__item-info-price-value">
                              {convertToNumberFormat(
                                cartItem.quantity * cartItem.price
                              )}
                            </span>
                            <span className="cart__item-info-price-unit">
                              円
                            </span>
                          </p>
                        </div>
                        <div className="cart__item-info-delete-button-wrapper">
                          <Button
                            className="cart__item-info-delete-button"
                            onClick={() =>
                              handleDeleteCartItem(cartItem.id.toString())
                            }
                          >
                            削除
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="cart__price-summary">
            <div className="cart__price-summary__total">
              <h2 className="cart__price-summary__total-label">お支払い金額</h2>
              <ul className="cart__price-summary__total__content">
                <li className="cart__price-summary__total-content__item">
                  <div className="cart__price-summary__total-content__item-text">
                    <span>商品小計 {totalItem}点</span>
                  </div>
                  <div className="cart__price-summary__total-content__item-price">
                    <span className="cart__price-summary__total-content__item-price-value">
                      {convertToNumberFormat(totalAmount)}
                    </span>
                    <span className="cart__price-summary__total-content__item-price-unit">
                      円
                    </span>
                  </div>
                </li>
              </ul>
              <div className="cart__price-summary__total__tip-message">
                <span>※</span>
                <span>
                  未ログイン状態では配送料、付帯サービス料が表示されません。
                </span>
              </div>
            </div>
            <div className="cart__price-summary__button-wrapper">
              <Button className="cart__price-summary__button">次に進む</Button>
            </div>
            <div className="cart__price-summary-text-wrapper">
              <p className="cart__price-summary-tip-text">
                次に進むと、30分間在庫が確保されます。
              </p>
              <Link
                href={"/"}
                className="cart__price-summary-continue-shop-link"
              >
                ショッピングを続ける
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="cart__item__empty-cart">ショッピングカートの中に商品がございません。</div>
      )}
    </div>
  );
};

export default Cart;
