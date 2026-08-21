# 🎉 Sisaket Shirt - ระบบจัดการจำหน่ายเสื้อศรีสะเกษ

> ระบบ E-Commerce สำหรับจัดการและจำหน่ายเสื้อที่ระลึก พร้อมระบบ Admin ที่ทันสมัย

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)](https://getbootstrap.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24-green)](https://next-auth.js.org/)

---

## 🔌 Backend API
เว็บไซต์นี้ทำงานร่วมกับ **sisaket-shirt-api** ซึ่งเป็น Backend ที่สร้างด้วย Node.js, Express, และ MongoDB
- ดูโค้ดของ API: [https://github.com/Cha-Khiao/sisaket-shirt-api.git](https://github.com/Cha-Khiao/sisaket-shirt-api.git)

---

## 📋 สารบัญ

- [🌟 ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)
- [🛠️ เทคโนโลยีที่ใช้](#️-เทคโนโลยีที่ใช้)
- [📂 โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [⚙️ การติดตั้ง](#️-การติดตั้ง)
- [🚀 การใช้งาน](#-การใช้งาน)
- [🔐 ระบบ Authentication](#-ระบบ-authentication)
- [📦 API Endpoints](#-api-endpoints)
- [🎨 UI/UX Features](#-uiux-features)
- [📱 Responsive Design](#-responsive-design)
- [🔧 Environment Variables](#-environment-variables)
- [📄 License](#-license)

## 🌟 ฟีเจอร์หลัก

### สำหรับลูกค้า (Customer Portal)
- ✅ **ระบบสมาชิก** - Login ด้วยเบอร์โทรศัพท์หรือ Google
- 👤 **จัดการโปรไฟล์** - แก้ไขชื่อ เบอร์โทร ที่อยู่ รูปโปรไฟล์ และลบบัญชีได้
- 🛍️ **เลือกซื้อสินค้า** - ระบบตะกร้าสินค้าที่ทันสมัย พร้อม Real-time Stock Indicator
- 📱 **ตรวจสอบคำสั่งซื้อ** - ติดตามสถานะพัสดุแบบ Real-time
- 💳 **แจ้งชำระเงิน** - อัปโหลดสลิปง่ายๆ ผ่าน UI ที่สวยงาม
- 📊 **Dashboard ส่วนตัว** - ดูประวัติการสั่งซื้อและสถิติ

### สำหรับผู้ดูแลระบบ (Admin Panel)
- 📦 **จัดการคำสั่งซื้อ** - ดู Filter และอัปเดตสถานะออร์เดอร์
- 👕 **จัดการสินค้า** - เพิ่ม แก้ไข ลบ และเปิด/ปิดการขาย
- 📊 **จัดการสต็อก** - อัปเดตสต็อกแบบ Real-time ทุกไซส์
- 🎨 **Admin UI สวยงาม** - Dashboard ที่ออกแบบมาเพื่อการใช้งานจริง

### ฟีเจอร์พิเศษ
- 🎯 **ระบบ Type สินค้า** - แยกเป็น Normal และ Mourning (ไว้ทุกข์)
- 📈 **สถิติยอดขาย** - Real-time Dashboard แสดงยอดจำหน่าย
- 🏆 **Best Seller Tracking** - แสดงสินค้าขายดีอันดับ 1
- 📏 **ตารางไซส์** - Size Chart ครบทุกไซส์ SSS ถึง 10XL
- 💾 **LocalStorage Cart** - ตะกร้าสินค้าไม่หายแม้ปิดเว็บ

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
```json
{
  "framework": "Next.js 16 (App Router + Turbopack)",
  "language": "TypeScript",
  "styling": "Bootstrap 5.3 + Custom CSS",
  "authentication": "NextAuth.js",
  "state-management": "React Context API",
  "icons": "React Icons",
  "fonts": "Sarabun (Google Fonts)"
}
```

### Key Libraries
- **next-auth** - ระบบ Authentication
- **react-bootstrap** - UI Components
- **bootstrap** - CSS Framework
- **react-icons** - Icon Library
- **next/image** - Image Optimization

## 📂 โครงสร้างโปรเจค

```
src/
├── app/                             # Next.js App Router
│   ├── admin/                       # Admin Portal
│   │   ├── layout.tsx               # Admin Layout (Sidebar, Auth Guard)
│   │   ├── login/page.tsx           # Admin Login
│   │   ├── orders/page.tsx          # จัดการคำสั่งซื้อ
│   │   ├── products/                # จัดการสินค้า
│   │   │   ├── page.tsx             # รายการสินค้า
│   │   │   ├── create/page.tsx      # เพิ่มสินค้า
│   │   │   └── edit/[id]/page.tsx   # แก้ไขสินค้า
│   │   └── stock/                   # จัดการสต็อก
│   │       ├── page.tsx             # รายการสต็อก
│   │       └── [id]/page.tsx        # แก้ไขสต็อกแต่ละรายการ
│   │
│   ├── api/auth/[...nextauth]/      # NextAuth Configuration
│   │   └── route.ts
│   │
│   ├── auth/login/                  # Customer Login
│   │   └── page.tsx
│   │
│   ├── cart/page.tsx                # ตะกร้าสินค้า (Real-time Stock)
│   ├── checkout/page.tsx            # ยืนยันคำสั่งซื้อ (Profile Pre-fill)
│   ├── dashboard/page.tsx           # Customer Dashboard
│   ├── profile/page.tsx             # จัดการโปรไฟล์ + ลบบัญชี
│   │
│   ├── orders/                      # ระบบออร์เดอร์
│   │   ├── details/[id]/page.tsx    # รายละเอียดออร์เดอร์
│   │   └── success/[id]/page.tsx    # หน้าสั่งซื้อสำเร็จ
│   │
│   ├── payment/notify/[id]/         # แจ้งชำระเงิน
│   │   └── page.tsx
│   │
│   ├── products/page.tsx            # หน้ารายการสินค้า
│   ├── page.tsx                     # หน้าแรก
│   ├── layout.tsx                   # Root Layout
│   └── globals.css                  # Global Styles
│
├── components/                      # Reusable Components
│   ├── AddressForm.tsx              # Thai Address Form (จังหวัด/อำเภอ/ตำบล)
│   ├── ClientLayout.tsx             # Layout Wrapper
│   ├── Navbar.tsx                   # Navigation Bar
│   ├── Footer.tsx                   # Footer
│   ├── HomeView.tsx                 # Home Page View
│   ├── ProductsView.tsx             # Products Page View
│   ├── BackToTop.tsx                # Back to Top Button
│   ├── BootstrapClient.tsx          # Bootstrap JS Loader
│   └── Providers.tsx                # Context Providers
│
├── context/                         # React Context
│   └── CartContext.tsx              # Shopping Cart Context
│
├── lib/                             # Utilities
│   └── api.ts                       # API Endpoints Configuration
│
├── types/                           # TypeScript Types
│   └── index.ts                     # Global Type Definitions
│
└── middleware.ts                    # Auth Middleware
```

## ⚙️ การติดตั้ง

### ข้อกำหนดเบื้องต้น
- Node.js 18+ 
- npm หรือ yarn
- Backend API (Node.js + MongoDB) ที่พร้อมใช้งาน

### ขั้นตอนการติดตั้ง

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/sisaket-shirt.git
cd sisaket-shirt
```

2. **ติดตั้ง Dependencies**
```bash
npm install
# หรือ
yarn install
```

3. **ตั้งค่า Environment Variables**
```bash
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local`:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. **รันโปรเจค**
```bash
npm run dev
# หรือ
yarn dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## 🚀 การใช้งาน

### สำหรับ Development
```bash
npm run dev          # รัน Development Server
npm run build        # Build สำหรับ Production
npm run start        # รัน Production Server
npm run lint         # ตรวจสอบ Code Quality
```

### การสร้าง Admin Account
สำหรับการใช้งาน Admin Panel ครั้งแรก:
1. สร้าง User ผ่าน Backend API
2. ตั้งค่า `role: "admin"` ใน Database
3. Login ที่ `/admin/login`

## 🔐 ระบบ Authentication

### Customer Login
- **เบอร์โทรศัพท์ + รหัสผ่าน** - ระบบจะสมัครให้อัตโนมัติ
- **Google OAuth** - Sign in ด้วย Google Account

### Admin Login
- **Username + Password** - Login แบบ Credentials
- **Role-based Access** - เฉพาะ User ที่มี role = "admin"

### Protected Routes
```typescript
// ฝั่งลูกค้า (ต้อง Login)
/dashboard/*
/orders/*
/checkout
/cart
/payment/*

// ฝั่ง Admin (ต้อง Login + role = admin)
/admin/orders/*
/admin/products/*
/admin/stock/*
```

## 📦 API Endpoints

```typescript
// สินค้า
GET    /api/products                 // ดึงรายการสินค้าทั้งหมด
POST   /api/products                 // เพิ่มสินค้าใหม่ (Admin)
PUT    /api/products/:id             // แก้ไขสินค้า (Admin)
DELETE /api/products/:id             // ลบสินค้า (Admin)
PATCH  /api/products/:id/stock       // อัปเดตสต็อก (Admin)

// คำสั่งซื้อ
GET    /api/orders                   // ดึงออร์เดอร์ทั้งหมด (Admin) / ตามเบอร์โทร (User)
POST   /api/orders                   // สร้างคำสั่งซื้อใหม่
GET    /api/orders/:id               // ดูรายละเอียดออร์เดอร์
PATCH  /api/orders/:id/status        // อัปเดตสถานะ (Admin)

// การชำระเงิน
POST   /api/payment/upload-slip      // อัปโหลดสลิปโอนเงิน

// Authentication
POST   /api/auth/login               // Login (Credentials)
```

## 🎨 UI/UX Features

### Design System
- **สีหลัก (Primary)**: `#4F46E5` (Indigo)
- **สีรอง (Secondary)**: `#64748b` (Slate)
- **สีสำเร็จ (Success)**: `#10b981` (Green)
- **สีเตือน (Warning)**: `#f59e0b` (Amber)

### Typography
- **Font Family**: Sarabun (Thai + Latin)
- **Weights**: 300, 400, 500, 600, 700

### Components Styling
```css
/* Gradient Buttons */
.btn-gradient-primary    /* ม่วงไล่โทน - หลัก */
.btn-gradient-warning    /* ส้มไล่โทน - แจ้งโอน */
.btn-gradient-secondary  /* เทาไล่โทน - ดูข้อมูล */

/* Status Colors */
.border-status-primary   /* สีม่วง - Primary */
.border-status-warning   /* สีส้ม - รอชำระ */
.border-status-info      /* สีฟ้า - ตรวจสอบ */
.border-status-success   /* สีเขียว - สำเร็จ */
.border-status-danger    /* สีแดง - ยกเลิก */

/* Animations */
.hover-lift              /* ยกขึ้นตอน Hover */
.hover-scale             /* ขยายตอน Hover */
.animate-bounce          /* กระดอนวนลูป */
.animate-slide-up        /* สไลด์ขึ้น */
```

## 📱 Responsive Design

### Breakpoints
```scss
xs: 0px      // Mobile
sm: 576px    // Small Mobile
md: 768px    // Tablet
lg: 992px    // Desktop
xl: 1200px   // Large Desktop
```

### Mobile-First Features
- 🔝 **Collapsible Navbar** - Offcanvas Menu บนมือถือ
- 📋 **Card View Tables** - ตารางแสดงเป็น Card บนมือถือ
- 🎨 **Touch-Friendly UI** - ปุ่มและ Input ขนาดใหญ่เหมาะกับการแตะ
- 🖼️ **Responsive Images** - Next.js Image Optimization

## 🔧 Environment Variables

### Required
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Optional (Google OAuth)
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### สร้าง NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## 🧪 Testing

```bash
# ตรวจสอบ TypeScript Errors
npm run type-check

# Lint Code
npm run lint

# Format Code (ถ้ามี Prettier)
npm run format
```

## 🚢 Deployment

### Vercel (แนะนำ)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Best Practices

### Code Style
- ใช้ TypeScript สำหรับ Type Safety
- Component แยก Logic ออกจาก Presentation
- ใช้ Server Components เมื่อเป็นไปได้
- Optimize Images ด้วย next/image

### Performance
- ใช้ Dynamic Import สำหรับ Heavy Components
- Implement Pagination สำหรับ List ที่ยาว
- Cache API Responses ด้วย `cache: 'no-store'` เมื่อจำเป็น

### Security
- ✅ Validate Input ทั้ง Client และ Server
- ✅ ใช้ HTTPS ใน Production
- ✅ Sanitize User Input
- ✅ Implement Rate Limiting

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 📞 Contact & Support

- **เบอร์โทร**: 
- **Facebook**: []
- **LINE OA**: []
- **Email**: 

---

<div align="center">
  <p>Made with ❤️ by ComSci SSKRU</p>
  <p>🎉 ร่วมเฉลิมฉลอง 243 ปี เมืองศรีสะเกษ</p>
</div>