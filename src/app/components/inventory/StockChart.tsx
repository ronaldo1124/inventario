import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Product } from "./types";

interface StockChartProps {
  products: Product[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#84cc16",
];

export function StockChart({ products }: StockChartProps) {
  const categoryData = products.reduce<Record<string, { stock: number; value: number }>>(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = { stock: 0, value: 0 };
      acc[p.category].stock += p.stock;
      acc[p.category].value += p.price * p.stock;
      return acc;
    },
    {}
  );

  const data = Object.entries(categoryData)
    .map(([name, vals]) => ({
      name: name.split(" ")[0],
      stock: vals.stock,
      value: Math.round(vals.value),
    }))
    .sort((a, b) => b.stock - a.stock);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-gray-800 mb-4">Stock por Categoría</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={22}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #f3f4f6",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              fontSize: "12px",
            }}
            formatter={(value: number) => [value, "Unidades"]}
          />
          <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
