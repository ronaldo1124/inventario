import { useState } from "react";
import { Toaster } from "sonner";
import { Sidebar, TopBar, Page } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import BestSellers from "./pages/BestSellers";
import RegisterProduct from "./pages/RegisterProduct";
import CleanInventory from "./pages/CleanInventory";
import Sales from "./pages/Sales";
import StockEntry from "./pages/StockEntry";
import MovementHistory from "./pages/MovementHistory";
import Suppliers from "./pages/Suppliers";
import { initialProducts } from "./components/inventory/mockData";
import { Product } from "./components/inventory/types";

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const alertCount = products.filter(
    (p) => p.stock === 0 || p.status === "discontinued" || p.status === "inactive"
  ).length;

  const handleNavigate = (page: Page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const handleToggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toaster position="top-right" richColors />

      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        alertCount={alertCount}
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <TopBar
          activePage={activePage}
          alertCount={alertCount}
          onMenuToggle={handleToggleSidebar}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto p-4 sm:p-6">
            {activePage === "dashboard" && (
              <Dashboard products={products} setProducts={setProducts} />
            )}
            {activePage === "bestsellers" && (
              <BestSellers products={products} />
            )}
            {activePage === "sales" && (
              <Sales products={products} setProducts={setProducts} />
            )}
            {activePage === "stockentry" && (
              <StockEntry products={products} setProducts={setProducts} />
            )}
            {activePage === "register" && (
              <RegisterProduct products={products} setProducts={setProducts} />
            )}
            {activePage === "history" && (
              <MovementHistory />
            )}
            {activePage === "suppliers" && (
              <Suppliers />
            )}
            {activePage === "clean" && (
              <CleanInventory products={products} setProducts={setProducts} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
