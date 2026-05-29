import { useState, useEffect, useCallback } from 'react';
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByStatus,
  Product,
} from '@/services/productService';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  addNewProduct: (product: Product) => Promise<void>;
  updateExistingProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteExistingProduct: (id: string) => Promise<void>;
  searchByCategory: (category: string) => Promise<void>;
  searchByStatus: (status: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Cargar todos los productos
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Agregar nuevo producto
  const addNewProduct = useCallback(
    async (product: Product) => {
      try {
        const id = await addProduct(product);
        setProducts((prev) => [...prev, { ...product, id }]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error al agregar producto'));
        throw err;
      }
    },
    []
  );

  // Actualizar producto existente
  const updateExistingProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      try {
        await updateProduct(id, updates);
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error al actualizar producto'));
        throw err;
      }
    },
    []
  );

  // Eliminar producto
  const deleteExistingProduct = useCallback(
    async (id: string) => {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error al eliminar producto'));
        throw err;
      }
    },
    []
  );

  // Buscar por categoría
  const searchByCategory = useCallback(
    async (category: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByCategory(category);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error en búsqueda por categoría'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Buscar por estado
  const searchByStatus = useCallback(
    async (status: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByStatus(status);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error en búsqueda por estado'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Recargar productos
  const refetch = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    addNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    searchByCategory,
    searchByStatus,
    refetch,
  };
};
