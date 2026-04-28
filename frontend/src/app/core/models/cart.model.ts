export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productImageUrl?: string;
  productPrice: number;
  productSalePrice?: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}
