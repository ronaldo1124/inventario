import { db } from '@/config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  QueryConstraint,
} from 'firebase/firestore';

export interface Product {
  id?: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  price: number;
  supplier: string;
  lastRestockDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt?: Date;
}

const COLLECTION_NAME = 'products';

// Obtener todos los productos
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

// Obtener un producto por ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, productId);
    const docSnap = await getDocs(query(collection(db, COLLECTION_NAME), where('__name__', '==', productId)));
    if (!docSnap.empty) {
      return { id: docSnap.docs[0].id, ...docSnap.docs[0].data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

// Agregar un nuevo producto
export const addProduct = async (product: Product): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
};

// Actualizar un producto
export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, productId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

// Buscar productos por categoría
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    throw error;
  }
};

// Buscar productos por estado de stock
export const getProductsByStatus = async (status: string): Promise<Product[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
  } catch (error) {
    console.error('Error al obtener productos por estado:', error);
    throw error;
  }
};
