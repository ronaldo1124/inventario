import { Package, DollarSign, AlertTriangle, ShoppingCart } from "lucide-react";
import { Product } from "./types";

interface StatsCardsProps {
  products: Product[];
}

export function StatsCards({ products }: StatsCardsProps) {
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);

  const cards = [
    {
      label: "Total Productos",
      value: totalProducts,
      sub: `${activeProducts} activos`,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Valor en Inventario",
      value: `$${totalValue.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: "precio de venta",
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Stock Crítico",
      value: lowStock + outOfStock,
      sub: `${outOfStock} agotados · ${lowStock} bajos`,
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      label: "Total Vendidos",
      value: totalSold.toLocaleString(),
      sub: "unidades en total",
      icon: ShoppingCart,
      color: "bg-purple-50 text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl p-4 flex items-start gap-4 ${card.color} border border-current/10`}
          >
            <div className={`p-2 rounded-lg ${card.iconBg} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-current/70 truncate">{card.label}</p>
              <p className="text-xl mt-0.5 tabular-nums">{card.value}</p>
              <p className="text-xs text-current/60 mt-0.5 truncate">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}