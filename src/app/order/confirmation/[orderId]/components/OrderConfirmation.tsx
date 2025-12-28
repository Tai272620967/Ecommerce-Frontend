"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getOrderByIdApi } from "@/base/utils/api/order";
import { Order } from "@/base/types/order";
import { convertToNumberFormat } from "@/base/utils";
import { message } from "antd";
import "./OrderConfirmation.scss";

interface OrderConfirmationProps {
  orderId: string;
}

export default function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderIdNum = parseInt(orderId);
        if (isNaN(orderIdNum)) {
          message.error("Invalid order ID");
          router.push("/");
          return;
        }

        const response = await getOrderByIdApi(orderIdNum);
        if (response && response.data) {
          setOrder(response.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        message.error("Failed to fetch order information");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="order-confirmation">
        <div className="order-confirmation__loading">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation">
        <div className="order-confirmation__error">Order not found</div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="order-confirmation__header">
        <h1 className="order-confirmation__title">Thank You for Your Order</h1>
        <p className="order-confirmation__subtitle">
          Order Number: {order.id}
        </p>
      </div>

      <div className="order-confirmation__content">
        <div className="order-confirmation__section">
          <h2 className="order-confirmation__section-title">Order Details</h2>
          <div className="order-confirmation__items">
            {order.orderItems.map((item) => (
              <div key={item.id} className="order-confirmation__item">
                <div className="order-confirmation__item-info">
                  <span className="order-confirmation__item-name">
                    {item.product.name}
                  </span>
                  <span className="order-confirmation__item-quantity">
                    Quantity: {item.quantity}
                  </span>
                </div>
                <span className="order-confirmation__item-price">
                  ¥{convertToNumberFormat(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-confirmation__section">
          <h2 className="order-confirmation__section-title">Shipping Address</h2>
          <div className="order-confirmation__address">
            <p>
              {order.shippingPostalCode}
            </p>
            <p>
              {order.shippingPrefecture}
              {order.shippingCity}
              {order.shippingArea}
              {order.shippingStreet}
              {order.shippingBuilding && ` ${order.shippingBuilding}`}
            </p>
            <p>
              {order.shippingLastName} {order.shippingFirstName}
            </p>
            <p>{order.shippingPhone}</p>
          </div>
        </div>

        <div className="order-confirmation__section">
          <h2 className="order-confirmation__section-title">Payment Information</h2>
          <div className="order-confirmation__payment">
            <p>
              <span>Payment Method: </span>
              <span>
                {order.paymentMethod === "credit_card"
                  ? "Credit Card"
                  : order.paymentMethod === "bank_transfer"
                  ? "Bank Transfer"
                  : "Cash on Delivery"}
              </span>
            </p>
            <p>
              <span>Payment Status: </span>
              <span>
                {order.paymentStatus === "paid"
                  ? "Paid"
                  : order.paymentStatus === "pending"
                  ? "Pending"
                  : "Failed"}
              </span>
            </p>
          </div>
        </div>

        <div className="order-confirmation__section">
          <h2 className="order-confirmation__section-title">Total Amount</h2>
          <div className="order-confirmation__totals">
            <div className="order-confirmation__total-row">
              <span>Subtotal</span>
              <span>¥{convertToNumberFormat(order.subtotal)}</span>
            </div>
            <div className="order-confirmation__total-row">
              <span>Shipping Fee</span>
              <span>¥{convertToNumberFormat(order.shippingFee)}</span>
            </div>
            <div className="order-confirmation__total-row">
              <span>Tax</span>
              <span>¥{convertToNumberFormat(order.tax)}</span>
            </div>
            <div className="order-confirmation__total-row order-confirmation__total-row--total">
              <span>Total Amount</span>
              <span>¥{convertToNumberFormat(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-confirmation__actions">
        <Link href="/" className="order-confirmation__button">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

