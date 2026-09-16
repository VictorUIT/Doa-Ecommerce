# 🛍️ DoAshop E-commerce System

Hệ thống thương mại điện tử hiện đại **DoAshop**, được xây dựng theo mô hình Monorepo tích hợp đầy đủ hai phân hệ **Back-end** và **Front-end**. Hệ thống hỗ trợ quản lý sản phẩm, đơn hàng, giỏ hàng, xác thực người dùng và trải nghiệm mua sắm tối ưu.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

### **Back-end**
- **Runtime Environment:** Node.js
- **Framework:** Express.js (TypeScript)
- **Database & ORM:** PostgreSQL / SQLite & Prisma ORM
- **Authentication:** JWT (JSON Web Token), bcrypt
- **Validation & Tools:** Yup / Zod, TypeScript

### **Front-end**
- **Framework/Library:** React (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS / CSS Modules
- **State Management:** React Context API / Redux Toolkit
- **Linter & Formatter:** ESLint, Prettier

---

## 📁 Cấu trúc dự án (Monorepo Structure)

```text
DoAshop E-commerce System/
├── back-end/               # Node.js Express API Server
│   ├── prisma/             # Prisma Schema, Migrations & Seed data
│   ├── src/                # Business logic, Controllers, Routes, Services
│   ├── .env.example        # Sample environment configuration
│   ├── .gitignore
│   └── package.json
│
├── front-end/              # React + Vite Client Application
│   ├── public/             # Static Assets
│   ├── src/                # Components, Pages, Context, Hooks, Services
│   ├── index.html          # HTML Entry Point
│   ├── vite.config.ts      # Vite Configuration
│   ├── .gitignore
│   └── package.json
│
├── .gitignore              # Root Git Ignore Rules
└── README.md               # Project Documentation
