import { useState } from "react";
import { toast } from "sonner";
import { Product, Sale } from "../components/inventory/types";
import { initialSales } from "../components/inventory/additionalMockData";
import { DollarSign, TrendingUp, Package, Calendar, Search, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

interface SalesProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function Sales({ products, setProducts }: SalesProps) {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "cancelled">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | "transferencia">("efectivo");

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales
    .filter((s) => s.status === "completed")
    .reduce((sum, sale) => sum + sale.total, 0);
  const completedSales = sales.filter((s) => s.status === "completed").length;
  const pendingSales = sales.filter((s) => s.status === "pending").length;

  const handleRegisterSale = () => {
    if (!selectedProductId || !quantity || !customer) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) {
      toast.error("Producto no encontrado");
      return;
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    if (qty > product.stock) {
      toast.error(`Stock insuficiente. Disponible: ${product.stock} ${product.unit}`);
      return;
    }

    const newSale: Sale = {
      id: `S${String(sales.length + 1).padStart(3, "0")}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: qty,
      unitPrice: product.price,
      total: qty * product.price,
      customer,
      paymentMethod,
      date: new Date().toISOString(),
      status: "completed",
    };

    setSales([newSale, ...sales]);

    // Update product stock
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - qty, sold: p.sold + qty } : p
      )
    );

    toast.success(`Venta registrada: ${product.name} (${qty} ${product.unit})`);
    setIsDialogOpen(false);
    setSelectedProductId("");
    setQuantity("");
    setCustomer("");
    setPaymentMethod("efectivo");
  };

  const handleCancelSale = (saleId: string) => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale) return;

    if (sale.status === "cancelled") {
      toast.error("Esta venta ya está cancelada");
      return;
    }

    setSales((prev) => prev.map((s) => (s.id === saleId ? { ...s, status: "cancelled" as const } : s)));

    // Restore product stock if it was completed
    if (sale.status === "completed") {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === sale.productId
            ? { ...p, stock: p.stock + sale.quantity, sold: Math.max(0, p.sold - sale.quantity) }
            : p
        )
      );
    }

    toast.success("Venta cancelada. Stock restaurado.");
  };

  const getStatusBadge = (status: Sale["status"]) => {
    const styles = {
      completed: "bg-green-50 text-green-700 border-green-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      cancelled: "bg-gray-50 text-gray-700 border-gray-200",
    };
    const icons = {
      completed: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
    };
    const labels = {
      completed: "Completada",
      pending: "Pendiente",
      cancelled: "Cancelada",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Gestión de Ventas</h1>
        <p className="text-sm text-gray-600">Registra y consulta todas las ventas realizadas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Ingresos Totales</p>
              <p className="text-xl text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Ventas Completadas</p>
              <p className="text-xl text-gray-900">{completedSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Ventas Pendientes</p>
              <p className="text-xl text-gray-900">{pendingSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Ventas</p>
              <p className="text-xl text-gray-900">{sales.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por producto, SKU o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Venta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Venta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Producto *</Label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter((p) => p.status === "active" && p.stock > 0)
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} - Stock: {p.stock} {p.unit} - ${p.price}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cantidad *</Label>
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                  {selectedProductId && quantity && (
                    <p className="text-xs text-gray-600 mt-1">
                      Total: ${((products.find((p) => p.id === selectedProductId)?.price || 0) * parseInt(quantity || "0")).toFixed(2)}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Cliente *</Label>
                  <Input
                    placeholder="Nombre del cliente"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Método de Pago</Label>
                  <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleRegisterSale} className="w-full">
                  Registrar Venta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Producto</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Cliente</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">Cantidad</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">P. Unitario</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">Total</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Pago</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Fecha</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Estado</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-500">
                    No se encontraron ventas
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{sale.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-gray-900">{sale.productName}</p>
                        <p className="text-xs text-gray-500">{sale.sku}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{sale.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{sale.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">${sale.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">${sale.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 capitalize">{sale.paymentMethod}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(sale.date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(sale.status)}</td>
                    <td className="px-4 py-3">
                      {sale.status !== "cancelled" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelSale(sale.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Cancelar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
