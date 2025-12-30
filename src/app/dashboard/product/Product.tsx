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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 10;
  const router = useRouter();

  const fetchAllProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetchAllProductApi(page, pageSize);
      
      // Handle different possible response structures
      let productsData: Product[] = [];
      let metaData: any = null;
      
      if (response) {
        // Check if result is nested in data (API returns response.data)
        if ((response as any).data) {
          if (Array.isArray((response as any).data.result)) {
            productsData = (response as any).data.result;
          }
          if ((response as any).data.meta) {
            metaData = (response as any).data.meta;
          }
        }
        // Check if result is directly in response (expected structure)
        else if (Array.isArray(response.result)) {
          productsData = response.result;
          if (response.meta) {
            metaData = response.meta;
          }
        }
        // Check if response itself is an array (fallback)
        else if (Array.isArray(response)) {
          productsData = response;
        }
        
        // Also check for meta at root level (in case it wasn't captured above)
        if (!metaData && (response as any).meta) {
          metaData = (response as any).meta;
        }
        
        // Update pagination info from meta
        if (metaData) {
          const totalValue = metaData.total || 0;
          const pagesValue = metaData.pages || 1;
          setTotalPages(pagesValue);
          setTotal(totalValue);
        } else {
          // Fallback: if no meta, calculate from products length
          const calculatedPages = Math.ceil(productsData.length / pageSize);
          setTotal(productsData.length);
          setTotalPages(calculatedPages || 1);
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
    if (currentPage >= 1) {
      fetchAllProducts(currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && (totalPages === 0 || page <= totalPages)) {
      setCurrentPage(page);
    }
  };

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
          await fetchAllProducts(currentPage);
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
          return `$${convertToNumberFormat(minPrice)} 〜 $${convertToNumberFormat(maxPrice)}`;
        }
        return `$${convertToNumberFormat(minPrice)}`;
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
              onClick={() => router.push(`/dashboard/product/update/${row.original.id}`)}
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
        <div className="product-dashboard__table">
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
    <div className="product-dashboard__wrapper">
      <div className="product-dashboard__title">
        <h1>Products</h1>
      </div>
      <div className="product-dashboard__table">
        {products.length > 0 ? (
          <>
            <DataTable columns={columns} data={products} className="products-table"/>
            {total > 0 && (
              <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
                <div style={{ color: "#6d6d72", fontSize: "14px" }}>
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} products
                </div>
                <div className="custom-pagination">
                  <button
                    className="custom-pagination__button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage !== 1) {
                        handlePageChange(1);
                      }
                    }}
                    disabled={currentPage === 1}
                    aria-label="First page"
                  >
                    ««
                  </button>
                  <button
                    className="custom-pagination__button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show all pages if totalPages <= 7
                    // Otherwise show first, last, current, and pages around current
                    if (totalPages <= 7) {
                      return (
                        <button
                          key={page}
                          className={`custom-pagination__button ${page === currentPage ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                        >
                          {page}
                        </button>
                      );
                    } else {
                      // Show first page
                      if (page === 1) {
                        return (
                          <button
                            key={page}
                            className={`custom-pagination__button ${page === currentPage ? 'active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </button>
                        );
                      }
                      // Show last page
                      if (page === totalPages) {
                        return (
                          <button
                            key={page}
                            className={`custom-pagination__button ${page === currentPage ? 'active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </button>
                        );
                      }
                      // Show current page and pages around it
                      if (page >= currentPage - 1 && page <= currentPage + 1) {
                        return (
                          <button
                            key={page}
                            className={`custom-pagination__button ${page === currentPage ? 'active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </button>
                        );
                      }
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={`ellipsis-${page}`} className="custom-pagination__ellipsis">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  })}
                  <button
                    className="custom-pagination__button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    ›
                  </button>
                  <button
                    className="custom-pagination__button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage !== totalPages) {
                        handlePageChange(totalPages);
                      }
                    }}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                  >
                    »»
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div>No products found. Products count: {products.length}</div>
        )}
      </div>
    </div>
  );
};
