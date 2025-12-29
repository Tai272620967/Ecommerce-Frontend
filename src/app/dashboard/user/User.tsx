"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/base/components/DataTable/DataTable";
import "./User.scss";
import { Column, Row } from "react-table";
import { fetchAllUsersApi, deleteUserApi } from "@/base/utils/api/user";
import { useEffect, useState } from "react";
import { User } from "@/base/types/user";
import { Modal, message } from "antd";

export const UserDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllUsersApi(1, 20);
      
      // Handle response structure
      let usersData: User[] = [];
      
      if (response) {
        // Check if result is directly in response (expected structure)
        if (Array.isArray(response.result)) {
          usersData = response.result;
        } 
        // Check if result is nested in data (fallback)
        else if ((response as any).data && Array.isArray((response as any).data.result)) {
          usersData = (response as any).data.result;
        }
        // Check if response itself is an array (fallback)
        else if (Array.isArray(response)) {
          usersData = response;
        }
      }
      
      setUsers(usersData);
    } catch (error) {
      // Error fetching users
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDeleteUser = (user: User) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete user: ${user.firstName} ${user.lastName} (${user.email})? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteUserApi(user.id);
          message.success("User deleted successfully");
          // Reload users list
          await fetchAllUsers();
        } catch (error) {
          message.error("Failed to delete user");
        }
      },
    });
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Configure columns
  const columns: Column<User>[] = [
    {
      Header: "ID",
      accessor: "id",
      width: 80,
    },
    {
      Header: "Name",
      accessor: "firstName",
      Cell: ({ row }: { row: Row<User> }) => (
        <span>
          {row.original.lastName} {row.original.firstName}
        </span>
      ),
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Phone",
      accessor: "phone",
      Cell: ({ value }: { value: string | undefined }) => value || "-",
    },
    {
      Header: "Address",
      Cell: ({ row }: { row: Row<User> }) => (
        <span>
          {row.original.address1 || ""} {row.original.address2 || ""}{" "}
          {row.original.address3 || ""} {row.original.address4 || ""}
        </span>
      ),
    },
    {
      Header: "Gender",
      accessor: "gender",
      Cell: ({ value }: { value: string | undefined }) => {
        if (!value) return "-";
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      },
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ value }: { value: string | undefined }) => formatDate(value),
    },
    {
      id: "actions",
      Header: "",
      width: 150,
      Cell: ({ row }: { row: Row<User> }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="muji-button"
            style={{
              padding: "8px 16px",
              fontSize: "13px",
            }}
          >
            Update
          </button>
          <button
            onClick={() => handleDeleteUser(row.original)}
            className="muji-button muji-button--danger"
            style={{
              padding: "8px 16px",
              fontSize: "13px",
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="user-dashboard__wrapper">
        <div className="user-dashboard__title">
          <h1>Users</h1>
        </div>
        <div>Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard__wrapper">
      <div className="user-dashboard__title">
        <h1>Users</h1>
      </div>
      <div className="user-dashboard__table">
        {users.length > 0 ? (
          <DataTable columns={columns} data={users} className="users-table" />
        ) : (
          <div>No users found. Users count: {users.length}</div>
        )}
      </div>
    </div>
  );
};

