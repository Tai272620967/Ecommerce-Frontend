import { Product } from "./Product";

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: Product;
}

export interface Order {
  id: number;
  userId: number;
  shippingFirstName: string;
  shippingLastName: string;
  shippingKataFirstName?: string;
  shippingKataLastName?: string;
  shippingPhone: string;
  shippingPostalCode: string;
  shippingPrefecture: string;
  shippingCity: string;
  shippingArea: string;
  shippingStreet: string;
  shippingBuilding?: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface OrderDTO {
  shippingFirstName: string;
  shippingLastName: string;
  shippingKataFirstName?: string;
  shippingKataLastName?: string;
  shippingPhone: string;
  shippingPostalCode: string;
  shippingPrefecture: string;
  shippingCity: string;
  shippingArea: string;
  shippingStreet: string;
  shippingBuilding?: string;
  paymentMethod: string;
  // Credit card information (optional, only when paymentMethod is credit_card)
  cardNumber?: string;
  cardHolderName?: string;
  cardExpiryMonth?: string;
  cardExpiryYear?: string;
  cardCvv?: string;
  cartId: number;
  shippingFee?: number;
  tax?: number;
}

export interface OrderResponse {
  data: Order;
}

export interface OrdersResponse {
  data: Order[];
}

