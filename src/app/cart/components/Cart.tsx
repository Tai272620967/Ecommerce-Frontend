"use client";
import Link from "next/link";
import "./Cart.scss";
import Image from "next/image";
import InputField from "@/base/components/Input/Input";
import { useForm } from "react-hook-form";
import { Button } from "@/base/components/Button/Button";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  cartTotalQuantityApi,
  deleteCartItemByIdApi,
  fetchAllCartItemsByCartIdApi,
  updateCartItemQuantityApi,
} from "@/base/utils/api/cart";
import { CartItem } from "@/base/types/cart";
import { convertToNumberFormat } from "@/base/utils";
import { getImageUrl } from "@/base/utils/imageUrl";
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

  const fetchCartTotalQuantity = useCallback(async () => {
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
  }, [dispatch]);
  /* eslint-disable @typescript-eslint/no-explicit-any */

  const handleUpdateCartItemQuantity = useCallback(async (data: any) => {
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
      // Error updating cart item quantity
    }
  }, [fetchCartTotalQuantity]);

  const handleDeleteCartItem = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteCartItemByIdApi(id);

      setTimeout(() => {
        message.success({
          content: response.data.message,
          className: "custom-message",
        });
        setIsDeleting(false);
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== Number(id))
        );
        fetchCartTotalQuantity();
        // dispatch(setTotalQuantity({ totalQuantity: totalItem }));
      }, 1000);
    } catch (error) {
      // Error deleting cart item
    }
  }, [fetchCartTotalQuantity]);

  useEffect(() => {
    const fetchAllCartItems = async () => {
      try {
        const response = await fetchAllCartItemsByCartIdApi();
        if (response) {
          setCartItems(response.data);
        }
      } catch (error) {
        // Error fetching cart items
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
        <h1 className="cart__title">Shopping Cart</h1>
      </div>
      {cartItems.length > 0 ? (
        <div className="cart__items-wrapper">
          <div className="cart__item">
            <div className="cart__item-status">
              <span className="cart__item-status-message">
                Product inventory has not been reserved yet.
              </span>
              <span className="cart__item-status-message">
                Proceeding to the next screen will reserve inventory for 30 minutes.
              </span>
            </div>
            <h1 className="cart__item-header">
              <span className="cart__item-header-label">Number of Items</span>
              <span className="cart__item-header-count">{totalItem}</span>
            </h1>
            <div className="cart__item-details">
              {cartItems?.map((cartItem) => (
                <div className="cart__item-row" key={cartItem.id}>
                  <div className="cart__item-thumbnail">
                    <Image
                      src={getImageUrl(cartItem.product.imageUrl)}
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
                      <p className="cart__item-price">
                        <span className="cart__item-price-value">
                          {convertToNumberFormat(cartItem.product.minPrice)}
                        </span>
                        <span className="cart__item-price-unit">$ / item</span>
                      </p>
                      <p className="cart__item-code">
                        <span className="cart__item-code-value">
                          Product Code: {cartItem.product.id}
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
                              Subtotal (Tax Included)
                            </span>
                            <span className="cart__item-info-price-value">
                              {convertToNumberFormat(
                                cartItem.quantity * cartItem.price
                              )}
                            </span>
                            <span className="cart__item-info-price-unit">
                              $
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
                            Delete
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
              <h2 className="cart__price-summary__total-label">Payment Amount</h2>
              <ul className="cart__price-summary__total__content">
                <li className="cart__price-summary__total-content__item">
                  <div className="cart__price-summary__total-content__item-text">
                    <span>Subtotal {totalItem} items</span>
                  </div>
                  <div className="cart__price-summary__total-content__item-price">
                    <span className="cart__price-summary__total-content__item-price-value">
                      {convertToNumberFormat(totalAmount)}
                    </span>
                    <span className="cart__price-summary__total-content__item-price-unit">
                      $
                    </span>
                  </div>
                </li>
              </ul>
              <div className="cart__price-summary__total__tip-message">
                <span>*</span>
                <span>
                  Shipping fees and additional service charges are not displayed when not logged in.
                </span>
              </div>
            </div>
            <div className="cart__price-summary__button-wrapper">
              <Link href="/order/checkout">
                <Button className="cart__price-summary__button">Proceed to Checkout</Button>
              </Link>
            </div>
            <div className="cart__price-summary-text-wrapper">
              <p className="cart__price-summary-tip-text">
                Proceeding will reserve inventory for 30 minutes.
              </p>
              <Link
                href={"/"}
                className="cart__price-summary-continue-shop-link"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="cart__item__empty-cart">
          Your shopping cart is empty.
        </div>
      )}
    </div>
  );
};

export default Cart;
