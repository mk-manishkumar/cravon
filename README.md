# Cravon - Food Ordering & Delivery Platform

Cravon is an enterprise-grade food ordering and delivery platform built on the MERN Stack. 
This project implements advanced backend architectural patterns including Role-Based Access Control (RBAC), secure JWT authentication with refresh tokens, and strict Mongoose relational models.

---

## 🚀 Progress & Features (Week 1)

### 1. Database Architecture & Design
- **ER Diagram:** We've designed a highly scalable Entity-Relationship (ER) model outlining the connections between Users, Roles, Permissions, Restaurants, Menus, Orders, and Payments.
  - You can view the full ER Diagram in [docs/er_diagram.md](./docs/er_diagram.md).
- **Pivot (Junction) Tables:** Explicit separation of `UserRoles` and `RolePermissions` collections to facilitate scalable, dynamic Role-Based Access Control (RBAC) typical in enterprise environments.

### 2. Backend Initialization
The backend server has been initialized using **Node.js, Express.js, and TypeScript**

- **Directory:** `/server`
- **Dependencies Installed:** `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`
- **Dev Dependencies:** `typescript`, `nodemon`, `ts-node` (configured for ESM)
- **Folder Structure:** Scalable MVC / Service-oriented architecture prepared in `server/src/`:
  - `config/` - Database and environment config
  - `controllers/` - Route logic handlers
  - `middlewares/` - Auth, RBAC, Error validation
  - `models/` - Mongoose schemas
  - `routes/` - Express routing
  - `services/` - Core business logic and database interactions
  - `utils/` - Helpers (e.g., JWT signing)

### 3. Project Configuration
- A unified `.gitignore` has been added at the root level covering all React/Node/TS standard environments.

---

## 🛠️ How to Run the Backend (Development)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the development server using Nodemon & TypeScript:
   ```bash
   npm run dev
   ```

The server will automatically reload when any files in the `server/src` directory are modified.


