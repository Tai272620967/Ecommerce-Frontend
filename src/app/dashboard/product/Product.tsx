"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/base/components/DataTable/DataTable";
import "./Product.scss";
import { Column, Row } from "react-table";
import { fetchAllProductApi, deleteProductApi } from "@/base/utils/api/product";
import { useEffect, useState } from "react";
import { Product } from "@/base/types/Product";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/base/utils/imageUrl";
import { Modal, message } from "antd";
import { convertToNumberFormat } from "@/base/utils";

export const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchAllProductApi(1, 20);
      
      // Handle different possible response structures
      let productsData: Product[] = [];
      
      if (response) {
        // Check if result is directly in response (expected structure)
        if (Array.isArray(response.result)) {
          productsData = response.result;
        } 
        // Check if result is nested in data (fallback for different API structure)
        else if ((response as any).data && Array.isArray((response as any).data.result)) {
          productsData = (response as any).data.result;
        }
        // Check if response itself is an array (fallback)
        else if (Array.isArray(response)) {
          productsData = response;
        }
      }
      
      setProducts(productsData);
    } catch (error) {
      // Error fetching products
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDeleteProduct = (product: Product) => {
    Modal.confirm({
      title: "Delete Product",
      content: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteProductApi(product.id);
          message.success("Product deleted successfully");
          // Reload products list
          await fetchAllProducts();
        } catch (error) {
          message.error("Failed to delete product");
        }
      },
    });
  };

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
          <img 
            src={getImageUrl(value)} 
            alt="Product thumbnail" 
            style={{ width: 50, height: 50, objectFit: "cover" }} 
          />
        ) : (
          <span>No image</span>
        ),
    },
    {
      Header: "Price",
      accessor: "minPrice",
      Cell: ({ value, row }: { value: number | undefined; row: Row<Product> }) => {
        if (!value) return "-";
        const minPrice = value;
        const maxPrice = row.original.maxPrice;
        
        if (maxPrice && maxPrice !== minPrice) {
          return `USD ${convertToNumberFormat(minPrice)} 〜 USD ${convertToNumberFormat(maxPrice)}`;
        }
        return `USD ${convertToNumberFormat(minPrice)}`;
      },
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
        Cell: ({ row }: { row: Row<any> }) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="muji-button"
              style={{
                padding: "8px 16px",
                fontSize: "13px",
              }}
              onClick={() => router.push("/dashboard/product/create")}
            >
              View
            </button>
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
              onClick={() => handleDeleteProduct(row.original)}
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
      <div className="product-dashboard__wrapper">
        <div className="product-dashboard__title">
          <h1>Products</h1>
        </div>
        <div>Loading products...</div>
      </div>
    );
  }

  return (
    <div className="product-dashboard__wrapper">
      <div className="product-dashboard__title">
        <h1>Products</h1>
      </div>
      <div className="product-dashboard__table">
        {products.length > 0 ? (
          <DataTable columns={columns} data={products} className="products-table"/>
        ) : (
          <div>No products found. Products count: {products.length}</div>
        )}
      </div>
    </div>
  );
};
