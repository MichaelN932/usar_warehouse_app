# USAR Warehouse Management Application - Technical Specification

## Overview

This is a Progressive Web Application (PWA) for the LA County Fire Department USAR (Urban Search and Rescue) Task Force warehouse management system. The application manages Personal Protective Equipment (PPE) inventory, gear requests, purchase orders, and team member equipment assignments.

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3 with custom design tokens
- **Routing**: React Router v6
- **Icons**: Google Material Symbols (Outlined variant)
- **State Management**: React Context API (AuthContext)
- **API Layer**: Mock service layer (designed to be replaced with real API)

## Design System

### Color Tokens

The application uses semantic color naming:

```
Primary Colors (Grays):
- primary-50 to primary-900: Gray scale for text, backgrounds, borders

Action Colors:
- action-primary: Main interactive color (buttons, links)
- action-hover: Hover state
- action-pressed: Active/pressed state

Status Colors:
- green: Success, active, available
- yellow: Warning, pending
- orange: Backordered, partial
- red: Error, low stock, inactive
- blue: Info, approved
- purple: Admin roles

Grant Source Colors:
- grant-fema: FEMA grant styling
- grant-state: State grant styling
- grant-prm: PRM grant styling
```

### Typography

```
text-heading-lg: Large headings (page titles)
text-heading-md: Medium headings (section titles)
Standard Tailwind text utilities for body text
```

### Component Library

Located in `src/components/ui/`:

1. **Card** - Container component with optional title, subtitle, actions, onClick
2. **StatCard** - Statistics display with icon, value, subtitle, color variants
3. **Modal** - Dialog overlay with header, body, footer slots, size variants (sm, md, lg)
4. **StatusBadge** - Status indicator with color-coded styling
5. **EmptyState** - Placeholder for empty lists with icon, title, description, action
6. **Icon** - Google Material Symbols wrapper with size variants (sm, md, lg, xl) and filled option
7. **SearchInput** - Styled search input with icon

## User Roles & Permissions

### TeamMember
- View personal dashboard
- Request items from catalog
- View own requests and their status
- View issued inventory (My Inventory)
- Return items
- Update profile and sizes

### WarehouseStaff (includes TeamMember permissions)
- Access Fulfillment Queue
- Process requests (approve, reject, mark ready)
- Manage inventory adjustments
- Receive purchase orders

### WarehouseAdmin (includes all permissions)
- User management (Team Directory)
- Catalog management (categories, item types, variants)
- Vendor management
- Purchase order creation and management
- Reports and analytics
- Grant source management

## Application Routes

### Public Routes
- `/login` - Authentication page

### Team Member Routes
- `/` or `/dashboard` - Personal dashboard with stats and quick actions
- `/request` - Browse catalog and create item requests
- `/my-requests` - View request history and status
- `/my-inventory` - View issued items, initiate returns
- `/profile` - Update personal info and size preferences

### Warehouse Staff Routes
- `/fulfillment` - Request processing queue
- `/inventory` - Inventory management with adjustments
- `/receive` - Receive incoming purchase orders

### Admin Routes
- `/users` or `/employees` - Team directory with PPE assignments
- `/employees/:id` - Individual employee detail view
- `/catalog` - Item type and category management
- `/vendors` - Vendor management
- `/purchase-orders` - PO management
- `/procurement/quotes/:id` - Quote request details
- `/reports` - Analytics and reporting dashboard

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'TeamMember' | 'WarehouseStaff' | 'WarehouseAdmin';
  isActive: boolean;
  employeeId?: string;
  department?: string;
  position?: string;
  phone?: string;
  sizes?: UserSizes;
  createdAt: string;
}

interface UserSizes {
  shirt?: string;
  pantsWaist?: string;
  pantsInseam?: string;
  bootSize?: string;
  gloveSize?: string;
  hatSize?: string;
}
```

### Catalog Structure
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

interface ItemType {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  femaCode: string;
  femaRequiredQty: number;
  parLevel: number;
  isConsumable: boolean;
  isActive: boolean;
}

interface Variant {
  id: string;
  itemTypeId: string;
  name: string;
  manufacturer: string;
  sku?: string;
  unitCost?: number;
}

interface Size {
  id: string;
  variantId: string;
  name: string;
}

interface CatalogItem {
  sizeId: string;
  itemTypeId: string;
  itemTypeName: string;
  variantId: string;
  variantName: string;
  manufacturer: string;
  sizeName: string;
  categoryId: string;
  categoryName: string;
  femaCode: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
}
```

