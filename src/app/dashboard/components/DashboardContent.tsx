"use client";

import { useEffect, useState } from "react";
import { fetchAllUsersApi } from "@/base/utils/api/user";
import { fetchAllOrdersApi } from "@/base/utils/api/order";
import { fetchAllProductApi } from "@/base/utils/api/product";
import { useRouter } from "next/navigation";
import { convertToNumberFormat } from "@/base/utils";
import "./DashboardContent.scss";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function DashboardContent() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users - use large page size to get accurate count
      let totalUsers = 0;
      try {
        const usersResponse = await fetchAllUsersApi(1, 1000);
        if (usersResponse?.meta?.total !== undefined) {
          totalUsers = usersResponse.meta.total;
        } else if (Array.isArray(usersResponse?.result)) {
          totalUsers = usersResponse.result.length;
        } else if ((usersResponse as any)?.data && Array.isArray((usersResponse as any).data.result)) {
          totalUsers = (usersResponse as any).data.result.length;
        }
      } catch (error) {
        // Error fetching users
      }

      // Fetch products - use large page size to get accurate count
      let totalProducts = 0;
      try {
        const productsResponse = await fetchAllProductApi(1, 1000);
        if (productsResponse?.meta?.total !== undefined) {
          totalProducts = productsResponse.meta.total;
        } else if (Array.isArray(productsResponse?.result)) {
          totalProducts = productsResponse.result.length;
        } else if ((productsResponse as any)?.data && Array.isArray((productsResponse as any).data.result)) {
          totalProducts = (productsResponse as any).data.result.length;
        }
      } catch (error) {
        // Error fetching products
      }

      // Fetch orders - get first page for recent orders, then get total
      let totalOrders = 0;
      let orders: any[] = [];
      let totalRevenue = 0;
      try {
        // First fetch to get recent orders
        const recentOrdersResponse = await fetchAllOrdersApi(1, 5);
        
        // Get orders for recent orders table
        if (Array.isArray(recentOrdersResponse?.result)) {
          orders = recentOrdersResponse.result;
        } else if ((recentOrdersResponse as any)?.data && Array.isArray((recentOrdersResponse as any).data.result)) {
          orders = (recentOrdersResponse as any).data.result;
        } else if (Array.isArray(recentOrdersResponse)) {
          orders = recentOrdersResponse;
        }
        
        // Get total count
        if (recentOrdersResponse?.meta?.total !== undefined) {
          totalOrders = recentOrdersResponse.meta.total;
        } else {
          // If no meta, fetch with large page size to count
          const allOrdersResponse = await fetchAllOrdersApi(1, 1000);
          if (allOrdersResponse?.meta?.total !== undefined) {
            totalOrders = allOrdersResponse.meta.total;
          } else if (Array.isArray(allOrdersResponse?.result)) {
            totalOrders = allOrdersResponse.result.length;
          }
        }
        
        // Calculate total revenue from all orders (simplified - in real app use dedicated API)
        if (Array.isArray(orders)) {
          orders.forEach((order: any) => {
            if (order.total) {
              totalRevenue += parseFloat(order.total.toString());
            }
          });
        }
      } catch (error) {
        // Error fetching orders
      }

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      });

      // Get recent orders (first 5)
      if (Array.isArray(orders)) {
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      // Error fetching data
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      PENDING: "#f59e0b",
      CONFIRMED: "#3b82f6",
      PROCESSING: "#8b5cf6",
      SHIPPED: "#10b981",
      DELIVERED: "#059669",
      CANCELLED: "#ef4444",
    };

    const color = statusColors[status] || "#6d6d72";
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "400",
          backgroundColor: `${color}15`,
          color: color,
          display: "inline-block",
        }}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <h1 className="dashboard-content__title">Dashboard</h1>
        <div className="dashboard-content__loading">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-content__title">Dashboard Overview</h1>

      {/* Statistics Cards */}
      <div className="dashboard-content__stats">
        <div className="dashboard-content__stat-card" onClick={() => router.push("/dashboard/user")}>
          <div className="dashboard-content__stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="dashboard-content__stat-card__content">
            <div className="dashboard-content__stat-card__label">Total Users</div>
            <div className="dashboard-content__stat-card__value">{stats.totalUsers}</div>
          </div>
        </div>

        <div className="dashboard-content__stat-card" onClick={() => router.push("/dashboard/product")}>
          <div className="dashboard-content__stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="dashboard-content__stat-card__content">
            <div className="dashboard-content__stat-card__label">Total Products</div>
            <div className="dashboard-content__stat-card__value">{stats.totalProducts}</div>
          </div>
        </div>

        <div className="dashboard-content__stat-card" onClick={() => router.push("/dashboard/order")}>
          <div className="dashboard-content__stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </div>
          <div className="dashboard-content__stat-card__content">
            <div className="dashboard-content__stat-card__label">Total Orders</div>
            <div className="dashboard-content__stat-card__value">{stats.totalOrders}</div>
          </div>
        </div>

        <div className="dashboard-content__stat-card">
          <div className="dashboard-content__stat-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="dashboard-content__stat-card__content">
            <div className="dashboard-content__stat-card__label">Total Revenue</div>
            <div className="dashboard-content__stat-card__value">
              ${convertToNumberFormat(stats.totalRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-content__section">
        <div className="dashboard-content__section__header">
          <h2 className="dashboard-content__section__title">Recent Orders</h2>
          <button
            className="dashboard-content__section__link"
            onClick={() => router.push("/dashboard/order")}
          >
            View All →
          </button>
        </div>
        <div className="dashboard-content__table">
          {recentOrders.length > 0 ? (
            <table className="dashboard-content__table__inner">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      {order.shippingFirstName} {order.shippingLastName}
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>${convertToNumberFormat(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="dashboard-content__empty">No recent orders</div>
          )}
        </div>
      </div>
    </div>
  );
}
  