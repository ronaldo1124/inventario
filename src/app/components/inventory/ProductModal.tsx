import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Product, CATEGORIES, UNITS } from "./types";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Omit<Product, "id" | "createdAt" | "sold">) => void;
}

type FormData = Omit<Product, "id" | "createdAt" | "sold">;

export function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          cost: product.cost,
          stock: product.stock,
          minStock: product.minStock,
          unit: product.unit,
          description: product.description,
          status: product.status,
        }
      : {
          name: "",
          sku: "",
          category: CATEGORIES[0],
          price: 0,
          cost: 0,
          stock: 0,
          minStock: 5,
          unit: "unidad",
          description: "",
          status: "active",
        },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        minStock: product.minStock,
        unit: product.unit,
        description: product.description,
        status: product.status,
      });
    }
  }, [product, reset]);

  const onSubmit = (data: FormData) => {
    onSave({
      ...data,
      price: Number(data.price),
      cost: Number(data.cost),
      stock: Number(data.stock),
      minStock: Number(data.minStock),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-gray-900">{isEdit ? "Editar Producto" : "Nuevo Producto"}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit ? "Modifica los datos del producto" : "Completa los datos para agregar un nuevo producto"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Nombre <span className="text-red-500">*</span></label>
              <input
                {...register("name", { required: "El nombre es obligatorio" })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Audífonos Bluetooth"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">SKU / Código <span className="text-red-500">*</span></label>
              <input
                {...register("sku", { required: "El SKU es obligatorio" })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: ELEC-001"
              />
              {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Categoría <span className="text-red-500">*</span></label>
              <select {...register("category")} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Unidad de medida</label>
              <select {...register("unit")} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Precio de venta ($) <span className="text-red-500">*</span></label>
              <input
                {...register("price", { required: "El precio es obligatorio", min: { value: 0, message: "Mínimo 0" } })}
                type="number" step="0.01"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Costo ($)</label>
              <input
                {...register("cost", { min: { value: 0, message: "Mínimo 0" } })}
                type="number" step="0.01"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Stock actual <span className="text-red-500">*</span></label>
              <input
                {...register("stock", { required: "El stock es obligatorio", min: { value: 0, message: "Mínimo 0" } })}
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Stock mínimo</label>
              <input
                {...register("minStock", { min: { value: 0, message: "Mínimo 0" } })}
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Estado</label>
            <select {...register("status")} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="discontinued">Descontinuado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Descripción</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descripción del producto..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              {isEdit ? "Guardar cambios" : "Agregar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