### Request System
```typescript
type RequestStatus = 'Pending' | 'Approved' | 'ReadyForPickup' | 'Fulfilled' | 'Backordered' | 'Cancelled';

interface Request {
  id: string;
  requestedBy: string;
  requestedByName: string;
  status: RequestStatus;
  requestDate: string;
  notes?: string;
  lines: RequestLine[];
  fulfilledAt?: string;
  pickupSignedAt?: string;
}

interface RequestLine {
  id: string;
  requestId: string;
  itemTypeId: string;
  itemTypeName: string;
  requestedSizeId?: string;
  requestedSizeName?: string;
  preferredVariantId?: string;
  preferredVariantName?: string;
  quantity: number;
  replacementReason?: string;
  issuedQuantity: number;
  isBackordered: boolean;
}

const REPLACEMENT_REASONS = [
  'Worn/Damaged',
  'Size Change',
  'Lost/Stolen',
  'Upgrade',
  'Other'
];
```

### Issued Items
```typescript
interface IssuedItem {
  id: string;
  userId: string;
  sizeId: string;
  itemTypeName: string;
  variantName: string;
  sizeName: string;
  categoryName: string;
  quantity: number;
  issuedAt: string;
  requestId?: string;
}

type ReturnCondition = 'Serviceable' | 'NeedsRepair' | 'Unserviceable';
const RETURN_CONDITIONS: ReturnCondition[] = ['Serviceable', 'NeedsRepair', 'Unserviceable'];
```

### Purchase Orders
```typescript
type POStatus = 'Draft' | 'Submitted' | 'PartialReceived' | 'Received' | 'Cancelled';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  status: POStatus;
  orderDate?: string;
  expectedDeliveryDate?: string;
  totalAmount: number;
  lines: POLine[];
  notes?: string;
  createdAt: string;
  grantSourceId?: string;
  grantSource?: GrantSource;
  quoteRequestId?: string;
  quoteRequest?: QuoteRequest;
  trackingNumber?: string;
  shippingCarrier?: string;
}

interface POLine {
  id: string;
  purchaseOrderId: string;
  sizeId: string;
  itemDescription: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  lineTotal: number;
}

interface GrantSource {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}
```

### Vendors
```typescript
interface Vendor {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  isActive: boolean;
}
```

### Inventory Adjustments
```typescript
type AdjustmentType = 'Count' | 'Damage' | 'Loss' | 'Found' | 'Transfer';

interface InventoryAdjustment {
  sizeId: string;
  type: AdjustmentType;
  quantityChange: number;
  reason: string;
  adjustedBy: string;
  adjustedAt: string;
}
```

### Notifications
```typescript
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'RequestUpdate' | 'ReadyForPickup' | 'SystemUpdate';
  isRead: boolean;
  createdAt: string;
}
```

## API Service Layer

Located in `src/services/api.ts`. Currently uses mock data but designed for easy replacement with real API calls.

### API Modules

