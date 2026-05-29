import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle, Package, Plus } from "lucide-react";
import { Product, CATEGORIES, UNITS } from "../components/inventory/types";
import { toast } from "sonner";

interface RegisterProductProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

type FormData = Omit<Product, "id" | "createdAt" | "sold">;

export default function RegisterProduct({ products, setProducts }: RegisterProductProps) {
  const [success, setSuccess] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "", sku: "", category: CATEGORIES[0],
      price: 0, cost: 0, stock: 0, minStock: 5,
      unit: "unidad", description: "", status: "active",
    },
  });

  const onSubmit = (data: FormData) => {
    const skuExists = products.some((p) => p.sku.toLowerCase() === data.sku.toLowerCase());
    if (skuExists) {
      toast.error("Ya existe un producto con ese SKU");
      return;
    }
    const newProduct: Product = {
      ...data,
      id: Date.now().toString(),
      price: Number(data.price),
      cost: Number(data.cost),
      stock: Number(data.stock),
      minStock: Number(data.minStock),
      sold: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
    setSuccess(newProduct);
    toast.success("Producto registrado exitosamente");
    reset();
  };

  const handleAddAnother = () => setSuccess(null);

  if (success) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-gray-900">Registrar Producto</h1>
          <p className="text-sm text-gray-500 mt-0.5">Agrega nuevos ítems al inventario</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center text-center gap-5 max-w-lg mx-auto w-full">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-gray-900">¡Producto registrado!</h2>
            <p className="text-sm text-gray-500 mt-1">
              <span className="text-gray-800">"{success.name}"</span> fue agregado al inventario correctamente.
            </p>
          </div>
          <div className="w-full bg-gray-50 rounded-xl p-4 text-left grid grid-cols-2 gap-3 text-sm">
            {[
              ["SKU", success.sku],
              ["Categoría", success.category],
              ["Precio", `$${Number(success.price).toFixed(2)}`],
              ["Stock inicial", `${success.stock} ${success.unit}`],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-gray-800">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={handleAddAnother}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Registrar otro producto
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Registrar Producto</h1>
        <p className="text-sm text-gray-500 mt-0.5">Agrega nuevos ítems al inventario</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-gray-800">Datos del producto</h3>
          </div>

          {/* Name + SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Nombre del producto <span className="text-red-500">*</span></label>
              <input
                {...register("name", { required: "El nombre es obligatorio" })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Ej: Audífonos Bluetooth Pro"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">SKU / Código <span className="text-red-500">*</span></label>
              <input
                {...register("sku", { required: "El SKU es obligatorio" })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono"
                placeholder="Ej: ELEC-016"
              />
              {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
            </div>
          </div>

          {/* Category + Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Categoría <span className="text-red-500">*</span></label>
              <select {...register("category")} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Unidad de medida</label>
              <select {...register("unit")} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Precio de venta ($) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                <input
                  {...register("price", { required: "El precio es obligatorio", min: { value: 0.01, message: "Debe ser mayor a 0" } })}
                  type="number" step="0.01"
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Costo ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                <input
                  {...register("cost", { min: { value: 0, message: "Mínimo 0" } })}
                  type="number" step="0.01"
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Stock + Min Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Stock inicial <span className="text-red-500">*</span></label>
              <input
                {...register("stock", { required: "El stock es obligatorio", min: { value: 0, message: "Mínimo 0" } })}
                type="number"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Stock mínimo (alerta)</label>
              <input
                {...register("minStock", { min: { value: 0, message: "Mínimo 0" } })}
                type="number"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="5"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Estado inicial</label>
            <div className="flex gap-3">
              {(["active", "inactive"] as const).map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input {...register("status")} type="radio" value={val} className="accent-blue-600" />
                  <span className="text-sm text-gray-700">{val === "active" ? "Activo" : "Inactivo"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Descripción</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Registrar producto
          </button>
        </form>

        {/* Tips sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <h4 className="text-blue-800 mb-3">Consejos</h4>
            <ul className="space-y-2.5 text-sm text-blue-700">
              {[
                "Usa un SKU único para identificar cada producto fácilmente.",
                "Define un stock mínimo para recibir alertas antes de agotarse.",
                "Registra el costo para calcular el margen de ganancia automáticamente.",
                "Categoriza correctamente para filtrar y reportar mejor.",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h4 className="text-gray-800 mb-3">Últimos registrados</h4>
            <div className="space-y-2">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Package className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
