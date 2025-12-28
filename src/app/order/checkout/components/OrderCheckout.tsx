"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/base/components/Input/Input";
import { Button } from "@/base/components/Button/Button";
import { message } from "antd";
import { createOrderApi } from "@/base/utils/api/order";
import { getAddressByPostalCode } from "@/base/utils/api/getAddressByPostalCode";
import { fetchAllCartItemsByCartIdApi } from "@/base/utils/api/cart";
import { CartItem } from "@/base/types/cart";
import { OrderDTO } from "@/base/types/order";
import { convertToNumberFormat } from "@/base/utils";
import { useAppDispatch } from "@/base/redux/hook";
import { setTotalQuantity } from "@/base/redux/features/cartSlice";
import "./OrderCheckout.scss";

export default function OrderCheckout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);

  // Calculate totals
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const shippingFee = 500; // Default shipping fee
  const tax = useMemo(() => {
    return subtotal * 0.1; // 10% tax
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + shippingFee + tax;
  }, [subtotal, shippingFee, tax]);

  const yupSchema = yup.object().shape({
    shippingFirstName: yup.string().required("First name is required"),
    shippingLastName: yup.string().required("Last name is required"),
    shippingKataFirstName: yup.string(),
    shippingKataLastName: yup.string(),
    shippingPhone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9-]+$/, "Phone number format is incorrect"),
    shippingPostalCode: yup.string(),
    shippingPrefecture: yup.string().required("Prefecture is required"),
    shippingCity: yup.string().required("City is required"),
    shippingArea: yup.string().required("Area is required"),
    shippingStreet: yup.string().required("Street address is required"),
    shippingBuilding: yup.string(),
    paymentMethod: yup.string().required("Please select a payment method"),
    // Credit card fields - required only when paymentMethod is credit_card
    cardNumber: yup.string().when("paymentMethod", {
      is: "credit_card",
      then: (schema) => schema
        .required("Card number is required")
        .matches(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Card number must be 16 digits"),
      otherwise: (schema) => schema,
    }),
    cardHolderName: yup.string().when("paymentMethod", {
      is: "credit_card",
      then: (schema) => schema.required("Card holder name is required"),
      otherwise: (schema) => schema,
    }),
    cardExpiryMonth: yup.string().when("paymentMethod", {
      is: "credit_card",
      then: (schema) => schema
        .required("Expiry month is required")
        .matches(/^(0[1-9]|1[0-2])$/, "Invalid month"),
      otherwise: (schema) => schema,
    }),
    cardExpiryYear: yup.string().when("paymentMethod", {
      is: "credit_card",
      then: (schema) => schema
        .required("Expiry year is required")
        .matches(/^\d{4}$/, "Year must be 4 digits"),
      otherwise: (schema) => schema,
    }),
    cardCvv: yup.string().when("paymentMethod", {
      is: "credit_card",
      then: (schema) => schema
        .required("CVV is required")
        .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
      otherwise: (schema) => schema,
    }),
  });

  const defaultValues = {
    shippingFirstName: "",
    shippingLastName: "",
    shippingKataFirstName: "",
    shippingKataLastName: "",
    shippingPhone: "",
    shippingPostalCode: "",
    shippingPrefecture: "",
    shippingCity: "",
    shippingArea: "",
    shippingStreet: "",
    shippingBuilding: "",
    paymentMethod: "",
    cardNumber: "",
    cardHolderName: "",
    cardExpiryMonth: "",
    cardExpiryYear: "",
    cardCvv: "",
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const postalCode = watch("shippingPostalCode");
  const paymentMethod = watch("paymentMethod");

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetchAllCartItemsByCartIdApi();
        if (response && response.data && response.data.length > 0) {
          setCartItems(response.data);
          // Get cart ID from first cart item
          if (response.data[0]?.cart?.id) {
            setCartId(response.data[0].cart.id);
          }
        } else {
          message.warning("Cart is empty");
          router.push("/cart");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        message.error("Failed to fetch cart information");
        router.push("/cart");
      }
    };

    fetchCartItems();
  }, [router]);

  // Auto-fill address from postal code
  useEffect(() => {
    if (postalCode && postalCode.length >= 7) {
      const normalizedPostalCode = postalCode.replace(/-/g, "");
      if (normalizedPostalCode.length === 7) {
        setIsLoadingAddress(true);
        getAddressByPostalCode(normalizedPostalCode)
          .then((address) => {
            if (address) {
              setValue("shippingPrefecture", address.prefecture);
              setValue("shippingCity", address.city);
              setValue("shippingArea", address.area);
              setValue("shippingStreet", address.street || "");
            }
          })
          .catch((error) => {
            console.error("Error fetching address:", error);
          })
          .finally(() => {
            setIsLoadingAddress(false);
          });
      }
    }
  }, [postalCode, setValue]);

  const handleCreateOrder = async (data: Record<string, any>) => {
    if (!cartId) {
      message.error("Cart information not found");
      return;
    }

    setIsLoading(true);

    try {
      const orderDTO: OrderDTO = {
        shippingFirstName: data.shippingFirstName,
        shippingLastName: data.shippingLastName,
        shippingKataFirstName: data.shippingKataFirstName || undefined,
        shippingKataLastName: data.shippingKataLastName || undefined,
        shippingPhone: data.shippingPhone,
        shippingPostalCode: data.shippingPostalCode,
        shippingPrefecture: data.shippingPrefecture,
        shippingCity: data.shippingCity,
        shippingArea: data.shippingArea,
        shippingStreet: data.shippingStreet,
        shippingBuilding: data.shippingBuilding || undefined,
        paymentMethod: data.paymentMethod,
        // Credit card information (only if payment method is credit_card)
        cardNumber: data.paymentMethod === "credit_card" ? data.cardNumber : undefined,
        cardHolderName: data.paymentMethod === "credit_card" ? data.cardHolderName : undefined,
        cardExpiryMonth: data.paymentMethod === "credit_card" ? data.cardExpiryMonth : undefined,
        cardExpiryYear: data.paymentMethod === "credit_card" ? data.cardExpiryYear : undefined,
        cardCvv: data.paymentMethod === "credit_card" ? data.cardCvv : undefined,
        cartId: cartId,
        shippingFee: shippingFee,
        tax: tax,
      };

      const response = await createOrderApi(orderDTO);
      if (response && response.data) {
        message.success("Order completed successfully");
        
        // Update cart quantity to 0 in Redux store
        dispatch(setTotalQuantity({ totalQuantity: 0 }));
        
        // Wait 5 seconds before redirecting to confirmation page
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        router.push(`/order/confirmation/${response.data.id}`);
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error("Failed to create order");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="order-checkout">
      <div className="order-checkout__header">
        <h1 className="order-checkout__title">Checkout</h1>
      </div>

      <div className="order-checkout__content">
        <form
          onSubmit={handleSubmit(handleCreateOrder)}
          className="order-checkout__form"
        >
          <div className="order-checkout__form-left">
            {/* Shipping Information Section */}
            <div className="order-checkout__section">
              <h2 className="order-checkout__section-title">Shipping Information</h2>

            <div className="order-checkout__form-row">
              <div className="order-checkout__form-group">
                <InputField
                  className="order-checkout__input"
                  name="shippingLastName"
                  register={register}
                  errors={errors}
                  label="Last Name"
                  placeHolder="Smith"
                />
              </div>
              <div className="order-checkout__form-group">
                <InputField
                  className="order-checkout__input"
                  name="shippingFirstName"
                  register={register}
                  errors={errors}
                  label="First Name"
                  placeHolder="John"
                />
              </div>
            </div>

            <div className="order-checkout__form-row">
              <div className="order-checkout__form-group">
                <InputField
                  className="order-checkout__input"
                  name="shippingKataLastName"
                  register={register}
                  errors={errors}
                  label="Last Name (Kana)"
                  placeHolder="スミス"
                />
              </div>
              <div className="order-checkout__form-group">
                <InputField
                  className="order-checkout__input"
                  name="shippingKataFirstName"
                  register={register}
                  errors={errors}
                  label="First Name (Kana)"
                  placeHolder="ジョン"
                />
              </div>
            </div>

            <div className="order-checkout__form-group">
              <InputField
                className="order-checkout__input"
                name="shippingPhone"
                register={register}
                errors={errors}
                label="Phone Number"
                placeHolder="090-1234-5678"
              />
            </div>

            <div className="order-checkout__form-group">
              <InputField
                className="order-checkout__input"
                name="shippingPostalCode"
                register={register}
                errors={errors}
                label="Postal Code"
                placeHolder="123-4567"
              />
              {isLoadingAddress && (
                <p className="order-checkout__loading-text">
                  Searching for address...
                </p>
              )}
            </div>

            <div className="order-checkout__form-group">
              <InputField
                className="order-checkout__input"
                name="shippingPrefecture"
                register={register}
                errors={errors}
                label="Prefecture"
                placeHolder="Tokyo"
              />
            </div>

            <div className="order-checkout__form-group">
              <InputField
                className="order-checkout__input"
                name="shippingCity"
                register={register}
                errors={errors}
                label="City"
                placeHolder="Shibuya"
              />
            </div>

            <div className="order-checkout__form-group">
              <InputField
                className="order-checkout__input"
                name="shippingArea"
                register={register}
                errors={errors}
                label="Area"
                placeHolder="Jinnan"
              />
            </div>

            <div className="order-checkout__form-group">
              <InputField
                className="order-checkout__input"
                name="shippingStreet"
                register={register}
                errors={errors}
                label="Street Address"
                placeHolder="1-2-3"
              />
            </div>

            <div className="order-checkout__form-group">
              <InputField
                className="order-checkout__input"
                name="shippingBuilding"
                register={register}
                errors={errors}
                label="Building Name / Room Number (Optional)"
                placeHolder="○○ Building 101"
              />
            </div>
            </div>

            {/* Payment Method Section */}
            <div className="order-checkout__section">
            <h2 className="order-checkout__section-title">Payment Method</h2>

            <div className="order-checkout__payment-options">
              <label className="order-checkout__payment-option">
                <input
                  type="radio"
                  value="credit_card"
                  {...register("paymentMethod")}
                  className="order-checkout__radio"
                />
                <span className="order-checkout__payment-label">
                  Credit Card
                </span>
              </label>

              <label className="order-checkout__payment-option">
                <input
                  type="radio"
                  value="bank_transfer"
                  {...register("paymentMethod")}
                  className="order-checkout__radio"
                />
                <span className="order-checkout__payment-label">
                  Bank Transfer
                </span>
              </label>

              <label className="order-checkout__payment-option">
                <input
                  type="radio"
                  value="cash_on_delivery"
                  {...register("paymentMethod")}
                  className="order-checkout__radio"
                />
                <span className="order-checkout__payment-label">
                  Cash on Delivery
                </span>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="input-error-message">
                {errors.paymentMethod.message}
              </p>
            )}

            {/* Credit Card Information Section - Only show when credit_card is selected */}
            {paymentMethod === "credit_card" && (
              <div className="order-checkout__credit-card-section">
                <h3 className="order-checkout__credit-card-title">Credit Card Information</h3>
                
                <div className="order-checkout__form-group">
                  <InputField
                    className="order-checkout__input"
                    name="cardNumber"
                    register={register}
                    errors={errors}
                    label="Card Number"
                    placeHolder="1234 5678 9012 3456"
                    type="text"
                  />
                </div>

                <div className="order-checkout__form-group">
                  <InputField
                    className="order-checkout__input"
                    name="cardHolderName"
                    register={register}
                    errors={errors}
                    label="Card Holder Name"
                    placeHolder="JOHN SMITH"
                    type="text"
                  />
                </div>

                <div className="order-checkout__form-row">
                  <div className="order-checkout__form-group">
                    <InputField
                      className="order-checkout__input"
                      name="cardExpiryMonth"
                      register={register}
                      errors={errors}
                      label="Expiry Month"
                      placeHolder="12"
                      type="text"
                    />
                  </div>
                  <div className="order-checkout__form-group">
                    <InputField
                      className="order-checkout__input"
                      name="cardExpiryYear"
                      register={register}
                      errors={errors}
                      label="Expiry Year"
                      placeHolder="2025"
                      type="text"
                    />
                  </div>
                  <div className="order-checkout__form-group">
                    <InputField
                      className="order-checkout__input"
                      name="cardCvv"
                      register={register}
                      errors={errors}
                      label="CVV"
                      placeHolder="123"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="order-checkout__summary">
            <h2 className="order-checkout__section-title">Order Summary</h2>

            <div className="order-checkout__summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-checkout__summary-item">
                  <div className="order-checkout__summary-item-info">
                    <span className="order-checkout__summary-item-name">
                      {item.product.name}
                    </span>
                    <span className="order-checkout__summary-item-quantity">
                      Quantity: {item.quantity}
                    </span>
                  </div>
                  <span className="order-checkout__summary-item-price">
                    ¥{convertToNumberFormat(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-checkout__summary-totals">
              <div className="order-checkout__summary-total-row">
                <span>Subtotal</span>
                <span>¥{convertToNumberFormat(subtotal)}</span>
              </div>
              <div className="order-checkout__summary-total-row">
                <span>Shipping Fee</span>
                <span>¥{convertToNumberFormat(shippingFee)}</span>
              </div>
              <div className="order-checkout__summary-total-row">
                <span>Tax</span>
                <span>¥{convertToNumberFormat(tax)}</span>
              </div>
              <div className="order-checkout__summary-total-row order-checkout__summary-total-row--total">
                <span>Total Amount</span>
                <span>¥{convertToNumberFormat(total)}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="order-checkout__button-wrapper">
            <Button
              className="order-checkout__button"
              isLoading={isLoading}
              type="submit"
            >
              {!isLoading && "Confirm Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

