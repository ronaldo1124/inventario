import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, X, Download } from "lucide-react";
import { StatsCards } from "../components/inventory/StatsCards";
import { ProductTable } from "../components/inventory/ProductTable";
import { ProductModal } from "../components/inventory/ProductModal";
import { DeleteModal } from "../components/inventory/DeleteModal";
import { StockChart } from "../components/inventory/StockChart";
import { Product, CATEGORIES } from "../components/inventory/types";
import { toast } from "sonner";

interface DashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

type ModalState =
  | { type: "none" }
  | { type: "edit"; product: Product }
  | { type: "delete"; product: Product };

export default function Dashboard({ products, setProducts }: DashboardProps) {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() =>
    products.filter((p) => {
      const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "Todas" || p.category === selectedCategory;
      const matchStatus = selectedStatus === "Todos" || p.status === selectedStatus;
      return matchSearch && matchCat && matchStatus;
    }), [products, search, selectedCategory, selectedStatus]);

  const hasFilters = search !== "" || selectedCategory !== "Todas" || selectedStatus !== "Todos";

  const handleSave = (data: Omit<Product, "id" | "createdAt" | "sold">) => {
    if (modal.type === "edit") {
      setProducts((prev) => prev.map((p) => p.id === modal.product.id ? { ...modal.product, ...data } : p));
      toast.success("Producto actualizado");
    }
    setModal({ type: "none" });
  };

  const handleDelete = () => {
    if (modal.type === "delete") {
      setProducts((prev) => prev.filter((p) => p.id !== modal.product.id));
      toast.error(`"${modal.product.name}" eliminado`);
      setModal({ type: "none" });
    }
  };

  const handleExport = () => {
    const headers = ["Nombre", "SKU", "Categoría", "Precio", "Costo", "Stock", "Vendidos", "Estado"];
    const rows = filtered.map((p) => [p.name, p.sku, p.category, p.price, p.cost, p.stock, p.sold, p.status]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "inventario.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exportado como CSV");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Inventario General</h1>
          <p className="text-sm text-gray-500 mt-0.5">Resumen de todos tus productos y stock</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar CSV</span>
        </button>
      </div>

      {/* Stats */}
      <StatsCards products={products} />

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <StockChart products={products} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-gray-800 mb-4">Alertas de Stock</h3>
          <div className="space-y-2 overflow-y-auto max-h-[180px]">
            {products.filter((p) => p.stock <= p.minStock).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Sin alertas de stock</p>
            ) : (
              products.filter((p) => p.stock <= p.minStock).map((p) => (
                <div key={p.id} className={`flex items-center justify-between gap-2 text-sm rounded-lg px-3 py-2 ${p.stock === 0 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                  <span className="truncate">{p.name}</span>
                  <span className="shrink-0 text-xs">{p.stock === 0 ? "Agotado" : `Stock: ${p.stock}`}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Table with filters */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-50">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${showFilters ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          {hasFilters && (
            <button onClick={() => { setSearch(""); setSelectedCategory("Todas"); setSelectedStatus("Todos"); }} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded-lg">
              <X className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} de {products.length} productos</span>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 px-4 py-3 border-b border-gray-50 bg-gray-50/40">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Categoría</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="Todas">Todas las categorías</option>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Estado</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="Todos">Todos</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="discontinued">Descontinuado</option>
              </select>
            </div>
          </div>
        )}

        <ProductTable
          products={filtered}
          onEdit={(product) => setModal({ type: "edit", product })}
          onDelete={(product) => setModal({ type: "delete", product })}
        />
        <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
          Mostrando {filtered.length} producto{filtered.length !== 1 ? "s" : ""}{hasFilters && " (filtrado)"}
        </div>
      </div>

      {modal.type === "edit" && (
        <ProductModal product={modal.product} onClose={() => setModal({ type: "none" })} onSave={handleSave} />
      )}
      {modal.type === "delete" && (
        <DeleteModal product={modal.product} onClose={() => setModal({ type: "none" })} onConfirm={handleDelete} />
      )}
    </div>
  );
}
