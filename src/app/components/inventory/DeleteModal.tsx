import { AlertTriangle, X } from "lucide-react";
import { Product } from "./types";

interface DeleteModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ product, onClose, onConfirm }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h2 className="text-gray-900">Eliminar producto</h2>
            <p className="text-sm text-gray-500 mt-1">
              ¿Estás seguro de que deseas eliminar{" "}
              <span className="text-gray-800">"{product.name}"</span>? Esta
              acción no se puede deshacer.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
