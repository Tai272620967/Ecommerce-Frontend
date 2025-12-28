"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/base/components/DataTable/DataTable";
import "./Order.scss";
import { Column, Row } from "react-table";
import { fetchAllOrdersApi } from "@/base/utils/api/order";
import { useEffect, useState } from "react";
import { Order } from "@/base/types/order";
import { convertToNumberFormat, convertJPYToUSD } from "@/base/utils";

export const OrderDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchAllOrdersApi(1, 20);
      console.log("Orders API Response:", response);
      
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
      
      console.log("Final orders data:", ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  // Format status badge
  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: "#f0ad4e",
      processing: "#5bc0de",
      shipped: "#5cb85c",
      delivered: "#5cb85c",
      cancelled: "#d9534f",
    };
    
    const color = statusColors[status] || "#777";
    
    return (
      <span
        style={{
          backgroundColor: color,
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
        }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  // Format payment status badge
  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusColors: { [key: string]: string } = {
      pending: "#f0ad4e",
      paid: "#5cb85c",
      failed: "#d9534f",
    };
    
    const color = statusColors[paymentStatus] || "#777";
    
    return (
      <span
        style={{
          backgroundColor: color,
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
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
        <span>${convertToNumberFormat(convertJPYToUSD(value))}</span>
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
        <div>Loading orders...</div>
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

