# ♻️ Scrap Anna — Web Frontend

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Next.js%20%7C%20Vite-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange)](#)
[![Backend](https://img.shields.io/badge/Backend-Django%20REST%20Framework-092E20?logo=django)](https://www.djangoproject.com/)

The **Web Frontend** for **Scrap Anna** — an intelligent digital scrap recycling, marketplace, and doorstep collection ecosystem. This portal provides a seamless web interface for **households (Users)**, **commercial entities (Companies)**, and **scrap dealers (Merchants)** to manage doorstep pickups, view daily live scrap market rates, participate in bulk scrap auctions/bidding, and handle digital billing and payouts.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key User Portals & Features](#-key-user-portals--features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Development Server](#running-the-development-server)
  - [Build and Deployment](#build-and-deployment)
- [Backend & WebSocket Integration](#-backend--websocket-integration)
- [State Management & Routing](#-state-management--routing)
- [Coding Standards & Conventions](#-coding-standards--conventions)
- [Git Workflow](#-git-workflow)
- [License](#-license)

---

## 🌟 Overview

**Scrap Anna** connects the unorganized scrap collection industry into an automated, transparent, and high-efficiency digital marketplace. The **Web Frontend** serves as the central desktop and mobile-responsive hub for:

1. **Transparent Scrap Rates**: Daily updated price ranges per kg/unit across metals, e-waste, plastics, paper, and appliances.
2. **Doorstep Pickup Scheduling**: Quick pickup requests with location mapping, category selection, and automated merchant dispatch within a defined radius.
3. **Commercial & Bulk Scrap Management**: Dedicated workflows for companies, warehouses, and factories to schedule bulk scrap offloading and certificate compliance.
4. **Live Bidding & Auctions**: Real-time bidding engine powered by WebSockets for high-value industrial and commercial scrap lots.
5. **Digital Bills & Instant Settlements**: Transparent weigh-ins, auto-calculated commission splits, digital invoice copies, and payout tracking.

---

## 👥 Key User Portals & Features

### 1. 🏠 Household / Individual Portal (`USER`)
- **Quick Pickup Booking**: Interactive category selector (Newspaper, Cardboard, Plastic, Iron, Copper, Brass, E-waste, Appliances) with doorstep address selection and time slots.
- **Live Rate Card**: Searchable and filterable daily scrap market rate index.
- **Real-Time Request Tracker**: Track pickup progress: `PENDING` ➔ `BROADCASTED` ➔ `ACCEPTED` ➔ `COLLECTED` ➔ `CLOSED`.
- **Digital Receipt & Passbook**: View generated digital bills, weights, total payout received, and history.

### 2. 🏢 Commercial / Enterprise Portal (`COMPANY`)
- **Bulk Scrap Dispatch**: Request large-volume pickups with custom weight estimates, storage requirements, and vehicle size requests.
- **Reverse Auction / Bidding Engine**: Put high-volume scrap up for live bidding among verified tier merchants.
- **Compliance & GST Invoices**: Download GST-compliant tax invoices, green recycling certificates, and audit reports.

### 3. 🏪 Merchant / Scrap Collector Hub (`MERCHANT`)
- **Lead Radar**: Real-time feed of broadcasted pickup leads within merchant's operating radius (km).
- **Lead Acceptance & Scheduling**: One-click lead claiming with collection deadlines and customer navigation.
- **Digital Weigh-in & Bill Generator**: Input verified weights, apply system rate cards, calculate tiered commissions, and generate dual-copy receipts (Customer Copy & Merchant Copy).
- **Earnings & Settlement Dashboard**: Track daily earnings, payout cycles, commission deductions, and merchant tier progression (Small / Medium / Big).

### 4. 🔨 Live Bidding Arena
- **Real-time Auction Stream**: Live WebSocket price tick updates, countdown timers, and bid history logs.
- **Instant Outbid Notifications**: Audio-visual cues when a merchant or buyer is outbid.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React 18+ / Next.js / Vite | Modern, high-performance UI library & bundler |
| **Language** | TypeScript | Strong type safety, interfaces, and maintainability |
| **Styling** | Modern CSS / TailwindCSS | Responsive design system, dark mode, micro-animations |
| **UI Components** | Lucide React / Headless UI | Accessible, clean, modern component primitives |
| **State Management** | Zustand / TanStack Query | Client state and server caching/synchronization |
| **Routing** | React Router DOM / Next.js Routing | Role-protected routes & navigation guards |
| **Real-time Engine** | WebSocket / Django Channels Client | Live bidding updates, lead broadcast notifications |
| **Maps & Geo** | Leaflet / Mapbox GL / Google Maps | Location picking, radius visualization, navigation |
| **Forms & Validation**| React Hook Form + Zod | Schema-based form validation and error handling |
| **HTTP Client** | Axios | Interceptors for JWT auth token refresh and API calls |

---

## 📂 Project Directory Structure

```text
web_frontend/
├── public/                     # Static assets, favicons, logos, manifests
│   ├── icons/
│   └── images/
├── src/
│   ├── assets/                 # SVGs, brand illustrations, custom styling
│   ├── components/             # Reusable UI building blocks
│   │   ├── common/             # Button, Modal, Card, Badge, Spinner, Table
│   │   ├── forms/              # Input, Select, Checkbox, FileUploader, DatePicker
│   │   ├── layout/             # Header, Sidebar, Footer, Breadcrumbs
│   │   └── feedback/           # Toast, Alert, SkeletonLoaders
│   ├── context/                # React contexts (ThemeContext, SocketContext)
│   ├── features/               # Domain-driven feature modules
│   │   ├── auth/               # Login, OTP verification, Registration, KYC Upload
│   │   ├── catalog/            # Daily price lists, Category browser, Search
│   │   ├── pickups/            # Booking wizard, Active pickups list, Live tracker
│   │   ├── bidding/            # Live auction room, Bidding card, History table
│   │   ├── merchant/           # Leads board, Radius filter, Bill generation form
│   │   ├── company/            # Bulk dispatch request, Compliance reports
│   │   ├── payments/           # Invoices, Receipts, Payout methods, Wallet
│   │   └── complaints/         # Dispute submission, Support tickets
│   ├── hooks/                  # Custom hooks (useAuth, useSocket, useGeoLocation)
│   ├── layouts/                # AppLayout, AuthLayout, DashboardLayout, AdminLayout
│   ├── routes/                 # AppRoutes.tsx, ProtectedRoute.tsx, role guards
│   ├── services/               # API clients, endpoints, interceptors
│   │   ├── api.ts              # Axios instance with JWT interceptors
│   │   ├── authService.ts      # Auth & profile requests
│   │   ├── pickupService.ts    # Pickups CRUD & status transitions
│   │   ├── catalogService.ts   # Categories & daily pricing
│   │   ├── biddingService.ts   # Auction & bid APIs
│   │   └── socketService.ts    # WebSocket client manager
│   ├── store/                  # Global state management (Zustand stores)
│   │   ├── useAuthStore.ts     # User session, tokens, role
│   │   ├── usePickupStore.ts   # Active pickup state & filters
│   │   └── useBiddingStore.ts  # Live bids & auction state
│   ├── types/                  # TypeScript definitions (models, APIs, payloads)
│   │   ├── account.ts
│   │   ├── pickup.ts
│   │   ├── catalog.ts
│   │   └── bidding.ts
│   ├── utils/                  # Helper utilities (formatters, validators, constants)
│   │   ├── currency.ts         # ₹ INR formatting
│   │   ├── date.ts             # Date and relative time formatting
│   │   ├── weight.ts           # kg, quintal, metric ton unit converters
│   │   └── validators.ts       # Phone number, OTP, and input regexes
│   ├── App.tsx                 # Root application component
│   ├── main.tsx                # Application entrypoint
│   └── index.css               # Global styles, variables, typography
├── .env.example                # Sample environment configuration
├── index.html                  # HTML entry template
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite build and dev server config
└── README.md                   # Web Frontend documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or `v20.x` LTS recommended
- **Package Manager**: `npm` (v9+), `pnpm`, or `yarn`
- **Backend API**: Running Django REST backend (`http://localhost:8000`)

### Installation

1. Navigate to the `web_frontend` directory:
   ```bash
   cd web_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `web_frontend` root based on `.env.example`:

```bash
cp .env.example .env
```

Configure the environment variables:

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:8000/api/v1

# WebSocket Base URL for Real-Time Bidding & Lead Broadcasts
VITE_WS_BASE_URL=ws://localhost:8000/ws

# Application Metadata
VITE_APP_NAME="Scrap Anna"
VITE_APP_ENV=development

# Map & Geolocation API (Mapbox / Google Maps / OpenStreetMap)
VITE_MAP_TILES_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### Running the Development Server

Start the local development server with hot-module reloading:

```bash
npm run dev
```

The application will be accessible at: `http://localhost:5173` (or the port specified by your bundler).

### Build and Deployment

To produce an optimized production bundle:

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔌 Backend & WebSocket Integration

The web frontend communicates with the Django REST Framework backend via RESTful endpoints and Django Channels WebSockets:

### Key REST Endpoints

| Resource | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | `POST /api/v1/accounts/auth/login/` | Phone/OTP login and JWT token issue |
| **Profile** | `GET /api/v1/accounts/profiles/me/` | Current user/merchant/company profile |
| **Catalog** | `GET /api/v1/catalog/categories/` | List all scrap categories & subcategories |
| **Rates** | `GET /api/v1/catalog/prices/daily/` | Current daily price ranges per scrap category |
| **Pickups** | `POST /api/v1/pickups/requests/` | Create a new doorstep pickup request |
| **Leads** | `GET /api/v1/pickups/leads/available/` | Available leads for merchants in radius |
| **Bills** | `POST /api/v1/pickups/bills/generate/` | Generate verified digital bill & commission split |
| **Bidding** | `GET /api/v1/bidding/auctions/active/` | Active live scrap auctions |

### WebSocket Channels

- **Live Bidding Stream**: `ws://<backend>/ws/bidding/<auction_id>/?token=<jwt_token>`
  - Receives live bid updates, highest current bid, and countdown tick.
  - Sends placed bids with automatic client-side latency compensation.
- **Merchant Lead Radar**: `ws://<backend>/ws/merchant/leads/?token=<jwt_token>`
  - Receives real-time push events when a new pickup is broadcasted within merchant radius.

---

## 🛡️ State Management & Routing

### Role-Based Access Control (RBAC)

The frontend routes are protected by role-based route guards:

- **Public Routes**: `/`, `/rates`, `/about`, `/contact`, `/login`, `/register`
- **User Protected (`Role.USER`)**: `/dashboard`, `/book-pickup`, `/my-pickups`, `/receipts`
- **Company Protected (`Role.COMPANY`)**: `/company/dashboard`, `/bulk-dispatch`, `/auctions/create`, `/invoices`
- **Merchant Protected (`Role.MERCHANT`)**: `/merchant/leads`, `/merchant/active-pickups`, `/merchant/billing`, `/merchant/wallet`
- **Admin Protected (`Role.ADMIN`)**: `/admin/pricing-override`, `/admin/kyc-approval`, `/admin/disputes`

---

## 📐 Coding Standards & Conventions

1. **Component Design**: Functional components with TypeScript interfaces for all `props`.
2. **File Naming**:
   - Components: `PascalCase.tsx` (e.g., `PickupCard.tsx`)
   - Hooks: `camelCase.ts` starting with `use` (e.g., `useLeadTracker.ts`)
   - Utilities & Services: `camelCase.ts` (e.g., `formatCurrency.ts`, `apiService.ts`)
3. **Type Safety**: Strictly avoid `any`. Define shared interfaces under `src/types/`.
4. **State Isolation**: Use local state (`useState`, `useReducer`) for UI-only transient states, and Zustand / React Query for shared server data.

---

## 🌿 Git Workflow

- **Branch Naming**:
  - `web-frontend`: Primary branch for frontend development.
  - `feature/feature-name`: New features (e.g., `feature/live-bidding-ui`).
  - `fix/bug-name`: Bug fixes and patches.
- **Commit Messages**: Follow conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `style:`).

---

## 📄 License

This project is part of the **Scrap Anna** application suite. All rights reserved.
