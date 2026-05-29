import { useState } from "react";
import { toast } from "sonner";
import { Supplier, CATEGORIES } from "../components/inventory/types";
import { initialSuppliers } from "../components/inventory/additionalMockData";
import { Truck, Star, Package, Phone, Mail, MapPin, Plus, Search, Edit2, Archive } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formContactName, setFormContactName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCategories, setFormCategories] = useState<string[]>([]);
  const [formRating, setFormRating] = useState("5");

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeSuppliers = suppliers.filter((s) => s.status === "active").length;
  const totalProducts = suppliers.reduce((sum, s) => sum + s.productsSupplied, 0);
  const avgRating = suppliers.length > 0
    ? (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)
    : "0.0";

  const resetForm = () => {
    setFormName("");
    setFormContactName("");
    setFormEmail("");
    setFormPhone("");
    setFormAddress("");
    setFormCategories([]);
    setFormRating("5");
    setEditingSupplier(null);
  };

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormName(supplier.name);
      setFormContactName(supplier.contactName);
      setFormEmail(supplier.email);
      setFormPhone(supplier.phone);
      setFormAddress(supplier.address);
      setFormCategories(supplier.categories);
      setFormRating(supplier.rating.toString());
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSaveSupplier = () => {
    if (!formName || !formContactName || !formEmail || !formPhone || formCategories.length === 0) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    if (editingSupplier) {
      // Update existing supplier
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id
            ? {
                ...s,
                name: formName,
                contactName: formContactName,
                email: formEmail,
                phone: formPhone,
                address: formAddress,
                categories: formCategories,
                rating: parseFloat(formRating),
              }
            : s
        )
      );
      toast.success("Proveedor actualizado correctamente");
    } else {
      // Create new supplier
      const newSupplier: Supplier = {
        id: `SUP${String(suppliers.length + 1).padStart(3, "0")}`,
        name: formName,
        contactName: formContactName,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        categories: formCategories,
        rating: parseFloat(formRating),
        status: "active",
        productsSupplied: 0,
        lastOrderDate: new Date().toISOString().split("T")[0],
      };
      setSuppliers([newSupplier, ...suppliers]);
      toast.success("Proveedor agregado correctamente");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleToggleStatus = (supplierId: string) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId
          ? { ...s, status: s.status === "active" ? ("inactive" as const) : ("active" as const) }
          : s
      )
    );
    const supplier = suppliers.find((s) => s.id === supplierId);
    toast.success(
      `Proveedor ${supplier?.status === "active" ? "desactivado" : "activado"} correctamente`
    );
  };

  const toggleCategory = (category: string) => {
    setFormCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Gestión de Proveedores</h1>
        <p className="text-sm text-gray-600">Administra tu red de proveedores y sus categorías</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Proveedores</p>
              <p className="text-xl text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Proveedores Activos</p>
              <p className="text-xl text-gray-900">{activeSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Productos Suministrados</p>
              <p className="text-xl text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Calificación Promedio</p>
              <p className="text-xl text-gray-900">{avgRating}</p>
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
              placeholder="Buscar por nombre, contacto, email o categoría..."
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
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proveedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre de la Empresa *</Label>
                    <Input
                      placeholder="Ej: TechGlobal Electronics"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Persona de Contacto *</Label>
                    <Input
                      placeholder="Ej: Roberto Martínez"
                      value={formContactName}
                      onChange={(e) => setFormContactName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="contacto@empresa.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Teléfono *</Label>
                    <Input
                      placeholder="+1 555-0123"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Dirección</Label>
                  <Input
                    placeholder="Calle, número, ciudad"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Categorías de Productos *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`p-2 rounded-lg text-xs border transition-colors ${
                          formCategories.includes(category)
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {formCategories.length > 0 && (
                    <p className="text-xs text-gray-600 mt-2">
                      Seleccionadas: {formCategories.length} categoría(s)
                    </p>
                  )}
                </div>

                <div>
                  <Label>Calificación</Label>
                  <Select value={formRating} onValueChange={setFormRating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">★★★★★ (5.0 - Excelente)</SelectItem>
                      <SelectItem value="4.5">★★★★½ (4.5 - Muy bueno)</SelectItem>
                      <SelectItem value="4">★★★★ (4.0 - Bueno)</SelectItem>
                      <SelectItem value="3.5">★★★½ (3.5 - Regular)</SelectItem>
                      <SelectItem value="3">★★★ (3.0 - Aceptable)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveSupplier} className="w-full">
                  {editingSupplier ? "Actualizar Proveedor" : "Agregar Proveedor"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl border border-gray-100 text-center">
            <p className="text-sm text-gray-500">No se encontraron proveedores</p>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className={`bg-white p-5 rounded-xl border transition-all ${
                supplier.status === "active"
                  ? "border-gray-100 hover:border-blue-200 hover:shadow-sm"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-900">{supplier.name}</h3>
                    <p className="text-xs text-gray-500">{supplier.id}</p>
                  </div>
                </div>
                <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                  {supplier.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span>{supplier.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span>{supplier.phone}</span>
                </div>
                {supplier.address && (
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{supplier.address}</span>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1.5">Categorías:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="space-y-1">
                  {getRatingStars(supplier.rating)}
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Package className="w-3 h-3" />
                    <span>{supplier.productsSupplied} productos</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(supplier)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(supplier.id)}
                  >
                    <Archive className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Último pedido:{" "}
                {new Date(supplier.lastOrderDate).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
