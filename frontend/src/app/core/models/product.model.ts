export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  primary: boolean;
  sortOrder: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  brand?: string;
  scale?: string;
  specifications?: string;
  images: ProductImage[];
  primaryImageUrl?: string;
  featured: boolean;
  active: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}
