import { useState } from "react";
import { Movement } from "../components/inventory/types";
import { initialMovements } from "../components/inventory/additionalMockData";
import { History, ArrowUpCircle, ArrowDownCircle, TrendingUp, RotateCcw, ShoppingCart, Search, Filter } from "lucide-react";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function MovementHistory() {
  const [movements] = useState<Movement[]>(initialMovements);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Movement["type"]>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  const getFilteredByDate = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return movements.filter((m) => {
      const movementDate = new Date(m.date);

      switch (dateFilter) {
        case "today":
          return movementDate >= today;
        case "week":
          return movementDate >= weekAgo;
        case "month":
          return movementDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredMovements = getFilteredByDate().filter((movement) => {
    const matchesSearch =
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: movements.length,
    entries: movements.filter((m) => m.type === "entrada").length,
    sales: movements.filter((m) => m.type === "venta").length,
    adjustments: movements.filter((m) => m.type === "ajuste").length,
    returns: movements.filter((m) => m.type === "devolución").length,
  };

  const getMovementIcon = (type: Movement["type"]) => {
    const icons = {
      entrada: <ArrowUpCircle className="w-4 h-4 text-green-600" />,
      salida: <ArrowDownCircle className="w-4 h-4 text-red-600" />,
      ajuste: <TrendingUp className="w-4 h-4 text-blue-600" />,
      venta: <ShoppingCart className="w-4 h-4 text-purple-600" />,
      devolución: <RotateCcw className="w-4 h-4 text-amber-600" />,
    };
    return icons[type];
  };

  const getMovementBadge = (type: Movement["type"]) => {
    const styles = {
      entrada: "bg-green-50 text-green-700 border-green-200",
      salida: "bg-red-50 text-red-700 border-red-200",
      ajuste: "bg-blue-50 text-blue-700 border-blue-200",
      venta: "bg-purple-50 text-purple-700 border-purple-200",
      devolución: "bg-amber-50 text-amber-700 border-amber-200",
    };
    const labels = {
      entrada: "Entrada",
      salida: "Salida",
      ajuste: "Ajuste",
      venta: "Venta",
      devolución: "Devolución",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${styles[type]}`}>
        {getMovementIcon(type)}
        {labels[type]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Historial de Movimientos</h1>
        <p className="text-sm text-gray-600">Trazabilidad completa de todas las operaciones de inventario</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <History className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-xl text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <ArrowUpCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Entradas</p>
              <p className="text-xl text-gray-900">{stats.entries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Ventas</p>
              <p className="text-xl text-gray-900">{stats.sales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Ajustes</p>
              <p className="text-xl text-gray-900">{stats.adjustments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <RotateCcw className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Devoluciones</p>
              <p className="text-xl text-gray-900">{stats.returns}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por producto, SKU, razón o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de movimiento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="entrada">Entradas</SelectItem>
              <SelectItem value="salida">Salidas</SelectItem>
              <SelectItem value="venta">Ventas</SelectItem>
              <SelectItem value="ajuste">Ajustes</SelectItem>
              <SelectItem value="devolución">Devoluciones</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el período</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Fecha y Hora</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Tipo</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Producto</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">Cantidad</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">Stock Anterior</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">Stock Nuevo</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Razón</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                    No se encontraron movimientos
                  </td>
                </tr>
              ) : (
                filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{movement.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {new Date(movement.date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      {new Date(movement.date).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">{getMovementBadge(movement.type)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-gray-900">{movement.productName}</p>
                        <p className="text-xs text-gray-500">{movement.sku}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span
                        className={
                          movement.type === "entrada" || movement.type === "devolución"
                            ? "text-green-600"
                            : movement.type === "salida" || movement.type === "venta"
                            ? "text-red-600"
                            : "text-blue-600"
                        }
                      >
                        {movement.type === "entrada" || movement.type === "devolución" ? "+" : ""}
                        {movement.type === "salida" || movement.type === "venta" ? "-" : ""}
                        {movement.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">{movement.previousStock}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{movement.newStock}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">
                      {movement.reason}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{movement.user}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-xl border border-gray-100">
        <p className="text-xs text-gray-600">
          Mostrando {filteredMovements.length} de {movements.length} movimientos registrados
        </p>
      </div>
    </div>
  );
}
