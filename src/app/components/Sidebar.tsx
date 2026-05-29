import { LayoutDashboard, TrendingUp, PlusCircle, Trash2, Package, Menu, X, Bell, ShoppingCart, PackagePlus, History, Truck } from "lucide-react";

export type Page = "dashboard" | "bestsellers" | "register" | "clean" | "sales" | "stockentry" | "history" | "suppliers";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  alertCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: { key: Page; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  { key: "dashboard", label: "Inventario General", icon: LayoutDashboard, description: "Resumen y gestión de stock" },
  { key: "bestsellers", label: "Más Vendidos", icon: TrendingUp, description: "Ranking y análisis de ventas" },
  { key: "sales", label: "Gestión de Ventas", icon: ShoppingCart, description: "Registrar y consultar ventas" },
  { key: "stockentry", label: "Entrada de Productos", icon: PackagePlus, description: "Recepcionar inventario" },
  { key: "register", label: "Registrar Producto", icon: PlusCircle, description: "Agregar nuevos ítems" },
  { key: "history", label: "Historial de Movimientos", icon: History, description: "Trazabilidad de operaciones" },
  { key: "suppliers", label: "Gestión de Proveedores", icon: Truck, description: "Administrar proveedores" },
  { key: "clean", label: "Limpiar Inventario", icon: Trash2, description: "Agotados y descontinuados" },
];

export function Sidebar({ activePage, onNavigate, alertCount, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-gray-950 text-white transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex w-64 shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-white">Inventario<span className="text-blue-400">Pro</span></p>
              <p className="text-xs text-gray-500">Panel de gestión</p>
            </div>
          </div>
          <button onClick={onToggle} className="lg:hidden p-1 hover:bg-white/10 rounded-lg text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { onNavigate(item.key); onToggle(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? "bg-white/20" : "bg-white/5"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm truncate">{item.label}</p>
                  <p className={`text-xs truncate ${isActive ? "text-white/70" : "text-gray-600"}`}>{item.description}</p>
                </div>
                {item.key === "clean" && alertCount > 0 && (
                  <span className="ml-auto shrink-0 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {alertCount > 9 ? "9+" : alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-gray-600">InventarioPro v1.0</p>
          <p className="text-xs text-gray-700">© 2025 Todos los derechos</p>
        </div>
      </aside>
    </>
  );
}

interface TopBarProps {
  activePage: Page;
  alertCount: number;
  onMenuToggle: () => void;
}

const pageTitles: Record<Page, string> = {
  dashboard: "Inventario General",
  bestsellers: "Más Vendidos",
  sales: "Gestión de Ventas",
  stockentry: "Entrada de Productos",
  register: "Registrar Producto",
  history: "Historial de Movimientos",
  suppliers: "Gestión de Proveedores",
  clean: "Limpiar Inventario",
};

export function TopBar({ activePage, alertCount, onMenuToggle }: TopBarProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20 h-14 flex items-center px-4 gap-3">
      <button onClick={onMenuToggle} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500">
        <Menu className="w-5 h-5" />
      </button>
      <h2 className="text-gray-900 truncate">{pageTitles[activePage]}</h2>
      {alertCount > 0 && (
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs text-amber-700">{alertCount} alerta{alertCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}
    </header>
  );
}
