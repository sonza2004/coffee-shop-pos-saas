# Coffee Shop POS SaaS — System Architecture Spec

## 1. High-Level Architecture

```
Monorepo
├── server (Express + Prisma API)
├── client (Customer storefront)
├── admin (Admin dashboard)
└── _council (architecture + QA + specs)
```

### System Overview
- Multi-tenant SaaS POS system for coffee shops
- Roles: admin, staff, customer
- Core flow: Product → Order → Payment Slip → Approval → Stock Deduction → Reporting

---

## 2. Folder Structure (Monorepo)

### /server
```
server/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── modules/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── inventory/
│   │   └── finance/
│   └── app.ts
├── prisma/
│   └── schema.prisma
└── uploads/
```

### /client (Customer)
```
client/
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── store/
```

### /admin (Backoffice)
```
admin/
├── src/
│   ├── pages/
│   ├── components/
│   ├── modules/
│   └── services/
```

---

## 3. Backend Architecture

### Stack
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Core Principles
- Modular domain-driven structure (modules per business domain)
- Stateless API design
- RBAC middleware enforced at route level

---

## 4. Core Data Models (Prisma Draft)

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   // admin | staff | customer
  createdAt    DateTime @default(now())
}

model Product {
  id        String   @id @default(cuid())
  name      String
  price     Float
  stockQty  Int
  imageUrl  String?
  isActive  Boolean  @default(true)
}

model Order {
  id          String   @id @default(cuid())
  userId      String
  totalAmount Float
  status      String   // pending | payment_uploaded | approved | rejected | completed
  createdAt   DateTime @default(now())
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  productId String
  qty       Int
  price     Float
}

model PaymentSlip {
  id         String   @id @default(cuid())
  orderId    String
  imageUrl   String
  status     String   // pending | approved | rejected
  uploadedAt DateTime @default(now())
  reviewedAt DateTime?
}

model InventoryLog {
  id         String   @id @default(cuid())
  productId  String
  changeQty  Int
  type       String   // sale | restock | adjustment
  createdAt  DateTime @default(now())
}
```

---

## 5. API Contracts

### Auth
- POST /auth/register
- POST /auth/login

### Products
- GET /products
- POST /products (admin)
- PUT /products/:id (admin)

### Orders
- POST /orders
- GET /orders/me
- GET /orders/:id

### Payments
- POST /payments/slip
- GET /payments (admin)
- PATCH /payments/:id/approve
- PATCH /payments/:id/reject

### Inventory
- GET /inventory
- POST /inventory/adjust

### Finance
- GET /finance/daily-report
- GET /finance/monthly-summary

---

## 6. File Upload Strategy

- Default: local `/uploads`
- Production: S3-compatible storage
- Store only URL in DB (`imageUrl`)

---

## 7. Security Model

### RBAC Middleware
- admin: full access
- staff: orders + inventory limited
- customer: own orders only

### Rules
- Order ownership verified before slip upload
- Admin approval required before stock deduction

---

## 8. Business Rules

- Orders start as `pending`
- Payment slip → `payment_uploaded`
- Admin approval → `approved`
- Stock deducted ONLY after approval
- Rejected orders do not affect inventory

---

## 9. Integration Flow

```
Customer Order → Order Created (pending)
        ↓
Upload Payment Slip
        ↓
Admin Review
   ├── Approve → Deduct Stock + Complete Order
   └── Reject → Return to pending/rejected state
```

---

## 10. Next Ownership Map

- Backend: implement modules + Prisma schema
- Frontend (client): ordering + payment upload UI
- Admin: product, order approval, inventory dashboard

---

## Status
This spec is the single source of truth for system implementation.
