export interface CreateProductRequest {
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  images?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  stock?: number;
  images?: string[];
}

export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
