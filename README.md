# Gada Electronics - Inventory Management System

A comprehensive, full-featured inventory management system designed specifically for electronics shops and retail businesses. Built with modern web technologies to provide a seamless, secure, and efficient inventory tracking experience.

## 🚀 Features

### Core Inventory Management
- **Product Management** — Complete CRUD operations for products with SKU, category, brand, pricing, quantity tracking, and supplier information
- **Category Management** — Organize products into customizable categories for better organization
- **Supplier Management** — Maintain detailed supplier profiles including contact information, GST details, and address
- **Stock Tracking** — Real-time inventory levels with automatic updates on sales and purchases
- **Stock Adjustments** — Manual stock in/out operations with full audit trail and reason tracking

### Purchase & Sales Operations
- **Purchase Orders** — Create, track, and manage purchase orders with multiple items
- **Order Status Tracking** — Track orders through pending, ordered, received, and cancelled states
- **Sales Recording** — Record sales with multiple products, payment methods, and automatic stock deduction
- **Payment Methods** — Support for cash, card, UPI, bank transfer, and other payment modes

### Alerts & Notifications
- **Low Stock Alerts** — Automatic notifications when stock drops below configured thresholds
- **Alert Management** — Mark alerts as read or resolved with one-click actions
- **Real-time Dashboard** — Unread alert count displayed prominently on dashboard

### Analytics & Reporting
- **Revenue Analytics** — Monthly revenue tracking with comparison to previous month
- **Sales Trends** — Daily sales breakdown with visual charts
- **Top Products** — Identify best-selling products by revenue and quantity
- **Category Breakdown** — View inventory distribution across categories
- **Stock Reports** — Total products, quantity, value, low stock, and out-of-stock counts
- **Recent Activity** — Quick view of recent sales and pending orders

### Security & Multi-User Support
- **User Authentication** — Secure sign-in/sign-up with Clerk
- **Data Isolation** — Each user can only access their own inventory data
- **Protected Routes** — All dashboard and API routes require authentication
- **Secure API** — All endpoints validate user identity before data access

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** Shadcn UI (Radix UI primitives)
- **Icons:** Lucide React
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts
- **Date Handling:** date-fns