```typescript
// Authentication
authApi.login(email: string, password: string): Promise<User>
authApi.logout(): Promise<void>
authApi.getCurrentUser(): Promise<User | null>

// Users
usersApi.getAll(): Promise<User[]>
usersApi.getAllWithPPE(): Promise<UserWithPPE[]>
usersApi.getById(id: string): Promise<User>
usersApi.update(id: string, data: Partial<User>): Promise<User>
usersApi.getDepartments(): Promise<string[]>

// Catalog
catalogApi.getCategories(): Promise<Category[]>
catalogApi.getItemTypes(): Promise<ItemType[]>
catalogApi.getVariants(): Promise<Variant[]>
catalogApi.getSizes(): Promise<Size[]>
catalogApi.getCatalogItems(): Promise<CatalogItem[]>

// Requests
requestsApi.getAll(): Promise<Request[]>
requestsApi.getByUser(userId: string): Promise<Request[]>
requestsApi.getPending(): Promise<Request[]>
requestsApi.create(request: Omit<Request, 'id'>): Promise<Request>
requestsApi.updateStatus(id: string, status: RequestStatus): Promise<Request>
requestsApi.fulfill(id: string): Promise<Request>

// Issued Items
issuedItemsApi.getAll(): Promise<IssuedItem[]>
issuedItemsApi.getByUser(userId: string): Promise<IssuedItem[]>
issuedItemsApi.return(id: string, reason: string, condition: ReturnCondition): Promise<void>

// Inventory
inventoryApi.adjust(sizeId: string, type: AdjustmentType, quantity: number, reason: string): Promise<void>
inventoryApi.getLowStockItems(): Promise<CatalogItem[]>

// Purchase Orders
purchaseOrdersApi.getAll(): Promise<PurchaseOrder[]>
purchaseOrdersApi.create(po: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder>
purchaseOrdersApi.updateStatus(id: string, status: POStatus): Promise<PurchaseOrder>

// Vendors
vendorsApi.getAll(): Promise<Vendor[]>
vendorsApi.create(vendor: Omit<Vendor, 'id'>): Promise<Vendor>
vendorsApi.update(id: string, data: Partial<Vendor>): Promise<Vendor>

// Grant Sources
grantSourcesApi.getAll(): Promise<GrantSource[]>

// Notifications
notificationsApi.getByUser(userId: string): Promise<Notification[]>
notificationsApi.markAsRead(id: string): Promise<void>
notificationsApi.markAllAsRead(userId: string): Promise<void>
```

## Authentication Context

