# Cravon


**Live Application:** [https://cravonn.vercel.app/](https://cravonn.vercel.app/)

Cravon is a highly scalable, enterprise-grade food ordering and delivery platform built on the **MERN Stack + Next.js 16**. It is designed to handle multiple distinct user types (Customers, Restaurant Owners, Staff, and Super Admins) within a single ecosystem, utilizing strict Role-Based Access Control (RBAC).

---

## 🚀 Key Features & Architecture

### 1. Three Distinct Portals
- **Customer Portal:** A highly responsive public storefront featuring a dynamic city selector (`?city=` URL state mapping), location-based filtering, and real-time restaurant browsing.
- **Partner (Restaurant) Portal:** A secure dashboard for restaurant owners and staff. Includes tools for menu management, category management, pricing, and a secure Staff Invitation system via tokenized email links.
- **SuperAdmin Portal:** A high-level administrative view for verifying and managing restaurant partnerships.

### 2. Advanced Security & Authentication
- **Secure Dual-Token Auth:** Access and Refresh JWTs are distributed via `HttpOnly`, `Secure`, and `SameSite=none` cookies, ensuring secure cross-domain authentication between the Vercel-hosted frontend and backend.
- **Axios Interceptors:** Global frontend interceptors automatically catch `401 Unauthorized` errors, clear local states, and smartly redirect users based on their portal type.
- **Role-Based Access Control (RBAC):** Backend permissions are strictly enforced through a junction-table database architecture (`UserRoles` & `RolePermissions`), preventing lateral privilege escalation.
- **Email Verification & OTP:** Powered by **Resend API**, ensuring businesses confirm their identities via 6-digit OTP codes before gaining dashboard access.

### 3. Modern Tech Stack
#### **Frontend (`/client`)**
- **Framework:** Next.js 15 (App Router, Turbopack enabled)
- **UI & Styling:** Tailwind CSS v4, Lucide React (Icons), React Hot Toast
- **State Management:** Zustand (Global Auth State), `@tanstack/react-query` (Data Fetching, Caching, and Synchronization)
- **Components:** Built with Server Components and Client Components seamlessly integrated, utilizing `<Suspense>` boundaries for dynamic rendering.

#### **Backend (`/server`)**
- **Framework:** Node.js, Express.js (ESM Modules), TypeScript
- **Database:** MongoDB & Mongoose (Strict schemas with refs for normalization)
- **Validation:** Zod (Type-safe runtime schema validation)
- **Security:** `bcryptjs` for password hashing, rate limiting, and CORS configuration customized for Vercel deployment.

---

## 🌐 Deployment
The entire platform is built for modern serverless infrastructure and is deployed on **Vercel**.

- **Frontend Deployment:** Standard Next.js Vercel deployment.
- **Backend Deployment:** The Express application is wrapped and exported as a serverless function (`export default app;`) utilizing a custom `vercel.json` rewrite configuration, allowing the Node backend to scale infinitely on Vercel's edge network.
- **Live URL:** [https://cravonn.vercel.app/](https://cravonn.vercel.app/)

---

## 🗄️ Database & Seeding
The project features a highly robust data initialization system. 
- **Mock Data Engine:** Custom Node.js scripts procedurally generate **96 authentic mock Indian restaurants** mapped perfectly across **12 major cities** (e.g., Delhi, Bangalore, Mumbai, Pune). 
- **Media Validation:** The seeding script validates and attaches high-quality, diverse restaurant and food imagery sourced from Unsplash directly into the MongoDB documents.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Resend API Key (for emails)

### 1. Backend Setup
```bash
cd server
npm install

# Create a .env file based on the environment variables required:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/cravon
# JWT_ACCESS_SECRET=your_secret
# RESEND_API_KEY=your_resend_key
# CLIENT_URL=http://localhost:3000

npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install

# Create a .env.local file:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

npm run dev
```

### 3. Initialize Data (Seeding)
To test the application locally, you should populate the database with the SuperAdmin account and the 96 mock restaurants:
```bash
cd server
npx tsx src/scripts/seedSuperadmin.ts
npx tsx src/scripts/seedRestaurants.ts
```
