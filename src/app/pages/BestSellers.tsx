import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { TrendingUp, Award, DollarSign, ShoppingCart, Package } from "lucide-react";
import { Product } from "../components/inventory/types";

interface BestSellersProps {
  products: Product[];
}

const MEDAL_COLORS = ["#f59e0b", "#9ca3af", "#cd7f32"];
const BAR_COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#f5f3ff"];

const MONTHLY_MOCK: Record<string, number[]> = {
  "Café Premium Molido": [38, 44, 51, 48, 55, 62],
  "Camiseta Polo Classic": [28, 35, 42, 39, 44, 50],
  "Aceite de Oliva Extra Virgen": [30, 38, 40, 45, 48, 52],
  "Shampoo Orgánico 500ml": [25, 30, 35, 42, 48, 55],
  "Crema Hidratante Natural": [20, 28, 32, 38, 40, 45],
};
const MONTHS = ["Ago", "Sep", "Oct", "Nov", "Dic", "Ene"];

export default function BestSellers({ products }: BestSellersProps) {
  const topProducts = useMemo(() =>
    [...products].sort((a, b) => b.sold - a.sold).slice(0, 10),
    [products]
  );

  const top3 = topProducts.slice(0, 3);
  const totalSold = products.reduce((s, p) => s + p.sold, 0);
  const totalRevenue = products.reduce((s, p) => s + p.sold * p.price, 0);
  const bestCategory = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + p.sold; });
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0];
  }, [products]);

  const chartData = topProducts.slice(0, 8).map((p) => ({
    name: p.name.length > 16 ? p.name.slice(0, 16) + "…" : p.name,
    vendidos: p.sold,
    ingresos: Math.round(p.sold * p.price),
  }));

  const trendData = MONTHS.map((month, i) => {
    const entry: Record<string, string | number> = { month };
    Object.entries(MONTHLY_MOCK).forEach(([name, vals]) => {
      const short = name.split(" ").slice(0, 2).join(" ");
      entry[short] = vals[i];
    });
    return entry;
  });

  const trendLines = Object.entries(MONTHLY_MOCK).map(([name]) =>
    name.split(" ").slice(0, 2).join(" ")
  );
  const LINE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Productos más Vendidos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Análisis de ventas y rendimiento por producto</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><ShoppingCart className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-blue-600/70">Total unidades vendidas</p>
              <p className="text-2xl text-blue-700 tabular-nums mt-0.5">{totalSold.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <p className="text-xs text-emerald-600/70">Ingresos totales</p>
              <p className="text-2xl text-emerald-700 tabular-nums mt-0.5">${totalRevenue.toLocaleString("es", { maximumFractionDigits: 0 })}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 col-span-2 lg:col-span-1">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><TrendingUp className="w-5 h-5 text-purple-600" /></div>
            <div>
              <p className="text-xs text-purple-600/70">Categoría líder</p>
              <p className="text-lg text-purple-700 mt-0.5 truncate">{bestCategory?.[0]}</p>
              <p className="text-xs text-purple-500">{bestCategory?.[1].toLocaleString()} unidades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-gray-800">Top 3 Productos</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {top3.map((product, index) => {
            const revenueShare = ((product.sold / totalSold) * 100).toFixed(1);
            return (
              <div
                key={product.id}
                className={`relative rounded-xl p-5 border-2 ${
                  index === 0
                    ? "border-amber-300 bg-amber-50"
                    : index === 1
                    ? "border-gray-300 bg-gray-50"
                    : "border-orange-300 bg-orange-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: MEDAL_COLORS[index] }}
                  >
                    <span className="text-sm">#{index + 1}</span>
                  </div>
                  <div
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: MEDAL_COLORS[index] + "20",
                      color: MEDAL_COLORS[index],
                    }}
                  >
                    {revenueShare}% ventas
                  </div>
                </div>
                <p className="text-gray-900 text-sm">{product.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                <div className="mt-3 pt-3 border-t border-current/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Unidades vendidas</p>
                    <p className="tabular-nums text-gray-900">{product.sold.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Ingresos</p>
                    <p className="tabular-nums text-gray-900">${(product.sold * product.price).toLocaleString("es", { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-gray-800 mb-4">Unidades vendidas — Top 8 productos</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barSize={24} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={35} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #f3f4f6", fontSize: "12px" }}
              formatter={(val: number) => [val.toLocaleString(), "Unidades"]}
            />
            <Bar dataKey="vendidos" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Line Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-gray-800 mb-1">Tendencia de ventas — Últimos 6 meses</h3>
        <p className="text-xs text-gray-400 mb-4">Top 5 productos más vendidos</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #f3f4f6", fontSize: "12px" }} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            {trendLines.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={LINE_COLORS[i]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Full Ranking Table */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-gray-800">Ranking completo</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs text-gray-500">#</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500">Producto</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500">Categoría</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500">Precio</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500">Unidades vendidas</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500">Ingresos</th>
                <th className="px-5 py-3 text-left text-xs text-gray-500">% del total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p, index) => {
                const revenue = p.sold * p.price;
                const share = ((p.sold / totalSold) * 100).toFixed(1);
                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        index === 0 ? "bg-amber-100 text-amber-700" :
                        index === 1 ? "bg-gray-100 text-gray-600" :
                        index === 2 ? "bg-orange-100 text-orange-600" :
                        "text-gray-400"
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Package className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <span className="text-gray-900 truncate max-w-[160px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{p.category}</td>
                    <td className="px-5 py-3 text-gray-900 tabular-nums">${p.price.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums text-gray-900">{p.sold.toLocaleString()}</span>
                        <div className="flex-1 min-w-[60px] bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${(p.sold / topProducts[0].sold) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-900 tabular-nums whitespace-nowrap">
                      ${revenue.toLocaleString("es", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full tabular-nums">{share}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
