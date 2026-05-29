export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  unit: string;
  description: string;
  status: "active" | "inactive" | "discontinued";
  sold: number; // units sold
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customer: string;
  paymentMethod: "efectivo" | "tarjeta" | "transferencia";
  date: string;
  status: "completed" | "pending" | "cancelled";
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: "entrada" | "salida" | "ajuste" | "venta" | "devolución";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  user: string;
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  rating: number;
  status: "active" | "inactive";
  productsSupplied: number;
  lastOrderDate: string;
}

export type SortField = "name" | "sku" | "category" | "price" | "stock" | "sold";
export type SortOrder = "asc" | "desc";

export const CATEGORIES = [
  "Electrónica",
  "Ropa y Accesorios",
  "Alimentos y Bebidas",
  "Hogar y Decoración",
  "Deportes",
  "Belleza y Cuidado",
  "Juguetes",
  "Herramientas",
];

export const UNITS = ["unidad", "kg", "litro", "par", "caja", "paquete", "metro", "docena"];
