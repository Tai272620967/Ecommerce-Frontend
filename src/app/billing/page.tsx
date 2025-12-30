"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrdersApi } from "@/base/utils/api/order";
import { Order } from "@/base/types/order";
import { message } from "antd";
import authStorage from "@/base/storage/auth";
import { convertToNumberFormat } from "@/base/utils";
import "./page.scss";
import { OrderCardSkeleton } from "../components/Skeleton/PageSkeleton";

export default function BillingPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authStorage.authenticated()) {
      router.push("/auth/login");
      return;
    }
    
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrdersApi();
      
      // API returns Order[] directly (List<ResOrderDTO>)
      if (Array.isArray(response)) {
        setOrders(response);
      } else {
        setOrders([]);
      }
    } catch (error) {
      message.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const statusStyles: { [key: string]: { bg: string; text: string; border: string } } = {
      pending: { bg: "#ffffff", text: "#6d6d72", border: "#e8e8e8" },
      paid: { bg: "#ffffff", text: "#3c3c43", border: "#3c3c43" },
      failed: { bg: "#ffffff", text: "#d26d69", border: "#d26d69" },
    };
    
    const style = statusStyles[status] || { bg: "#ffffff", text: "#6d6d72", border: "#e8e8e8" };
    
    return (
      <span
        className="billing-page__status-badge"
        style={{
          backgroundColor: style.bg,
          color: style.text,
          border: `1px solid ${style.border}`,
        }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  // Format order status badge
  const getOrderStatusBadge = (status: string) => {
    const statusStyles: { [key: string]: { bg: string; text: string; border: string } } = {
      pending: { bg: "#ffffff", text: "#6d6d72", border: "#e8e8e8" },
      processing: { bg: "#ffffff", text: "#3c3c43", border: "#3c3c43" },
      shipped: { bg: "#ffffff", text: "#3c3c43", border: "#3c3c43" },
      delivered: { bg: "#ffffff", text: "#3c3c43", border: "#3c3c43" },
      cancelled: { bg: "#ffffff", text: "#d26d69", border: "#d26d69" },
    };
    
    const style = statusStyles[status] || { bg: "#ffffff", text: "#6d6d72", border: "#e8e8e8" };
    
    return (
      <span
        className="billing-page__status-badge"
        style={{
          backgroundColor: style.bg,
          color: style.text,
          border: `1px solid ${style.border}`,
        }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="billing-page__wrapper">
        <div className="billing-page__title">
          <h1>Billing & Orders</h1>
        </div>
        <div className="billing-page__content">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page__wrapper">
      <div className="billing-page__title">
        <h1>Billing & Orders</h1>
      </div>
      <div className="billing-page__content">
        {orders.length === 0 ? (
          <div className="billing-page__empty">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="billing-page__orders">
            {orders.map((order) => (
              <div key={order.id} className="billing-page__order-card">
                <div className="billing-page__order-header">
                  <div className="billing-page__order-info">
                    <h3 className="billing-page__order-id">Order #{order.id}</h3>
                    <span className="billing-page__order-date">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="billing-page__order-statuses">
                    {getPaymentStatusBadge(order.paymentStatus)}
                    {getOrderStatusBadge(order.status)}
                  </div>
                </div>

                <div className="billing-page__order-details">
                  <div className="billing-page__order-section">
                    <h4 className="billing-page__section-title">Shipping Address</h4>
                    <p className="billing-page__section-content">
                      {order.shippingLastName} {order.shippingFirstName}
                    </p>
                    <p className="billing-page__section-content">
                      {order.shippingPostalCode} {order.shippingPrefecture} {order.shippingCity}
                    </p>
                    <p className="billing-page__section-content">
                      {order.shippingArea} {order.shippingStreet}
                      {order.shippingBuilding && ` ${order.shippingBuilding}`}
                    </p>
                    <p className="billing-page__section-content">
                      Phone: {order.shippingPhone}
                    </p>
                  </div>

                  <div className="billing-page__order-section">
                    <h4 className="billing-page__section-title">Payment Method</h4>
                    <p className="billing-page__section-content">
                      {order.paymentMethod?.replace("_", " ").toUpperCase() || "-"}
                    </p>
                  </div>

                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="billing-page__order-section">
                      <h4 className="billing-page__section-title">Items</h4>
                      <div className="billing-page__order-items">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="billing-page__order-item">
                            <span className="billing-page__item-name">
                              {item.product?.name || "Product"}
                            </span>
                            <span className="billing-page__item-quantity">
                              x{item.quantity}
                            </span>
                            <span className="billing-page__item-price">
                              ${convertToNumberFormat(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="billing-page__order-totals">
                    <div className="billing-page__total-row">
                      <span>Subtotal:</span>
                      <span>${convertToNumberFormat(order.subtotal)}</span>
                    </div>
                    <div className="billing-page__total-row">
                      <span>Shipping:</span>
                      <span>${convertToNumberFormat(order.shippingFee)}</span>
                    </div>
                    <div className="billing-page__total-row">
                      <span>Tax:</span>
                      <span>${convertToNumberFormat(order.tax)}</span>
                    </div>
                    <div className="billing-page__total-row billing-page__total-row--total">
                      <span>Total:</span>
                      <span>${convertToNumberFormat(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

