export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  minPrice: number;
  maxPrice: number;
  description: string;
  stockQuantity: number;
}

export interface ProductsResponse {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: Product[];
}

export interface ProductResponse {
  data: Product
}
