import { Product } from "./Product";

export interface Cart {
    id: number;
    userId: number;
    status: string;
    message: string;
    totalQuantity: number;
}

export interface CartResponse {
    data: Cart;
    statusCode: number;
}

export interface CartItem {
    id: number;
    cart: Cart;
    quantity: number;
    price: number;  
    product: Product;
}

export interface CartItemsResponse {
    data: CartItem[];
}

export interface UpdatedCartItem {
    data: CartItem;
}

export interface DeleteCartItemResponse {
    data: {
        message: string
    };
}