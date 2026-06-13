# Gada Electronics - Inventory Management App

A full-featured inventory management system built for electronics shops.

## Tech Stack

- **Frontend:** Next.js 15, React 19, JavaScript (JSX), Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** Clerk

## Features

- **Product Management** — Name, SKU, category, brand, description, pricing, quantity, supplier
- **Auto Inventory Updates** — Purchases and sales automatically adjust stock levels
- **Stock In / Stock Out** — Manual stock adjustments with full audit trail
- **Low Stock Alerts** — Notifications when stock drops below threshold
- **Category Management** — Organize products by category
- **Supplier Management** — Track supplier contacts and details
- **Purchase Orders** — Create, track, and receive purchase orders
- **Sales Records** — Record sales with multiple payment methods
- **Reports & Analytics** — Revenue charts, top products, category breakdown

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env` to `.env.local` and fill in your credentials:

```bash
cp .env .env.local
```

Required variables:
- `MONGODB_URI` — MongoDB connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key

### 3. Set up Clerk

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy API keys to `.env.local`

### 4. Set up MongoDB

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get your connection string
3. Add it to `.env.local`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Seed sample data

After signing in, click **"Seed Sample Data"** on the dashboard to populate categories, suppliers, and sample products.

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── products/
│   │   ├── categories/
│   │   ├── suppliers/
│   │   ├── stock/
│   │   ├── purchase-orders/
│   │   ├── sales/
│   │   ├── alerts/
│   │   ├── reports/
│   │   └── dashboard/
│   ├── dashboard/        # Dashboard pages
│   ├── sign-in/
│   └── sign-up/
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Sidebar, header
│   └── dashboard/        # Dashboard widgets
├── lib/                  # Utilities, validations, services (.js)
└── models/               # MongoDB/Mongoose models (.js)
```

## License

MIT
