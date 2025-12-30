"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/base/components/DataTable/DataTable";
import "./Order.scss";
import { Column, Row } from "react-table";
import { fetchAllOrdersApi } from "@/base/utils/api/order";
import { useEffect, useState } from "react";
import { Order } from "@/base/types/order";
import { convertToNumberFormat } from "@/base/utils";

export const OrderDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchAllOrdersApi(1, 20);
      
      // Handle response structure
      let ordersData: Order[] = [];
      
      if (response) {
        // Check if result is directly in response (expected structure)
        if (Array.isArray(response.result)) {
          ordersData = response.result;
        } 
        // Check if result is nested in data (fallback)
        else if ((response as any).data && Array.isArray((response as any).data.result)) {
          ordersData = (response as any).data.result;
        }
        // Check if response itself is an array (fallback)
        else if (Array.isArray(response)) {
          ordersData = response;
        }
      }
      
      setOrders(ordersData);
    } catch (error) {
      // Error fetching orders
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
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

  // Format status badge (Muji style)
  const getStatusBadge = (status: string) => {
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
        style={{
          backgroundColor: style.bg,
          color: style.text,
          border: `1px solid ${style.border}`,
          padding: "6px 12px",
          borderRadius: "0",
          fontSize: "12px",
          fontWeight: 300,
          letterSpacing: "0.3px",
        }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  // Format payment status badge (Muji style)
  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusStyles: { [key: string]: { bg: string; text: string; border: string } } = {
      pending: { bg: "#ffffff", text: "#6d6d72", border: "#e8e8e8" },
      paid: { bg: "#ffffff", text: "#3c3c43", border: "#3c3c43" },
      failed: { bg: "#ffffff", text: "#d26d69", border: "#d26d69" },
    };
    
    const style = statusStyles[paymentStatus] || { bg: "#ffffff", text: "#6d6d72", border: "#e8e8e8" };
    
    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.text,
          border: `1px solid ${style.border}`,
          padding: "6px 12px",
          borderRadius: "0",
          fontSize: "12px",
          fontWeight: 300,
          letterSpacing: "0.3px",
        }}
      >
        {paymentStatus.toUpperCase()}
      </span>
    );
  };

  // Configure columns
  const columns: Column<Order>[] = [
    {
      Header: "ID",
      accessor: "id",
      width: 80,
    },
    {
      Header: "Customer Name",
      accessor: "shippingFirstName",
      Cell: ({ row }: { row: Row<Order> }) => (
        <span>
          {row.original.shippingLastName} {row.original.shippingFirstName}
        </span>
      ),
    },
    {
      Header: "Phone",
      accessor: "shippingPhone",
    },
    {
      Header: "Address",
      Cell: ({ row }: { row: Row<Order> }) => (
        <span>
          {row.original.shippingPostalCode}, {row.original.shippingPrefecture}{" "}
          {row.original.shippingCity} {row.original.shippingArea}{" "}
          {row.original.shippingStreet}
        </span>
      ),
    },
    {
      Header: "Payment Method",
      accessor: "paymentMethod",
      Cell: ({ value }: { value: string }) => (
        <span style={{ textTransform: "capitalize" }}>
          {value?.replace("_", " ") || "-"}
        </span>
      ),
    },
    {
      Header: "Payment Status",
      accessor: "paymentStatus",
      Cell: ({ value }: { value: string }) => getPaymentStatusBadge(value || "pending"),
    },
    {
      Header: "Order Status",
      accessor: "status",
      Cell: ({ value }: { value: string }) => getStatusBadge(value || "pending"),
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: ({ value }: { value: number }) => (
        <span>${convertToNumberFormat(value)}</span>
      ),
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ value }: { value: string }) => formatDate(value),
    },
  ];

  if (loading) {
    return (
      <div className="order-dashboard__wrapper">
        <div className="order-dashboard__title">
          <h1>Orders</h1>
        </div>
        <div className="order-dashboard__table">
          <div className="skeleton-table">
            <div className="skeleton-table__header">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-loader skeleton-loader--text" style={{ width: "100%", height: "20px" }} />
              ))}
            </div>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <div key={rowIndex} className="skeleton-table__row">
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <div key={colIndex} className="skeleton-loader skeleton-loader--text" style={{ width: "100%", height: "16px" }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-dashboard__wrapper">
      <div className="order-dashboard__title">
        <h1>Orders</h1>
      </div>
      <div className="order-dashboard__table">
        {orders.length > 0 ? (
          <DataTable columns={columns} data={orders} className="orders-table" />
        ) : (
          <div>No orders found. Orders count: {orders.length}</div>
        )}
      </div>
    </div>
  );
};

