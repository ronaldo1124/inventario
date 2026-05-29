# Configuración de Firebase

## Pasos para configurar Firebase:

### 1. Crear un proyecto en Firebase
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Haz clic en "Agregar proyecto"
- Sigue los pasos para crear un nuevo proyecto

### 2. Obtener las credenciales
- En Firebase Console, ve a **Configuración del proyecto** (rueda de engranaje)
- Ve a la sección **General**
- Desplázate hasta **Tus aplicaciones** y haz clic en **</> (Web)**
- Copia las credenciales que aparecen

### 3. Actualizar el archivo de configuración
- Abre `src/config/firebase.ts`
- Reemplaza los valores `YOUR_API_KEY`, `YOUR_AUTH_DOMAIN`, etc. con los valores reales de Firebase

```typescript
const firebaseConfig = {
  apiKey: 'tu_api_key_aqui',
  authDomain: 'tu_auth_domain_aqui',
  projectId: 'tu_project_id_aqui',
  storageBucket: 'tu_storage_bucket_aqui',
  messagingSenderId: 'tu_messaging_sender_id_aqui',
  appId: 'tu_app_id_aqui',
};
```

### 4. Habilitar Firestore
- En Firebase Console, ve a **Base de datos**
- Haz clic en **Crear base de datos**
- Selecciona **Modo producción** (o desarrollo si es para pruebas)
- Selecciona la región más cercana
- Haz clic en **Crear**

### 5. Instalar Firebase
En tu terminal, ejecuta:
```bash
npm install firebase
```

### 6. Usar los servicios
Ahora puedes importar y usar los servicios en tus componentes:

```typescript
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '@/services/productService';

// Obtener todos los productos
const products = await getAllProducts();

// Agregar un producto
await addProduct({
  name: 'Producto',
  category: 'Electrónica',
  sku: 'PROD001',
  quantity: 10,
  price: 99.99,
  supplier: 'Proveedor',
  lastRestockDate: '2026-05-04',
  status: 'In Stock',
});
```

## Estructura de datos en Firestore
```
products/ (colección)
  ├── doc1
  │   ├── name: string
  │   ├── category: string
  │   ├── sku: string
  │   ├── quantity: number
  │   ├── price: number
  │   ├── supplier: string
  │   ├── lastRestockDate: string
  │   ├── status: string
  │   └── createdAt: timestamp
  ├── doc2
  └── ...
```

## Reglas de seguridad (opcional)
Para desarrollo, puedes usar estas reglas (NO uses en producción):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Para producción, implementa autenticación adecuada.