### Backend
- **API:** Next.js API Routes
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** Clerk
- **Validation:** Zod schemas

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Styling:** PostCSS with Tailwind

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Clerk account (free tier works)

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd Gada-Electronics
npm install
```

### Step 2: Environment Configuration

Copy the example environment file:

```bash
cp .env .env.local
```

Add the following environment variables to `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gada-electronics
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Step 3: MongoDB Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env.local`

### Step 4: Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Enable email/password authentication
4. Copy your API keys to `.env.local`
5. Configure allowed redirect URLs (add `http://localhost:3000` for development)

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
gada-electronics/
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── products/     # Product CRUD operations
│   │   │   ├── categories/    # Category management
│   │   │   ├── suppliers/     # Supplier management
│   │   │   ├── stock/         # Stock adjustments
│   │   │   ├── purchase-orders/ # Purchase order operations
│   │   │   ├── sales/         # Sales recording
│   │   │   ├── alerts/        # Low stock alerts
│   │   │   ├── reports/       # Analytics & reporting
│   │   │   ├── dashboard/     # Dashboard stats
│   │   │   ├── seed/          # Sample data seeding
│   │   │   └── migrate-data/  # Data migration endpoint
│   │   ├── dashboard/        # Dashboard pages
│   │   │   ├── products/      # Products page
│   │   │   ├── categories/    # Categories page
│   │   │   ├── suppliers/     # Suppliers page
│   │   │   ├── sales/         # Sales page
│   │   │   ├── purchase-orders/ # Purchase orders page
│   │   │   ├── stock/         # Stock adjustments page
│   │   │   ├── alerts/        # Alerts page
│   │   │   └── reports/       # Reports page
│   │   ├── sign-in/[[...sign-in]]/ # Sign-in page
│   │   ├── sign-up/[[...sign-up]]/ # Sign-up page
│   │   ├── layout.jsx         # Root layout with ClerkProvider
│   │   ├── page.jsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   ├── layout/           # Layout components (sidebar, header)
│   │   └── dashboard/        # Dashboard-specific components
│   ├── lib/
│   │   ├── auth.js           # Authentication helpers
│   │   ├── mongodb.js        # Database connection
│   │   ├── api-utils.js      # API response utilities
│   │   ├── validations.js    # Zod validation schemas
│   │   ├── utils.js          # General utilities
│   │   ├── constants.js      # App constants
│   │   ├── inventory-service.js # Business logic for inventory
│   │   └── fetch-client.js   # HTTP client
│   ├── models/
│   │   ├── Product.js        # Product model
│   │   ├── Category.js       # Category model
│   │   ├── Supplier.js       # Supplier model
│   │   ├── Sale.js           # Sale model
│   │   ├── PurchaseOrder.js  # Purchase order model
│   │   ├── StockMovement.js  # Stock movement audit trail
│   │   ├── LowStockAlert.js  # Low stock alert model
│   │   └── index.js          # Model exports
│   └── middleware.js         # Clerk authentication middleware
├── .env                       # Environment variables template
├── .env.local                 # Your actual environment variables (gitignored)
├── .gitignore
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.mjs        # PostCSS configuration
└── package.json
```

## 🔑 API Endpoints

### Products
- `GET /api/products` — List all products (filtered by user)
- `POST /api/products` — Create new product
- `GET /api/products/[id]` — Get single product
- `PUT /api/products/[id]` — Update product
- `DELETE /api/products/[id]` — Deactivate product

### Categories
- `GET /api/categories` — List all categories
- `POST /api/categories` — Create category
- `GET /api/categories/[id]` — Get single category
- `PUT /api/categories/[id]` — Update category
- `DELETE /api/categories/[id]` — Delete category

### Suppliers
- `GET /api/suppliers` — List all suppliers
- `POST /api/suppliers` — Create supplier
- `GET /api/suppliers/[id]` — Get single supplier
- `PUT /api/suppliers/[id]` — Update supplier
- `DELETE /api/suppliers/[id]` — Delete supplier

### Sales
- `GET /api/sales` — List all sales
- `POST /api/sales` — Create sale (auto-updates stock)
- `GET /api/sales/[id]` — Get single sale

### Purchase Orders
- `GET /api/purchase-orders` — List all orders
- `POST /api/purchase-orders` — Create order
- `GET /api/purchase-orders/[id]` — Get single order
- `PUT /api/purchase-orders/[id]` — Update order status
- `DELETE /api/purchase-orders/[id]` — Cancel order

### Stock
- `GET /api/stock` — List stock movements
- `POST /api/stock` — Create stock adjustment

### Alerts
- `GET /api/alerts` — List low stock alerts
- `PATCH /api/alerts` — Mark alerts as read/resolved

### Reports
- `GET /api/reports` — Get comprehensive analytics

### Dashboard
- `GET /api/dashboard` — Get dashboard statistics

### Utility
- `POST /api/seed` — Seed sample data
- `POST /api/migrate-data` — Migrate existing data to current user

## 🔄 Data Migration

If you have existing data without user IDs (from before the authentication update), use the migration endpoint:

```bash
# While signed in, make a POST request to:
POST /api/migrate-data
```

This will assign all existing data to your current user account.

## 🎨 UI Features

- **Dark Mode Support** — Toggle between light and dark themes
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Modern UI** — Clean, professional interface with Shadcn UI components
- **Data Tables** — Sortable, searchable tables with pagination
- **Forms** — Validated forms with real-time error handling
- **Modals** — Dialog-based forms for better UX
- **Toasts** — Success/error notifications
- **Loading States** — Smooth loading indicators for better UX

## 🔒 Security Features

- **Authentication Required** — All dashboard pages and API routes require sign-in
- **User Data Isolation** — Each user's data is completely isolated from others
- **Protected API** — Server-side authentication validation on all endpoints
- **Environment Variables** — Sensitive keys stored in environment files
- **Clerk Middleware** — Route protection via Clerk middleware

## 📊 Database Schema

### Product
- userId, name, sku, category, brand, description
- purchasePrice, sellingPrice, quantity, supplier
- lowStockThreshold, isActive, timestamps

### Category
- userId, name, slug, description, isActive, timestamps

### Supplier
- userId, name, contactPerson, email, phone
- address, city, state, pincode, gstNumber, notes

### Sale
- userId, saleNumber, items[], subtotal, discount, tax, total
- paymentMethod, customerInfo, saleDate, timestamps

### PurchaseOrder
- userId, orderNumber, supplier, items[], subtotal, tax, total
- status, notes, orderDate, receivedDate, timestamps

### StockMovement
- userId, product, type, quantity, previousQuantity, newQuantity
- reason, reference, referenceId, performedBy, notes, createdAt

### LowStockAlert
- userId, product, productName, sku, currentQuantity
- threshold, isRead, isResolved, timestamps

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-production-clerk-key
CLERK_SECRET_KEY=your-production-clerk-secret
```

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

Gada Electronics - Inventory Management System

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Authentication by [Clerk](https://clerk.com)
- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
