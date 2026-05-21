import { get } from "./api";

export interface Product {
  id: string;
  name: string;
  price: number;
  stockQty: number;
  imageUrl?: string;
  isActive: boolean;
}

export const ProductsService = {
  getAll: (): Promise<Product[]> => {
    return get<Product[]>("/products");
  },

  getById: (id: string): Promise<Product> => {
    return get<Product>(`/products/${id}`);
  },
};
