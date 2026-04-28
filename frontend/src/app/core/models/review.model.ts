export interface Review {
  id: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  productId: number;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  title?: string;
  comment?: string;
}
