import { useState } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash2, ArrowUpDown, Package } from "lucide-react";
import { Product, SortField, SortOrder } from "./types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const statusConfig = {
  active: { label: "Activo", className: "bg-green-100 text-green-700" },
  inactive: { label: "Inactivo", className: "bg-gray-100 text-gray-600" },
  discontinued: { label: "Descontinuado", className: "bg-red-100 text-red-600" },
};

function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">Agotado</span>;
  if (stock <= minStock)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">⚠ {stock}</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700">{stock}</span>;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortOrder("asc"); }
  };

  const sorted = [...products].sort((a, b) => {
    let valA: string | number = a[sortField];
    let valB: string | number = b[sortField];
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />;
    return sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />;
  };

  const th = "px-4 py-3 text-left text-xs text-gray-500 select-none cursor-pointer hover:text-gray-800 whitespace-nowrap";

  if (sorted.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
        <Package className="w-12 h-12 opacity-30" />
        <p className="text-sm">No se encontraron productos</p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-100">
          <tr>
            <th className={th} onClick={() => handleSort("name")}><span className="flex items-center gap-1.5">Producto <SortIcon field="name" /></span></th>
            <th className={th} onClick={() => handleSort("sku")}><span className="flex items-center gap-1.5">SKU <SortIcon field="sku" /></span></th>
            <th className={th} onClick={() => handleSort("category")}><span className="flex items-center gap-1.5">Categoría <SortIcon field="category" /></span></th>
            <th className={th} onClick={() => handleSort("price")}><span className="flex items-center gap-1.5">Precio <SortIcon field="price" /></span></th>
            <th className="px-4 py-3 text-left text-xs text-gray-500 whitespace-nowrap">Margen</th>
            <th className={th} onClick={() => handleSort("stock")}><span className="flex items-center gap-1.5">Stock <SortIcon field="stock" /></span></th>
            <th className={th} onClick={() => handleSort("sold")}><span className="flex items-center gap-1.5">Vendidos <SortIcon field="sold" /></span></th>
            <th className="px-4 py-3 text-left text-xs text-gray-500">Estado</th>
            <th className="px-4 py-3 text-right text-xs text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sorted.map((product) => {
            const margin = product.cost > 0 ? (((product.price - product.cost) / product.price) * 100).toFixed(0) : "-";
            const statusCfg = statusConfig[product.status];
            return (
              <tr key={product.id} className="hover:bg-gray-50/70 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-900 truncate max-w-[160px]">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.unit}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{product.sku}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{product.category}</td>
                <td className="px-4 py-3 text-gray-900 tabular-nums whitespace-nowrap">
                  ${product.price.toFixed(2)}
                  <p className="text-xs text-gray-400">costo ${product.cost.toFixed(2)}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs tabular-nums ${Number(margin) >= 40 ? "text-green-600" : Number(margin) >= 20 ? "text-amber-600" : "text-red-500"}`}>
                    {margin !== "-" ? `${margin}%` : "-"}
                  </span>
                </td>
                <td className="px-4 py-3"><StockBadge stock={product.stock} minStock={product.minStock} /></td>
                <td className="px-4 py-3 text-gray-600 tabular-nums">{product.sold.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusCfg.className}`}>{statusCfg.label}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(product)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(product)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