Located in `src/contexts/AuthContext.tsx`:

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}
```

## Page Components

### Team Member Pages

**Dashboard** (`src/pages/team-member/Dashboard.tsx`)
- Welcome message with role-specific subtitle
- StatCards: Active Requests, Ready for Pickup, Items Issued, Unread Notifications
- Warehouse Overview section (for staff/admin) with links to pending requests, open POs, low stock
- Recent Requests list
- Notifications panel with mark all read
- Quick Actions grid: New Request, My Inventory, Update Sizes, Request History

**RequestItems** (`src/pages/team-member/RequestItems.tsx`)
- Category filter buttons
- Available items list with consumable/issued badges
- Selection panel with variant/size selection
- Quantity controls
- Replacement reason dropdown (required for non-consumables already issued)
- Cart preview sidebar
- Review modal with notes field

**MyRequests** (`src/pages/team-member/MyRequests.tsx`)
- Filter tabs: All, Active, Completed
- Request cards with status badges
- Line item previews
- Ready for pickup highlight
- Detail modal with fulfillment information

**MyInventory** (`src/pages/team-member/MyInventory.tsx`)
- Group by toggle: Category or Date
- Issued items list with return button
- Summary stats: Total Items, Total Quantity, Categories, Days Since First Issue
- Return modal with condition selection and reason

**Profile** (`src/pages/team-member/Profile.tsx`)
- Account information (read-only)
- Size information with edit mode
- Quick reference size chips
- Notification preferences toggles

### Warehouse Staff Pages

**FulfillmentQueue** (`src/pages/warehouse/FulfillmentQueue.tsx`)
- Status summary cards: Pending, Approved, Ready, Backordered
- Filter buttons with counts
- Request cards with requester name, line items, stock availability
- Process modal with approve/reject/ready actions
- Pickup instructions for ready items

**Inventory** (`src/pages/warehouse/Inventory.tsx`)
- Search input and category filter
- Low stock filter toggle
- Stats: Total SKUs, Total Units, Reserved, Low Stock Items
- Grouped item cards by item type/variant
- Size table with on-hand, reserved, available columns
- Adjust modal with type selection (Count, Damage, Loss, Found, Transfer)

**ReceiveOrders** (`src/pages/warehouse/ReceiveOrders.tsx`)
- Summary: Awaiting Delivery, Partial Received, Completed, Pending Value
- Filter: Open Orders, All Orders
- PO cards with line item progress
- Receive modal with quantity inputs per line
- All button for quick full receipt

### Admin Pages

**UserManagement** (`src/pages/admin/UserManagement.tsx`)
- Stats: Total Members, Team Members, Warehouse Staff, Administrators, PPE Items Issued
- Search and filter by role/department
- User table with avatar, department, role, status, PPE count
- View and edit action buttons
- Edit modal with organization, contact, and access sections

**Catalog** (`src/pages/admin/Catalog.tsx`)
- Stats: Categories, Item Types, Variants, Consumables
- Tab navigation: Items, Categories, Variants
- Search and category filter
- Item type cards with variant tags
- Category cards with item counts
- Variants table with manufacturer, SKU, unit cost
- Item type detail modal

**Vendors** (`src/pages/admin/Vendors.tsx`)
- Vendor cards with contact info
- Active/inactive status badges
- Website links
- Add/Edit modal with full vendor fields

**PurchaseOrders** (`src/pages/admin/PurchaseOrders.tsx`)
- Stats: Total Orders, Total Value, Open Orders, Pending Value
- Filter by status and grant source
- PO cards with grant badge, quote request link, tracking info
- Receiving progress bar
- Detail modal with line items and totals

**Reports** (`src/pages/admin/Reports.tsx`)
- Date range filter: 30 Days, 90 Days, 1 Year
- StatCards: Total Requests, Fulfilled, Low Stock Items, PO Value
- Request Status Breakdown bar chart
- Most Requested Items list
- Low Stock Alert panel
- Inventory by Category breakdown
- System Overview stats

## File Structure

```
warehouse-pwa/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── layout/
│   │   │   └── Layout.tsx     # Main layout with navigation
│   │   ├── ui/
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── index.ts       # Barrel export
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── data/
│   │   └── mockData.ts        # Mock data for development
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Catalog.tsx
│   │   │   ├── PurchaseOrders.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   └── Vendors.tsx
│   │   ├── team-member/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MyInventory.tsx
│   │   │   ├── MyRequests.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── RequestItems.tsx
│   │   ├── warehouse/
│   │   │   ├── FulfillmentQueue.tsx
│   │   │   ├── Inventory.tsx
│   │   │   └── ReceiveOrders.tsx
│   │   └── Login.tsx
│   ├── services/
│   │   └── api.ts             # API service layer
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── App.tsx                # Route definitions
│   ├── index.css              # Tailwind imports & custom styles
│   └── main.tsx               # App entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── postcss.config.js
└── eslint.config.js
```

## Key Features

### Request Workflow
1. Team member browses catalog and adds items to cart
2. Submits request with optional notes
3. Warehouse staff sees request in Fulfillment Queue
4. Staff approves/rejects request
5. Staff marks as Ready for Pickup when items are staged
6. Team member picks up at Ripley Room
7. Staff completes pickup, items move to issued inventory

### Inventory Management
- Real-time stock tracking (on-hand, reserved, available)
- Low stock alerts based on par levels
- Adjustment types for auditing (Count, Damage, Loss, Found, Transfer)
- FEMA code tracking for compliance

### PPE Tracking
- Items issued per user
- Return processing with condition tracking
- Replacement reason requirements for non-consumables
- Size preferences for automatic matching

### Purchase Order Flow
1. Admin creates PO from vendor catalog
2. Links to grant source for funding tracking
3. Optional quote request reference
4. Warehouse staff receives incoming items
5. Partial receipts supported
6. Auto-status updates based on receipt progress

## PWA Configuration

The application is configured as a Progressive Web App with:
- Web manifest for install prompts
- Theme color matching brand
- Standalone display mode
- Offline-capable service worker (to be implemented)

## Development Notes

### Running the Application
```bash
cd warehouse-pwa
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

### Mock Data
The application uses mock data in `src/data/mockData.ts` and simulated API delays in `src/services/api.ts`. Replace with real API endpoints when backend is ready.

### Extending the Application
1. Add new types in `src/types/index.ts`
2. Add API methods in `src/services/api.ts`
3. Create page components in appropriate role folder
4. Add routes in `src/App.tsx`
5. Update navigation in `src/components/layout/Layout.tsx`
