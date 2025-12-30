"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/base/components/DataTable/DataTable";
import "./User.scss";
import { Column, Row } from "react-table";
import { fetchAllUsersApi } from "@/base/utils/api/user";
import { useEffect, useState } from "react";
import { User } from "@/base/types/user";
import { message } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "@/base/utils/imageUrl";

export const UserDashboard: React.FC = () => {
  const router = useRouter();
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

  // Get default avatar URL
  const getDefaultAvatar = () => {
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face&auto=format";
  };

  // Configure columns
  const columns: Column<User>[] = [
    {
      Header: "ID",
      accessor: "id",
      width: 80,
    },
    {
      Header: "Avatar",
      width: 80,
      Cell: ({ row }: { row: Row<User> }) => {
        const avatarUrl = row.original.avatarUrl;
        const imageSrc = avatarUrl ? getImageUrl(avatarUrl) : getDefaultAvatar();
        
        return (
          <div style={{ 
            width: "50px", 
            height: "50px", 
            borderRadius: "50%", 
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5"
          }}>
            <Image
              src={imageSrc}
              alt={`${row.original.firstName} ${row.original.lastName}`}
              width={50}
              height={50}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== getDefaultAvatar()) {
                  target.src = getDefaultAvatar();
                }
              }}
            />
          </div>
        );
      },
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
      width: 100,
      Cell: ({ row }: { row: Row<User> }) => (
        <button
          className="muji-button"
          style={{
            padding: "8px 16px",
            fontSize: "13px",
          }}
          onClick={() => router.push(`/dashboard/user/${row.original.id}`)}
        >
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="user-dashboard__wrapper">
        <div className="user-dashboard__title">
          <h1>Users</h1>
        </div>
        <div className="user-dashboard__table">
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

