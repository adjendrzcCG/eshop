export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  parentId?: number;
  parentName?: string;
  children?: Category[];
  active: boolean;
}
