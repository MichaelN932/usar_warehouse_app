# Warehouse PWA - Frontend Build Package

## For: LA County Fire Department Software Developers

This package contains a complete frontend specification and mock data for a warehouse inventory and PPE management system. Build the frontend with React/TypeScript, then connect to your backend of choice.

---

## Files Included

| File | Purpose |
|------|---------|
| **SPEC.md** | Complete technical specification (screens, flows, business rules) |
| **src/types/index.ts** | TypeScript interfaces — the data contract |
| **src/data/mockData.ts** | Real inventory data as mock data (from Ripley Room + FEMA Cache List) |
| **schema.sql** | SQL schema (reference for backend team) |
| **seed_data_enhanced.sql** | SQL seed data (reference for backend team) |

---

## Data Included

**From FEMA Approved Equipment Cache List (2025):**
- 7 Categories (Sanitation, Safety, Personal Gear, HazMat PPE, Water Rescue, Medical, Publications)
- 189 Item Types with FEMA codes and recommended quantities

**From Ripley Room Inventory:**
- 61 Variants (5.11, Tru-Spec, Shelby, Team Wendy, etc.)
- 236 Sizes/SKUs
- Current stock quantities

---

## How to Use with Claude Code

### Step 1: Create Project

```bash
mkdir warehouse-pwa
cd warehouse-pwa
```

### Step 2: Copy Files

Place all files in your project folder, maintaining the `src/` structure.

### Step 3: Start Claude Code

```bash
claude
```

### Step 4: Initial Prompt

```
I'm building a warehouse inventory and PPE management system for a fire department USAR Task Force.

Read these files:
- SPEC.md - Complete technical specification
- src/types/index.ts - TypeScript interfaces
- src/data/mockData.ts - Real inventory data as mock data

This is a frontend-only build. The backend will be implemented later by department developers.

Let's start: Initialize a React + TypeScript + Vite project with Tailwind CSS. Use the existing types and mock data. Build the project structure as defined in the spec.
```

---

## Architecture

```
Frontend (You Build)          Backend (Devs Implement Later)
─────────────────────         ───────────────────────────────
React + TypeScript     →      API Layer (Express, Azure Functions, etc.)
    ↓                              ↓
Service Layer          →      Database (SQL Server, Firebase, etc.)
(api.ts - mock now)
    ↓
Mock Data
(mockData.ts)
```

The service layer (`api.ts`) will contain all backend calls. For now, it reads from `mockData.ts`. When the backend is ready, devs replace the mock calls with real API calls — **no UI changes needed**.

---

## TypeScript Interfaces (Data Contract)

The `src/types/index.ts` file defines all data shapes:

```typescript
// Users
User, UserRole, UserSizes

// Catalog
Category, ItemType, Variant, Size

// Inventory
InventoryItem, CatalogItem (denormalized view)

// Requests
Request, RequestLine, RequestStatus

// Purchase Orders
PurchaseOrder, POLine, POStatus, Vendor

// Supporting
Notification, AuditLogEntry, InventoryAdjustment
```

Backend developers implement APIs that return data matching these interfaces.

---

## Key Business Rules (from SPEC.md)

1. **Consumables** can be requested anytime
2. **Durables** require a reason if user already has one issued
3. **FEMARequiredQty** = recommendation only (not enforced)
4. **ParLevel** = actual reorder point (set by warehouse admin)
5. **Backorders** stay in queue until stock is available

---

## Screens to Build

**Team Member:**
- Dashboard, Request Items, My Requests, My Inventory, Profile, Pickup Signature

**Warehouse Staff (+ all Team Member screens):**
- Fulfillment Queue, Inventory Management, Receive Orders, Create Request for User

**Admin (+ all Warehouse Staff screens):**
- User Management, Item Catalog, Vendor Management, Purchase Orders, Reports, Audit Log

---

## What Backend Devs Need to Implement

1. **Authentication** — integrate with department identity system
2. **API endpoints** — see SPEC.md for full list
3. **Database** — use schema.sql as reference or adapt for your stack
4. **Email notifications** — integrate with department email
5. **Push notifications** — service worker already in frontend spec

---

## Questions?

Contact: [Your contact info]

This frontend can connect to any backend that implements the TypeScript interfaces.
