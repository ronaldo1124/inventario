import { useState } from "react";
import { Trash2, PackageX, AlertTriangle, CheckSquare, Square, RefreshCw, Package } from "lucide-react";
import { Product } from "../components/inventory/types";
import { DeleteModal } from "../components/inventory/DeleteModal";
import { toast } from "sonner";

interface CleanInventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

type FilterTab = "all" | "outofstock" | "discontinued" | "inactive";

export default function CleanInventory({ products, setProducts }: CleanInventoryProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmSingle, setConfirmSingle] = useState<Product | null>(null);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const outOfStock = products.filter((p) => p.stock === 0);
  const discontinued = products.filter((p) => p.status === "discontinued");
  const inactive = products.filter((p) => p.status === "inactive");

  const tabData: Record<FilterTab, Product[]> = {
    all: [...new Map([...outOfStock, ...discontinued, ...inactive].map((p) => [p.id, p])).values()],
    outofstock: outOfStock,
    discontinued,
    inactive,
  };

  const displayed = tabData[activeTab];

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === displayed.length) setSelected(new Set());
    else setSelected(new Set(displayed.map((p) => p.id)));
  };

  const handleDeleteSingle = () => {
    if (!confirmSingle) return;
    setProducts((prev) => prev.filter((p) => p.id !== confirmSingle.id));
    setSelected((prev) => { const next = new Set(prev); next.delete(confirmSingle.id); return next; });
    toast.error(`"${confirmSingle.name}" eliminado`);
    setConfirmSingle(null);
  };

  const handleDeleteBulk = () => {
    const count = selected.size;
    setProducts((prev) => prev.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
    setConfirmBulk(false);
    toast.error(`${count} producto${count !== 1 ? "s" : ""} eliminado${count !== 1 ? "s" : ""}`);
  };

  const handleReactivate = (product: Product) => {
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, status: "active" } : p));
    toast.success(`"${product.name}" reactivado`);
  };

  const tabs: { key: FilterTab; label: string; count: number; color: string }[] = [
    { key: "all", label: "Todos los críticos", count: tabData.all.length, color: "text-gray-600" },
    { key: "outofstock", label: "Agotados", count: outOfStock.length, color: "text-red-600" },
    { key: "discontinued", label: "Descontinuados", count: discontinued.length, color: "text-orange-600" },
    { key: "inactive", label: "Inactivos", count: inactive.length, color: "text-gray-500" },
  ];

  const statusLabel: Record<string, { label: string; cls: string }> = {
    active: { label: "Activo", cls: "bg-green-100 text-green-700" },
    inactive: { label: "Inactivo", cls: "bg-gray-100 text-gray-600" },
    discontinued: { label: "Descontinuado", cls: "bg-orange-100 text-orange-700" },
  };

  const reasonBadge = (p: Product) => {
    const badges: string[] = [];
    if (p.stock === 0) badges.push("Sin stock");
    if (p.status === "discontinued") badges.push("Descontinuado");
    if (p.status === "inactive") badges.push("Inactivo");
    return badges;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Limpiar Inventario</h1>
        <p className="text-sm text-gray-500 mt-0.5">Elimina o gestiona productos agotados, descontinuados e inactivos</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg"><PackageX className="w-5 h-5 text-red-500" /></div>
          <div>
            <p className="text-xs text-red-600/70">Productos agotados</p>
            <p className="text-2xl text-red-700 tabular-nums">{outOfStock.length}</p>
            <p className="text-xs text-red-500">Stock = 0</p>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-orange-500" /></div>
          <div>
            <p className="text-xs text-orange-600/70">Descontinuados</p>
            <p className="text-2xl text-orange-700 tabular-nums">{discontinued.length}</p>
            <p className="text-xs text-orange-500">Sin reposición</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-gray-100 rounded-lg"><Package className="w-5 h-5 text-gray-500" /></div>
          <div>
            <p className="text-xs text-gray-500">Inactivos</p>
            <p className="text-2xl text-gray-700 tabular-nums">{inactive.length}</p>
            <p className="text-xs text-gray-400">No disponibles</p>
          </div>
        </div>
      </div>

      {/* Main panel */}
      <div className="bg-white rounded-xl border border-gray-100">
        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-gray-100 px-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelected(new Set()); }}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        {displayed.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-2">
              <button onClick={toggleAll} className="text-gray-400 hover:text-gray-600 transition-colors">
                {selected.size === displayed.length && displayed.length > 0
                  ? <CheckSquare className="w-4.5 h-4.5 text-blue-600" />
                  : <Square className="w-4.5 h-4.5" />}
              </button>
              <span className="text-sm text-gray-500">
                {selected.size > 0 ? `${selected.size} seleccionado${selected.size !== 1 ? "s" : ""}` : `${displayed.length} productos`}
              </span>
            </div>
            {selected.size > 0 && (
              <button
                onClick={() => setConfirmBulk(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar seleccionados ({selected.size})
              </button>
            )}
          </div>
        )}

        {/* Product list */}
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-center">
              <p className="text-gray-700">¡Inventario limpio!</p>
              <p className="text-sm text-gray-400 mt-1">No hay productos en esta categoría</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {displayed.map((product) => {
              const isSelected = selected.has(product.id);
              const badges = reasonBadge(product);
              const st = statusLabel[product.status];
              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-4 px-4 py-4 transition-colors ${isSelected ? "bg-red-50/50" : "hover:bg-gray-50/50"}`}
                >
                  <button onClick={() => toggleSelect(product.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                    {isSelected ? <CheckSquare className="w-4.5 h-4.5 text-blue-600" /> : <Square className="w-4.5 h-4.5" />}
                  </button>

                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-900 text-sm truncate">{product.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400 font-mono">{product.sku}</span>
                      <span className="text-xs text-gray-400">{product.category}</span>
                      <span className="text-xs text-gray-400">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {badges.map((b) => (
                        <span key={b} className={`text-xs px-2 py-0.5 rounded-full ${
                          b === "Sin stock" ? "bg-red-100 text-red-600" :
                          b === "Descontinuado" ? "bg-orange-100 text-orange-600" :
                          "bg-gray-100 text-gray-500"
                        }`}>{b}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {product.status !== "active" && (
                      <button
                        onClick={() => handleReactivate(product)}
                        title="Reactivar"
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reactivar</span>
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmSingle(product)}
                      title="Eliminar"
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Single delete modal */}
      {confirmSingle && (
        <DeleteModal
          product={confirmSingle}
          onClose={() => setConfirmSingle(null)}
          onConfirm={handleDeleteSingle}
        />
      )}

      {/* Bulk delete confirm */}
      {confirmBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmBulk(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-gray-900">Eliminar {selected.size} productos</h2>
            <p className="text-sm text-gray-500 mt-1 mb-5">
              Esta acción es permanente y no se puede deshacer. ¿Confirmas?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmBulk(false)} className="flex-1 py-2 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">Cancelar</button>
              <button onClick={handleDeleteBulk} className="flex-1 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors">Eliminar todo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
