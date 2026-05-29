# Inventory Management Page

A full-featured inventory management dashboard built with React, Vite and Tailwind CSS. Originally designed in Figma and implemented with production-ready UI components.

**Live demo:** [ronaldobr.dev/inventario](https://ronaldobr.dev/inventario/)

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | KPI cards, product table with search/filter, stock chart, add/edit/delete products |
| **Best Sellers** | Ranking of top-performing products by sales volume |
| **Sales** | Register sales transactions and update stock automatically |
| **Stock Entry** | Record incoming inventory from suppliers |
| **Register Product** | Add new products with full detail (SKU, category, price, stock) |
| **Movement History** | Audit log of all stock movements |
| **Suppliers** | Supplier directory and management |
| **Clean Inventory** | Bulk actions for discontinued or inactive products |

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 6** — build tool
- **Tailwind CSS 4** — utility-first styling
- **Radix UI** / **shadcn/ui** — accessible component primitives
- **Material UI (MUI)** — extended component library
- **Recharts** — charts and data visualization
- **Framer Motion** — animations
- **React Hook Form** — form management
- **Sonner** — toast notifications
- **Firebase** — backend/auth ready
- **React DnD** — drag and drop

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

> Requires Node.js 18+

### Firebase Setup

Copy the example environment file, fill in your Firebase project credentials, and follow the steps in [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md).

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── inventory/     # Core inventory components (table, modals, charts)
│   │   ├── ui/            # Reusable UI primitives (shadcn/ui)
│   │   └── Sidebar.tsx    # Navigation sidebar + topbar
│   └── pages/             # One file per module/page
├── styles/                # Global styles and Tailwind config
└── main.tsx
```

---

## Design

Original Figma design: [Inventory Management Page](https://www.figma.com/design/xb9TBqwg3t5AhRVglrughL/Inventory-Management-Page)
