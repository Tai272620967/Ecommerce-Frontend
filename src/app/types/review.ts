export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userEmail: string;
  userAvatarUrl?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  reviewCount: number;
}

export interface ReviewDTO {
  rating: number;
  comment?: string;
}

