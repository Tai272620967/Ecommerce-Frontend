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
  data: {
    result: Product[];
  };
}

export interface ProductResponse {
  data: Product
}
