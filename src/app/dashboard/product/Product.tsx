"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/base/components/DataTable/DataTable";
import "./Product.scss";
import { Column, Row } from "react-table";
import { fetchAllProductApi } from "@/base/utils/api/product";
import { useEffect, useState } from "react";
import { Product } from "@/base/types/Product";
import { useRouter } from "next/navigation";

export const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetchAllProductApi(1, 20);
        if (response) {
          setProducts(response.data.result);
        }
        console.log("products", response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllProducts();
  }, []);

  // Cấu hình cột
  const columns: Column<Product>[] = [
    {
      Header: "ID",
      accessor: "id", // Thuộc tính trong dữ liệu
    //   width: 10,
    },
    {
      Header: "Name",
      accessor: "name",
    //   width: 400,
    },
    {
      Header: "Image",
      accessor: "imageUrl",
      Cell: ({ value }: { value: string | undefined }) =>
        value ? (
          <img src={process.env.NEXT_PUBLIC_API_BASE_URI + value} alt="Thumbnail" style={{ width: 50 }} />
        ) : null,
    },
    {
      Header: "Price",
      accessor: "minPrice",
    },
    {
      Header: "Description",
      accessor: "description",
    //   width: 400,
    },
    {
      Header: "Stock",
      accessor: "stockQuantity",
    },
    {   
        id: "actions",
        Header: "",
        width: 150,
        Cell: ({ }: { row: Row<any> }) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
            //   onClick={() => handleView(row.original)}
              style={{
                backgroundColor: "#5cb377",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
              onClick={() => router.push("/dashboard/product/create")}
            >
              View
            </button>
            <button
            //   onClick={() => handleView(row.original)}
              style={{
                backgroundColor: "#66a0fd",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Update
            </button>
            <button
            //   onClick={() => handleDelete(row.original)}
              style={{
                backgroundColor: "#d26d69",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
  ];

  return (
    <div className="product-dashboard__wrapper">
      <div className="product-dashboard__title">
        <h1>Products</h1>
      </div>
      <div className="product-dashboard__table">
        <DataTable columns={columns} data={products} className="products-table"/>
      </div>
    </div>
  );
};
