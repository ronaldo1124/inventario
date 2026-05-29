import { useState } from "react";
import { toast } from "sonner";
import { Product } from "../components/inventory/types";
import { PackagePlus, TrendingUp, AlertCircle, Search, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

interface StockEntryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

interface StockEntryRecord {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantityReceived: number;
  previousStock: number;
  newStock: number;
  supplier: string;
  notes: string;
  date: string;
  user: string;
}

export default function StockEntry({ products, setProducts }: StockEntryProps) {
  const [entries, setEntries] = useState<StockEntryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [notes, setNotes] = useState("");

  const lowStockProducts = products.filter((p) => p.stock < p.minStock && p.status === "active");
  const outOfStockProducts = products.filter((p) => p.stock === 0 && p.status === "active");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterEntry = () => {
    if (!selectedProductId || !quantity || !supplier) {
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

    const previousStock = product.stock;
    const newStock = previousStock + qty;

    const newEntry: StockEntryRecord = {
      id: `ENT${String(entries.length + 1).padStart(4, "0")}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantityReceived: qty,
      previousStock,
      newStock,
      supplier,
      notes: notes || "Entrada de inventario",
      date: new Date().toISOString(),
      user: "Sistema",
    };

    setEntries([newEntry, ...entries]);

    // Update product stock
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
    );

    toast.success(`Entrada registrada: ${product.name} (+${qty} ${product.unit})`);
    setIsDialogOpen(false);
    setSelectedProductId("");
    setQuantity("");
    setSupplier("");
    setNotes("");
  };

  const handleQuickEntry = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setSelectedProductId(productId);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Entrada de Productos</h1>
        <p className="text-sm text-gray-600">Registra la recepción de inventario de tus proveedores</p>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <PackagePlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Entradas Registradas</p>
              <p className="text-xl text-gray-900">{entries.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Stock Bajo</p>
              <p className="text-xl text-gray-900">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Sin Stock</p>
              <p className="text-xl text-gray-900">{outOfStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <h3 className="text-sm text-gray-900 mb-3">Productos que Requieren Atención</h3>
          <div className="space-y-2">
            {outOfStockProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">{product.sku} - Sin stock</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleQuickEntry(product.id)}>
                  <Plus className="w-3 h-3 mr-1" />
                  Entrada
                </Button>
              </div>
            ))}
            {lowStockProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">
                    {product.sku} - Stock: {product.stock} {product.unit} (Mín: {product.minStock})
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleQuickEntry(product.id)}>
                  <Plus className="w-3 h-3 mr-1" />
                  Entrada
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Register */}
      <div className="bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar producto por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Entrada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Entrada de Inventario</DialogTitle>
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
                        .filter((p) => p.status === "active")
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({p.sku}) - Stock actual: {p.stock} {p.unit}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cantidad Recibida *</Label>
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                  {selectedProductId && quantity && (
                    <p className="text-xs text-gray-600 mt-1">
                      Nuevo stock:{" "}
                      {(products.find((p) => p.id === selectedProductId)?.stock || 0) +
                        parseInt(quantity || "0")}{" "}
                      {products.find((p) => p.id === selectedProductId)?.unit}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Proveedor *</Label>
                  <Input
                    placeholder="Nombre del proveedor"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Notas (opcional)</Label>
                  <Textarea
                    placeholder="Observaciones sobre la entrada..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleRegisterEntry} className="w-full">
                  Registrar Entrada
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm text-gray-900">Inventario de Productos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Producto</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">SKU</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Categoría</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">Stock Actual</th>
                <th className="px-4 py-3 text-right text-xs text-gray-600">Stock Mínimo</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Estado</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock < product.minStock && product.stock > 0;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        <span
                          className={
                            isOutOfStock
                              ? "text-red-600"
                              : isLowStock
                              ? "text-amber-600"
                              : ""
                          }
                        >
                          {product.stock} {product.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {product.minStock} {product.unit}
                      </td>
                      <td className="px-4 py-3">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700 border border-red-200">
                            <AlertCircle className="w-3 h-3" />
                            Sin stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3 h-3" />
                            Stock bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
                            <TrendingUp className="w-3 h-3" />
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickEntry(product.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Entrada
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm text-gray-900">Entradas Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Producto</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-600">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Proveedor</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.slice(0, 10).map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{entry.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-gray-900">{entry.productName}</p>
                        <p className="text-xs text-gray-500">{entry.sku}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 text-right">
                      +{entry.quantityReceived}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{entry.supplier}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(entry.date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
