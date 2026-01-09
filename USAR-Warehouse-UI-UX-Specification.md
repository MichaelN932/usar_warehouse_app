# USAR Warehouse & Procurement System
## Complete UI/UX Design Specification

**Version:** 1.0  
**Last Updated:** January 2026  
**Author:** Michael / Dex Command  
**Project Codename:** CacheDEX

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Design System Foundation](#design-system-foundation)
3. [User Personas & Journeys](#user-personas--journeys)
4. [Information Architecture](#information-architecture)
5. [Screen-by-Screen Specifications](#screen-by-screen-specifications)
6. [Component Library](#component-library)
7. [Interaction Patterns](#interaction-patterns)
8. [Mobile-First Warehouse UX](#mobile-first-warehouse-ux)
9. [Accessibility & Performance](#accessibility--performance)
10. [Design Tokens & Assets](#design-tokens--assets)

---

## Design Philosophy

### The Vision
Create the most intuitive, efficient, and visually refined warehouse management and procurement system ever built for emergency services. This system should feel as natural as using Square for checkout, as polished as Shopify for browsing, and as powerful as Coupa for procurement workflows—all while being purpose-built for the unique demands of USAR operations.

### Core Principles

#### 1. **Speed Over Everything**
Every interaction should be achievable in under 3 taps. Warehouse staff wearing gloves, operating in low-light conditions, or managing urgent deployments cannot waste time on complex navigation.

#### 2. **Zero Training Required**
The interface should be so intuitive that any team member can walk up and complete a task without instruction. Like Square's POS or an iPad—grandma-proof design.

#### 3. **Offline-First Reliability**
The system must function flawlessly without connectivity. Sync indicators should be clear but non-intrusive. Actions queue automatically and resolve when connected.

#### 4. **Information Density Without Clutter**
Show everything needed, nothing more. Use progressive disclosure—simple surface, depth on demand.

#### 5. **Professional Emergency Services Aesthetic**
Not consumer-cute, not enterprise-boring. Clean, confident, authoritative. Colors and typography that convey competence and urgency when needed.

### Design Inspirations Matrix

| System | What We're Taking | What We're Leaving Behind |
|--------|-------------------|---------------------------|
| **Square POS** | Cart-based transactions, one-tap actions, signature capture, clean checkout flow | Consumer retail aesthetic |
| **Shopify** | Product catalog browsing, order status tracking, collection organization, admin dashboard | E-commerce specific features |
| **Coupa** | Approval workflows, budget tracking visualizations, procurement pipelines | Enterprise complexity |
| **Procurify** | Simple approval UI, mobile-first approvals, clean request forms | Limited customization |
| **Odoo** | Kanban boards, location-based inventory, transfer workflows | Dated visual design |
| **Slack** | Notification patterns, channel organization, quick actions | Chat-centric focus |

---

## Design System Foundation

### Brand Identity

**Name:** CacheDEX (or WarehouseDEX / SupplyDEX)

**Tagline:** "Mission-Ready Logistics"

**Brand Personality:**
- Authoritative but approachable
- Efficient and purposeful
- Reliable and trustworthy
- Modern but not trendy

### Color System

```css
/* Primary Palette - Professional Emergency Services */
--color-primary-900: #0D1B2A;     /* Deep navy - primary text, headers */
--color-primary-800: #1B263B;     /* Dark blue - secondary backgrounds */
--color-primary-700: #2D3E50;     /* Navy - card backgrounds */
--color-primary-600: #415A77;     /* Steel blue - borders, dividers */
--color-primary-500: #778DA9;     /* Slate - secondary text */
--color-primary-400: #A8BCCC;     /* Light slate - disabled states */
--color-primary-100: #E8EEF2;     /* Off-white - backgrounds */
--color-primary-50:  #F7F9FB;     /* Near white - page backgrounds */

/* Action Colors - High Visibility */
--color-action-primary: #0066FF;   /* Bright blue - primary actions */
--color-action-hover: #0052CC;     /* Darker blue - hover states */
--color-action-pressed: #003D99;   /* Deep blue - pressed states */

/* Status Colors - Clear Meaning */
--color-success-500: #059669;      /* Green - success, received, approved */
--color-success-100: #D1FAE5;      /* Light green - success backgrounds */
--color-warning-500: #D97706;      /* Amber - warnings, low stock, pending */
--color-warning-100: #FEF3C7;      /* Light amber - warning backgrounds */
--color-danger-500:  #DC2626;      /* Red - errors, critical, rejected */
--color-danger-100:  #FEE2E2;      /* Light red - error backgrounds */
--color-info-500:    #0284C7;      /* Sky blue - information, in-progress */
--color-info-100:    #E0F2FE;      /* Light sky - info backgrounds */

/* Grant Source Colors - Budget Tracking */
--color-grant-fema:  #1E40AF;      /* FEMA blue */
--color-grant-state: #7C3AED;      /* State purple */
--color-grant-prm:   #059669;      /* PRM green */

/* Functional Colors */
--color-surface: #FFFFFF;          /* Card surfaces */
--color-background: #F8FAFC;       /* Page backgrounds */
--color-border: #E2E8F0;           /* Default borders */
--color-border-strong: #CBD5E1;    /* Emphasized borders */
--color-text-primary: #0F172A;     /* Primary text */
--color-text-secondary: #475569;   /* Secondary text */
--color-text-tertiary: #94A3B8;    /* Tertiary/disabled text */
--color-text-inverse: #FFFFFF;     /* Text on dark backgrounds */
```

### Typography

**Primary Font Family:** "Plus Jakarta Sans"
- Modern, highly legible, professional
- Excellent number legibility (critical for inventory)
- Good weight range for hierarchy
- Free via Google Fonts

**Monospace Font:** "JetBrains Mono"
- For SKUs, barcodes, item codes
- Clear distinction between similar characters (0/O, 1/l/I)

**Type Scale:**
```css
/* Display - Dashboard headers, hero text */
--text-display: 2.25rem/2.5rem;    /* 36px/40px */
--text-display-weight: 700;

/* Heading 1 - Page titles */
--text-h1: 1.875rem/2.25rem;       /* 30px/36px */
--text-h1-weight: 600;

/* Heading 2 - Section headers */
--text-h2: 1.5rem/2rem;            /* 24px/32px */
--text-h2-weight: 600;

/* Heading 3 - Card titles, subsections */
--text-h3: 1.25rem/1.75rem;        /* 20px/28px */
--text-h3-weight: 600;

/* Heading 4 - List headers, labels */
--text-h4: 1.125rem/1.5rem;        /* 18px/24px */
--text-h4-weight: 500;

/* Body Large - Emphasis text */
--text-body-lg: 1rem/1.5rem;       /* 16px/24px */
--text-body-lg-weight: 400;

/* Body - Default text */
--text-body: 0.9375rem/1.375rem;   /* 15px/22px */
--text-body-weight: 400;

/* Body Small - Secondary info */
--text-body-sm: 0.875rem/1.25rem;  /* 14px/20px */
--text-body-sm-weight: 400;

/* Caption - Labels, timestamps */
--text-caption: 0.75rem/1rem;      /* 12px/16px */
--text-caption-weight: 500;

/* Mono - Codes, SKUs */
--text-mono: 0.875rem/1.25rem;     /* 14px/20px */
--text-mono-family: 'JetBrains Mono';
```

### Spacing Scale

```css
/* 4px base unit */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - small elements */
--radius-md: 0.5rem;     /* 8px - buttons, inputs */
--radius-lg: 0.75rem;    /* 12px - cards */
--radius-xl: 1rem;       /* 16px - modals, large cards */
--radius-2xl: 1.5rem;    /* 24px - featured elements */
--radius-full: 9999px;   /* Pills, avatars */
```

### Shadows

```css
/* Elevation system */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Interactive shadows */
--shadow-button: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-button-hover: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Focus ring */
--shadow-focus: 0 0 0 3px rgba(0, 102, 255, 0.4);
```

---

## User Personas & Journeys

### Persona 1: Team Member (Basic User)
**Name:** Alex, Firefighter/Rescue Specialist  
**Tech Comfort:** Moderate (uses smartphone daily)  
**Primary Tasks:**
- Browse available equipment
- Request PPE and gear
- Check request status
- View currently issued items
- Initiate returns

**Key Needs:**
- Quick mobile access
- Clear item photos and descriptions
- Simple request process
- Status visibility

**Pain Points:**
- Doesn't want to learn complex software
- Needs to request gear quickly before deployments
- Wants to know what's available without asking

### Persona 2: Warehouse Staff
**Name:** Jordan, Logistics Specialist  
**Tech Comfort:** High  
**Primary Tasks:**
- Process incoming requests
- Issue equipment to members
- Receive inventory shipments
- Update stock levels
- Scan barcodes and packing slips

**Key Needs:**
- Fast POS-style checkout
- Barcode scanning
- Quick access to member lookup
- Efficient receiving workflow

**Pain Points:**
- Interruptions from walk-up requests
- Manual data entry from packing slips
- Keeping track of who has what
- Managing multiple tasks simultaneously

### Persona 3: Warehouse Manager / Admin
**Name:** Sam, Logistics Manager  
**Tech Comfort:** High  
**Primary Tasks:**
- Approve purchase requests
- Manage procurement pipeline
- Generate reports
- Track budgets by grant source
- Oversee inventory levels
- Manage vendors

**Key Needs:**
- Dashboard overview
- Budget tracking by FEMA/State/PRM
- Approval queue management
- Comprehensive reporting
- Vendor performance visibility

**Pain Points:**
- Tracking spend across multiple grants
- Email chaos for quotes and approvals
- Manual report generation
- Lack of procurement visibility

---

## Information Architecture

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         CACHEDEX                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📦 WAREHOUSE (POS Mode)                                  │  │
│  │  ├── Dashboard (Stats, Alerts, Quick Actions)            │  │
│  │  ├── Issue Equipment                                     │  │
│  │  ├── Receive Inventory                                   │  │
│  │  ├── Process Returns                                     │  │
│  │  ├── Request Queue                                       │  │
│  │  └── Inventory Browser                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🛒 STORE (Member Portal)                                 │  │
│  │  ├── Browse Catalog                                      │  │
│  │  │   ├── Categories                                      │  │
│  │  │   ├── Search                                          │  │
│  │  │   └── Item Detail                                     │  │
│  │  ├── My Cart                                             │  │
│  │  ├── My Requests                                         │  │
│  │  ├── My Equipment (Currently Issued)                     │  │
│  │  └── Return Items                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📋 PROCUREMENT                                           │  │
│  │  ├── Dashboard (Pipeline Overview)                       │  │
│  │  ├── Quotes                                              │  │
│  │  │   ├── Request Quote                                   │  │
│  │  │   ├── Pending Quotes                                  │  │
│  │  │   └── Quote History                                   │  │
│  │  ├── Orders                                              │  │
│  │  │   ├── Active Orders                                   │  │
│  │  │   ├── Ready to Receive                                │  │
│  │  │   └── Order History                                   │  │
│  │  ├── Vendors                                             │  │
│  │  ├── Approvals (Manager)                                 │  │
│  │  └── Budgets                                             │  │
│  │      ├── FEMA                                            │  │
│  │      ├── State                                           │  │
│  │      └── PRM                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📊 REPORTS & ADMIN                                       │  │
│  │  ├── Inventory Reports                                   │  │
│  │  ├── Equipment Accountability                            │  │
│  │  ├── Procurement Reports                                 │  │
│  │  ├── User Management                                     │  │
│  │  └── System Settings                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### URL Structure

```
/                           → Role-based redirect
/warehouse                  → Warehouse POS Dashboard
/warehouse/issue            → Issue Equipment
/warehouse/receive          → Receive Inventory
/warehouse/returns          → Process Returns
/warehouse/requests         → Request Queue
/warehouse/inventory        → Inventory Browser
/warehouse/inventory/:id    → Item Detail

/store                      → Member Store Home
/store/browse               → Browse Catalog
/store/browse/:category     → Category View
/store/item/:id             → Item Detail
/store/cart                 → Shopping Cart
/store/requests             → My Requests
/store/equipment            → My Equipment
/store/returns              → Initiate Return

/procurement                → Procurement Dashboard
/procurement/quotes         → Quotes List
/procurement/quotes/new     → New Quote Request
/procurement/quotes/:id     → Quote Detail
/procurement/orders         → Orders List
/procurement/orders/:id     → Order Detail
/procurement/vendors        → Vendor Management
/procurement/vendors/:id    → Vendor Detail
/procurement/approvals      → Approval Queue
/procurement/budgets        → Budget Overview
/procurement/budgets/:grant → Grant Detail

/reports                    → Reports Dashboard
/reports/:type              → Specific Report

/admin                      → Admin Settings
/admin/users                → User Management
/admin/settings             → System Settings
```

---

## Screen-by-Screen Specifications

### 1. WAREHOUSE POS DASHBOARD

**Purpose:** Central command center for warehouse operations. At-a-glance status and one-tap access to all functions.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ≡  CacheDEX                    🔔 3    👤 Jordan              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Good morning, Jordan                      Jan 7, 2026          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  QUICK STATS                                             │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │   │
│  │  │   12    │ │    5    │ │    3    │ │    8    │        │   │
│  │  │Pending  │ │Low Stock│ │Receiving│ │ Returns │        │   │
│  │  │Requests │ │ Items   │ │ Today   │ │ Pending │        │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │                       │  │                       │          │
│  │     📤 ISSUE          │  │     📥 RECEIVE        │          │
│  │     Equipment         │  │     Inventory         │          │
│  │                       │  │                       │          │
│  │  Check out gear to    │  │  Process incoming     │          │
│  │  team members         │  │  shipments            │          │
│  │                       │  │                       │          │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │                       │  │                       │          │
│  │     ↩️ RETURNS        │  │     📋 REQUESTS       │          │
│  │     Process           │  │     Queue             │          │
│  │                       │  │                       │          │
│  │  Check in returned    │  │  Fulfill member       │          │
│  │  equipment            │  │  requests (12)        │          │
│  │                       │  │                       │          │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ⚠️ LOW STOCK ALERTS                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ N95 Respirators        85 remaining (reorder: 100)  →   │   │
│  │ Hard Hats (White)      12 remaining (reorder: 25)   →   │   │
│  │ Nitrile Gloves (L)     45 remaining (reorder: 100)  →   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📦 RECENT ACTIVITY                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 10:42  Issued 2 items to M. Rodriguez                   │   │
│  │ 10:15  Received PO #2024-0847 (24 items)                │   │
│  │ 09:58  Return processed - T. Chen                       │   │
│  │ 09:30  New request from K. Williams                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  🏠        📦        🛒        📋        👤                    │
│  Home     Inventory  Store    Procure   Profile                │
└─────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Quick stat cards are tappable → Navigate to relevant list
- Action tiles have subtle hover/press states
- Low stock items → Tap to view item, swipe to add to PO
- Activity feed is scrollable with pull-to-refresh

**Visual Design:**
- Action tiles: Large (min 120px height), bold icons, clear labels
- Stats: High-contrast numbers with subtle background colors
- Low stock: Amber warning indicators
- Activity: Timestamp in secondary text, action in primary

---

### 2. ISSUE EQUIPMENT (POS Mode)

**Purpose:** Square-style checkout for issuing equipment to team members.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Issue Equipment                              [Scan] [Search] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ISSUING TO:                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  👤  Select Team Member...                           ▼  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  QUICK ADD                                     [View All Items] │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  🧤     │ │  🥽     │ │  ⛑️     │ │  👕     │              │
│  │ Gloves  │ │ Goggles │ │ Helmet  │ │ BDU     │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  👖     │ │  👢     │ │  📻     │ │  🔦     │              │
│  │ Pants   │ │ Boots   │ │ Radio   │ │ Light   │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  CART (3 items)                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌────┐                                                 │   │
│  │  │ 📷 │  Nitrile Gloves (Large)          [-] 2 [+]     │   │
│  │  └────┘  SKU: GLV-NIT-L                                 │   │
│  │                                                         │   │
│  │  ┌────┐                                                 │   │
│  │  │ 📷 │  Safety Goggles                  [-] 1 [+]     │   │
│  │  └────┘  SKU: EYE-GOG-CLR                               │   │
│  │                                                         │   │
│  │  ┌────┐                                                 │   │
│  │  │ 📷 │  Team Wendy Helmet (M)           [-] 1 [+]  🗑️ │   │
│  │  └────┘  SKU: HLM-TW-M  S/N: TW-2024-0847               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              ✓  COMPLETE ISSUE                          │   │
│  │                   4 items                                │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Interactions:**

1. **Member Selection:**
   - Tap dropdown → Modal with searchable member list
   - Type to filter by name or badge number
   - Recent selections shown at top
   - Barcode scan badge option

2. **Quick Add Tiles:**
   - Tap tile → Shows size/variant picker if applicable
   - Long press → Quick add default variant
   - Visual feedback: Scale down on press, bounce on add

3. **Barcode Scanning:**
   - Tap scan button → Camera opens
   - Scan item UPC/SKU → Auto-adds to cart
   - Audio feedback: Success beep / Error buzz
   - Continuous scan mode available

4. **Cart Management:**
   - Quantity buttons: Tap to adjust
   - Swipe left to reveal delete
   - Items with serial numbers show S/N
   - Tap item to edit or view details

5. **Complete Issue:**
   - Button disabled until member selected + items in cart
   - Tap → Confirmation modal with summary
   - Option for signature capture
   - Success → Receipt/confirmation screen

**Visual Design:**
- Quick add tiles: 80x80px minimum, subtle shadow, rounded corners
- Cart items: Card-style with image thumbnail
- Complete button: Full-width, high-contrast, prominent
- Quantity controls: Large touch targets (44px minimum)

---

### 3. RECEIVE INVENTORY

**Purpose:** Process incoming shipments with OCR scanning of packing slips.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Receive Inventory                                    [Help]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RECEIVING METHOD                                               │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │                       │  │                       │          │
│  │  📷 SCAN PACKING      │  │  ✏️ MANUAL ENTRY     │          │
│  │     SLIP              │  │                       │          │
│  │                       │  │                       │          │
│  │  Photo or upload      │  │  Enter items          │          │
│  │  document             │  │  manually             │          │
│  │                       │  │                       │          │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  LINKED PURCHASE ORDER (Optional)                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Select PO...                                        ▼  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PO #2024-0892 - Grainger - Expected Jan 5            │   │
│  │  PO #2024-0891 - 5.11 Tactical - Expected Jan 7       │   │
│  │  PO #2024-0887 - Fisher Scientific - Expected Jan 8   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  GRANT SOURCE                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ○ FEMA    ○ State    ○ PRM    ○ Other                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  VENDOR                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Search or select vendor...                          ▼  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**After Scanning Packing Slip:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Receive Inventory                              [Rescan] [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✓ DOCUMENT SCANNED                                            │
│                                                                 │
│  Vendor: Grainger                                               │
│  PO Reference: 9847362                                          │
│  Date: Jan 5, 2026                                              │
│  Grant: FEMA (auto-detected from PO)                            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  EXTRACTED ITEMS                     Matched: 4/5               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✓ Nitrile Gloves (L) - 500ct                           │   │
│  │   Detected: 500  │  PO Expected: 500  │  ✓ Match        │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ✓ Safety Goggles - Clear                               │   │
│  │   Detected: 24   │  PO Expected: 24   │  ✓ Match        │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ⚠️ Hard Hats - White                                   │   │
│  │   Detected: 18   │  PO Expected: 24   │  ⚠️ Shortage    │   │
│  │   ┌────────────────────────────────────────────────┐   │   │
│  │   │  Accept 18  │  Flag for follow-up  │  Edit     │   │   │
│  │   └────────────────────────────────────────────────┘   │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ✓ First Aid Kits - Type B                              │   │
│  │   Detected: 10   │  PO Expected: 10   │  ✓ Match        │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ❓ Unmatched: "Safety Tape - Yellow"                   │   │
│  │   Detected: 6 rolls                                     │   │
│  │   ┌────────────────────────────────────────────────┐   │   │
│  │   │  Match to item...  │  Add as new  │  Ignore    │   │   │
│  │   └────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              ✓  CONFIRM RECEIPT                         │   │
│  │                  5 items                                 │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Interactions:**

1. **Scan Packing Slip:**
   - Tap → Camera opens with document frame guide
   - Auto-capture when document detected
   - Processing indicator while OCR runs
   - Results appear with confidence indicators

2. **Variance Handling:**
   - Shortages flagged in amber
   - Over-receipt flagged in blue (info)
   - One-tap to accept, flag, or edit
   - Unmatched items can be matched or added

3. **Confirm Receipt:**
   - Shows final summary
   - Links to PO (updates status)
   - Updates inventory levels
   - Creates audit trail entry

---

### 4. MEMBER STORE - CATALOG BROWSE

**Purpose:** Shopify-style browsing experience for team members to discover and request equipment.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ≡  Equipment Store              🔍           🛒 2              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔍  Search equipment...                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  CATEGORIES                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  🧤     │ │  👁️     │ │  ⛑️     │ │  👕     │              │
│  │ Hand    │ │  Eye    │ │  Head   │ │Clothing │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  👢     │ │  🫁     │ │  📻     │ │  🧰     │              │
│  │Footwear │ │Respirat.│ │ Comms   │ │ Tools   │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  POPULAR ITEMS                                                  │
│  ┌─────────────────────────┐ ┌─────────────────────────┐       │
│  │  ┌───────────────────┐  │ │  ┌───────────────────┐  │       │
│  │  │                   │  │ │  │                   │  │       │
│  │  │      [Image]      │  │ │  │      [Image]      │  │       │
│  │  │                   │  │ │  │                   │  │       │
│  │  └───────────────────┘  │ │  └───────────────────┘  │       │
│  │                         │ │                         │       │
│  │  Nitrile Gloves (L)     │ │  Safety Goggles         │       │
│  │  ● In Stock             │ │  ● In Stock             │       │
│  │                         │ │                         │       │
│  │  [+ Add to Cart]        │ │  [+ Add to Cart]        │       │
│  └─────────────────────────┘ └─────────────────────────┘       │
│                                                                 │
│  ┌─────────────────────────┐ ┌─────────────────────────┐       │
│  │  ┌───────────────────┐  │ │  ┌───────────────────┐  │       │
│  │  │                   │  │ │  │                   │  │       │
│  │  │      [Image]      │  │ │  │      [Image]      │  │       │
│  │  │                   │  │ │  │                   │  │       │
│  │  └───────────────────┘  │ │  └───────────────────┘  │       │
│  │                         │ │                         │       │
│  │  5.11 BDU Pants         │ │  Team Wendy Helmet      │       │
│  │  ○ Low Stock            │ │  ● In Stock             │       │
│  │  Select Size...         │ │  Select Size...         │       │
│  │                         │ │                         │       │
│  │  [+ Add to Cart]        │ │  [+ Add to Cart]        │       │
│  └─────────────────────────┘ └─────────────────────────┘       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  🏠        🛒        📋        📦        👤                    │
│  Store     Cart    Requests  My Gear   Profile                 │
└─────────────────────────────────────────────────────────────────┘
```

**Product Card States:**
- **In Stock:** Green dot, "Add to Cart" enabled
- **Low Stock:** Amber dot, "Add to Cart" enabled with warning
- **Out of Stock:** Red dot, "Request When Available" option
- **Size Required:** Shows "Select Size..." before add

---

### 5. PROCUREMENT DASHBOARD

**Purpose:** Pipeline view of all procurement activities with budget tracking.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Procurement                               [+ New Quote Req]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BUDGET OVERVIEW                                FY 2025-2026    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  FEMA         ████████████████░░░░░░░░  $187,420        │   │
│  │               $187,420 / $250,000 spent   (75%)         │   │
│  │                                                         │   │
│  │  State        ████████░░░░░░░░░░░░░░░░  $48,200         │   │
│  │               $48,200 / $125,000 spent    (39%)         │   │
│  │                                                         │   │
│  │  PRM          ███████████████████░░░░░  $142,800        │   │
│  │               $142,800 / $175,000 spent   (82%)         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  PROCUREMENT PIPELINE                                           │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ QUOTES   │ │ APPROVAL │ │ ORDERED  │ │ RECEIVING│          │
│  │ PENDING  │ │ NEEDED   │ │          │ │          │          │
│  │    8     │ │    3     │ │    5     │ │    2     │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│      ▼            ▼            ▼            ▼                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  ┌─ Grainger - Safety Equipment ──────────────────────┐ │  │
│  │  │  Quote requested Jan 3  •  FEMA  •  Est. $2,400    │ │  │
│  │  │  ⏳ Waiting for response                           │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌─ 5.11 Tactical - BDU Order ────────────────────────┐ │  │
│  │  │  Quote received Jan 4  •  State  •  $3,850         │ │  │
│  │  │  ⚡ Ready for approval                              │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌─ Fisher Scientific - Lab Supplies ─────────────────┐ │  │
│  │  │  Ordered Jan 2  •  PRM  •  $1,247                  │ │  │
│  │  │  📦 Shipped - Expected Jan 8                       │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📧 EMAIL ACTIVITY                              [View All]      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  10:24  Quote received from Grainger           [Link]   │   │
│  │  09:15  Shipping confirmation - Fisher Sci     [Link]   │   │
│  │  Yesterday  Follow-up sent to 5.11             [Link]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Design:**
- Budget bars: Color-coded by grant source
- Warning state when budget >80% utilized
- Pipeline columns: Kanban-style, drag to reorder (desktop)
- Cards: Tap to expand, swipe for actions

---

### 6. APPROVAL QUEUE (Manager View)

**Purpose:** Streamlined approval workflow for managers.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Approvals                                    [Filter] [Sort] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PENDING YOUR APPROVAL                                    (7)   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  5.11 Tactical - BDU Uniform Order                      │   │
│  │  Requested by: Jordan Martinez  •  Jan 4, 2026          │   │
│  │                                                         │   │
│  │  Grant: State                     Amount: $3,850.00     │   │
│  │  Budget Remaining: $76,800        After: $72,950        │   │
│  │                                                         │   │
│  │  Items: 15 BDU Pants, 15 BDU Shirts, 10 Belts          │   │
│  │                                                         │   │
│  │  [View Details]                                         │   │
│  │                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐              │   │
│  │  │  ✗  Reject      │  │  ✓  Approve     │              │   │
│  │  └─────────────────┘  └─────────────────┘              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Grainger - Safety Equipment Restock                    │   │
│  │  Requested by: Alex Thompson  •  Jan 3, 2026            │   │
│  │                                                         │   │
│  │  Grant: FEMA                      Amount: $2,420.00     │   │
│  │  Budget Remaining: $62,580        After: $60,160        │   │
│  │                                                         │   │
│  │  Items: 500 Nitrile Gloves, 50 N95 Respirators...      │   │
│  │                                                         │   │
│  │  [View Details]                                         │   │
│  │                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐              │   │
│  │  │  ✗  Reject      │  │  ✓  Approve     │              │   │
│  │  └─────────────────┘  └─────────────────┘              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                        [Approve All (7)]                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Swipe Actions (Mobile):**
- Swipe right → Approve (green)
- Swipe left → Reject (red)
- Tap card → Expand details

**Batch Actions:**
- "Approve All" for trusted requesters
- Select multiple → Batch approve/reject
- Add note/reason for rejections

---

## Component Library

### Buttons

```
PRIMARY BUTTON
┌─────────────────────────────────┐
│      ✓  Complete Issue          │  ← Full width, high contrast
└─────────────────────────────────┘
- Background: var(--color-action-primary)
- Text: white, 600 weight
- Height: 48px (mobile), 44px (desktop)
- Border-radius: var(--radius-md)
- Shadow: var(--shadow-button)
- Hover: var(--color-action-hover), var(--shadow-button-hover)
- Disabled: 50% opacity, no shadow

SECONDARY BUTTON
┌─────────────────────────────────┐
│         Cancel                  │  ← Outlined style
└─────────────────────────────────┘
- Background: transparent
- Border: 1px solid var(--color-border-strong)
- Text: var(--color-text-primary)
- Hover: var(--color-background)

DANGER BUTTON
┌─────────────────────────────────┐
│      🗑️  Delete Item            │  ← Red variant
└─────────────────────────────────┘
- Background: var(--color-danger-500)
- Text: white

ICON BUTTON
┌─────┐
│  +  │  ← Square, icon only
└─────┘
- 44x44px minimum touch target
- Subtle background on hover

QUICK ACTION TILE
┌─────────────────────┐
│                     │
│     📤 ISSUE        │  ← Large, tappable area
│     Equipment       │
│                     │
└─────────────────────┘
- Min height: 120px
- Large icon (32px)
- Two-line label
- Subtle shadow, lifts on hover
```

### Form Inputs

```
TEXT INPUT
┌─────────────────────────────────────────────────┐
│  Search equipment...                            │
└─────────────────────────────────────────────────┘
Label above (optional)
- Height: 44px
- Border: 1px solid var(--color-border)
- Border-radius: var(--radius-md)
- Focus: var(--shadow-focus), border-color: var(--color-action-primary)
- Placeholder: var(--color-text-tertiary)

SELECT / DROPDOWN
┌─────────────────────────────────────────────────┐
│  Select vendor...                            ▼  │
└─────────────────────────────────────────────────┘
- Same styling as text input
- Chevron icon right-aligned
- Options appear in modal (mobile) or dropdown (desktop)

QUANTITY STEPPER
┌─────┐ ┌─────┐ ┌─────┐
│  -  │ │  2  │ │  +  │
└─────┘ └─────┘ └─────┘
- 44px height buttons
- Number in center, larger font
- Disabled state when at min/max

RADIO GROUP (Grant Selection)
┌─────────────────────────────────────────────────┐
│  ○ FEMA    ● State    ○ PRM    ○ Other         │
└─────────────────────────────────────────────────┘
- Horizontal on desktop, can stack on mobile
- Color indicator matches grant color when selected
```

### Cards

```
ITEM CARD (Catalog)
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │        [Product           │  │
│  │         Image]            │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  Nitrile Gloves (Large)         │  ← Product name
│  SKU: GLV-NIT-L                 │  ← SKU in mono font
│  ● In Stock                     │  ← Status indicator
│                                 │
│  ┌───────────────────────────┐  │
│  │     + Add to Cart         │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
- Background: var(--color-surface)
- Border-radius: var(--radius-lg)
- Shadow: var(--shadow-md)
- Padding: var(--space-4)

CART ITEM
┌─────────────────────────────────────────────────────────┐
│  ┌────┐                                                 │
│  │ 📷 │  Nitrile Gloves (Large)          [-] 2 [+]     │
│  └────┘  SKU: GLV-NIT-L                                 │
└─────────────────────────────────────────────────────────┘
- Horizontal layout
- Thumbnail 60x60px
- Quantity controls right-aligned
- Swipe-to-delete on mobile

PROCUREMENT CARD
┌─────────────────────────────────────────────────────────┐
│  Grainger - Safety Equipment                           │
│  Requested Jan 3  •  FEMA  •  Est. $2,400              │
│  ⏳ Waiting for vendor response                        │
│                                          [View] [...]  │
└─────────────────────────────────────────────────────────┘
- Vendor name as title
- Metadata row: date, grant badge, amount
- Status with icon
- Action buttons right-aligned

APPROVAL CARD
┌─────────────────────────────────────────────────────────┐
│  5.11 Tactical - BDU Order                             │
│  Jordan Martinez  •  Jan 4  •  State  •  $3,850        │
│  Budget: $76,800 → $72,950                             │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │  ✗  Reject      │  │  ✓  Approve     │              │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
- Shows budget impact
- Inline approve/reject buttons
- Expandable for full details
```

### Status Indicators

```
STOCK STATUS
● In Stock        (green - var(--color-success-500))
○ Low Stock       (amber - var(--color-warning-500))
○ Out of Stock    (red - var(--color-danger-500))

ORDER STATUS
⏳ Pending        (gray)
📝 Quote Requested (blue)
📋 Quote Received  (blue)
⚡ Needs Approval  (amber)
✓ Approved        (green)
📦 Ordered        (blue)
🚚 Shipped        (blue)
📥 Delivered      (green)
✗ Rejected        (red)

GRANT BADGES
┌──────┐
│ FEMA │  (--color-grant-fema background, white text)
└──────┘
┌───────┐
│ State │  (--color-grant-state background, white text)
└───────┘
┌─────┐
│ PRM │  (--color-grant-prm background, white text)
└─────┘
```

### Navigation

```
BOTTOM TAB BAR (Mobile)
┌─────────────────────────────────────────────────────────┐
│  🏠        📦        🛒        📋        👤            │
│  Home    Inventory  Store    Procure   Profile         │
└─────────────────────────────────────────────────────────┘
- Fixed to bottom
- 56px height
- Active state: filled icon, accent color
- Badge for notifications (red dot or count)

SIDE NAVIGATION (Desktop)
┌──────────────────────┐
│  CACHEDEX            │
│                      │
│  📊 Dashboard        │  ← Active state with accent bar
│  📦 Inventory        │
│  🛒 Store            │
│  📋 Procurement      │
│  📊 Reports          │
│  ⚙️ Settings         │
│                      │
│  ──────────────      │
│                      │
│  👤 Jordan M.        │
│     Warehouse Staff  │
└──────────────────────┘
- Collapsible on smaller screens
- Active item has left border accent
- User info at bottom

BREADCRUMBS
Home  /  Inventory  /  Hand Protection  /  Gloves
- Clickable links
- Current page not linked
- Truncate middle items on mobile
```

---

## Interaction Patterns

### Sound Feedback (Warehouse Mode)

```javascript
// Sound configuration for warehouse operations
const sounds = {
  scanSuccess: '/sounds/scan-success.mp3',    // Quick, positive beep
  scanError: '/sounds/scan-error.mp3',        // Lower, alerting buzz
  actionComplete: '/sounds/complete.mp3',     // Satisfying confirmation
  warning: '/sounds/warning.mp3',             // Attention-getting tone
};

// Usage
function onBarcodeScanned(result) {
  if (result.matched) {
    playSound(sounds.scanSuccess);
    addToCart(result.item);
  } else {
    playSound(sounds.scanError);
    showError('Item not found in inventory');
  }
}
```

### Haptic Feedback (Mobile)

```javascript
// Vibration patterns
const haptics = {
  light: 10,      // Subtle tap for selections
  medium: 25,     // Button presses
  success: [10, 50, 10],  // Double tap for success
  error: [50, 100, 50],   // Longer pattern for errors
};

// Usage
function onApprove() {
  navigator.vibrate(haptics.success);
  completeApproval();
}
```

### Loading States

```
SKELETON LOADING (Cards)
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │  ████████████████████████ │  │
│  │  ████████████████████████ │  │
│  └───────────────────────────┘  │
│  ████████████████               │
│  ████████                       │
└─────────────────────────────────┘
- Shimmer animation
- Match actual content dimensions

INLINE LOADING
Processing...  ◐
- Spinning indicator next to text
- Replace button text during action

FULL PAGE LOADING
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│                    ┌─────────┐                          │
│                    │   ◐     │                          │
│                    └─────────┘                          │
│                  Loading...                             │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
- Centered spinner
- Optional progress text
```

### Empty States

```
NO ITEMS IN CART
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                      🛒                                 │
│                                                         │
│              Your cart is empty                         │
│                                                         │
│        Scan items or browse the catalog                 │
│        to add equipment                                 │
│                                                         │
│              [Browse Catalog]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘

NO SEARCH RESULTS
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                      🔍                                 │
│                                                         │
│          No results for "xyz"                           │
│                                                         │
│        Try different keywords or                        │
│        browse by category                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Confirmation Dialogs

```
DESTRUCTIVE ACTION
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Delete this item?                                      │
│                                                         │
│  This will remove "Hard Hat (White)" from               │
│  the current transaction. This cannot be undone.        │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │     Cancel      │  │     Delete      │              │
│  └─────────────────┘  └─────────────────┘              │
│                        (red button)                     │
└─────────────────────────────────────────────────────────┘

SUCCESS CONFIRMATION
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                      ✓                                  │
│                                                         │
│           Issue Complete                                │
│                                                         │
│  4 items issued to Maria Rodriguez                      │
│  Transaction #TXN-2026-0847                             │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │            Done                              │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
│  [Print Receipt]    [Email Receipt]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Swipe Actions

```
SWIPE RIGHT TO APPROVE (Green)
┌─────────────────────────────────────────────────────────┐
│  ██████  ✓  │  Card Content                            │
│  APPROVE    │                                           │
└─────────────────────────────────────────────────────────┘

SWIPE LEFT TO DELETE (Red)
┌─────────────────────────────────────────────────────────┐
│  Card Content                           │  🗑️  ██████  │
│                                         │     DELETE   │
└─────────────────────────────────────────────────────────┘

- Reveal distance: 80px minimum
- Color intensity increases with swipe distance
- Snap back if not fully swiped
- Execute action on full swipe
```

---

## Mobile-First Warehouse UX

### Scanner Integration Best Practices

Based on industry research, implement these patterns for optimal scanning:

1. **Scanner Toggle Management:**
   - Disable scanner when modals are open
   - Disable during server communication
   - Visual indicator when scanner is active (LED simulation)
   - Auto-disable after period of inactivity

2. **Dirty Scan Prevention:**
   - Queue scans during processing
   - Debounce rapid successive scans
   - Clear indicator that scan is being processed

3. **Sound Feedback:**
   - Success: Short, high-pitched beep
   - Error: Lower, longer buzz
   - Warning: Medium tone for attention
   - Distinct sounds for each state

4. **Large Touch Targets:**
   - Minimum 44x44px for all interactive elements
   - Consider gloved operation (48px+ recommended)
   - Generous spacing between targets

### One-Handed Operation

Design for thumb-zone accessibility:

```
┌─────────────────────────────┐
│  Hard to    │    Hard to    │
│  Reach      │    Reach      │
├─────────────┼───────────────┤
│             │               │
│   OK        │      OK       │
│             │               │
├─────────────┴───────────────┤
│                             │
│         Easy Reach          │
│      (Primary Actions)      │
│                             │
└─────────────────────────────┘
```

- Place primary actions in bottom 1/3 of screen
- Avoid important actions in top corners
- Use bottom sheets for selection menus
- Floating action button in bottom-right for main action

### Offline Mode Indicators

```
ONLINE (Hidden - default state)
[No indicator needed]

OFFLINE
┌─────────────────────────────────────────────────────────┐
│  ⚠️  You're offline. Changes will sync when connected.  │
└─────────────────────────────────────────────────────────┘
- Persistent banner at top
- Amber/yellow color
- Does not block functionality

SYNCING
┌─────────────────────────────────────────────────────────┐
│  ◐  Syncing 3 changes...                                │
└─────────────────────────────────────────────────────────┘
- Shows progress
- Auto-dismisses when complete

SYNC ERROR
┌─────────────────────────────────────────────────────────┐
│  ⚠️  3 changes failed to sync.          [Retry] [View]  │
└─────────────────────────────────────────────────────────┘
- Actionable error state
- Option to view/retry specific items
```

---

## Accessibility & Performance

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on backgrounds: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- Interactive elements: Clear focus states

**Keyboard Navigation:**
- All functions accessible via keyboard
- Logical tab order
- Focus visible at all times
- Skip links for main content

**Screen Reader Support:**
- Semantic HTML structure
- ARIA labels for complex components
- Live regions for dynamic updates
- Alt text for all images

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| First Contentful Paint | < 1.5s | Initial load |
| Time to Interactive | < 3s | Full functionality |
| Largest Contentful Paint | < 2.5s | Main content visible |
| Cumulative Layout Shift | < 0.1 | Visual stability |
| First Input Delay | < 100ms | Responsiveness |

**Optimization Strategies:**
- Code splitting by route
- Lazy load images below fold
- Service worker for offline caching
- Indexed DB for local data
- Optimistic UI updates

### PWA Requirements

```json
// manifest.json
{
  "name": "CacheDEX - Warehouse Management",
  "short_name": "CacheDEX",
  "description": "USAR Warehouse & Procurement System",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D1B2A",
  "theme_color": "#0066FF",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## Design Tokens & Assets

### Icon Library

Use **Lucide Icons** (consistent with shadcn/ui):

| Function | Icon | Usage |
|----------|------|-------|
| Home | `home` | Dashboard/home nav |
| Inventory | `package` | Inventory section |
| Issue | `arrow-up-from-line` | Issue equipment |
| Receive | `arrow-down-to-line` | Receive inventory |
| Return | `rotate-ccw` | Process returns |
| Cart | `shopping-cart` | Cart/requests |
| Search | `search` | Search function |
| Scan | `scan-line` | Barcode scanner |
| User | `user` | Profile/members |
| Settings | `settings` | Configuration |
| Approve | `check` | Approval action |
| Reject | `x` | Rejection action |
| Warning | `alert-triangle` | Warnings/alerts |
| Info | `info` | Information |
| Success | `check-circle` | Success states |
| Error | `x-circle` | Error states |
| Add | `plus` | Add items |
| Remove | `minus` | Remove/decrease |
| Delete | `trash-2` | Delete action |
| Edit | `pencil` | Edit action |
| Filter | `filter` | Filter controls |
| Sort | `arrow-up-down` | Sort controls |
| Menu | `menu` | Navigation menu |
| Close | `x` | Close/dismiss |
| Back | `arrow-left` | Back navigation |
| Forward | `arrow-right` | Forward/next |
| Upload | `upload` | File upload |
| Download | `download` | File download |
| Email | `mail` | Email functions |
| Calendar | `calendar` | Date selection |
| Clock | `clock` | Time/timestamp |
| Dollar | `dollar-sign` | Budget/pricing |

### Image Guidelines

**Product Photos:**
- Aspect ratio: 1:1 (square)
- Minimum size: 400x400px
- Maximum file size: 200KB
- Format: WebP with JPEG fallback
- Background: White or transparent

**Thumbnails:**
- Size: 60x60px, 120x120px, 240x240px
- Generated automatically from product photos

**Document Scans:**
- Format: JPEG or PNG
- Resolution: 300 DPI minimum for OCR
- Auto-crop and enhance in app

### Animation Tokens

```css
/* Timing */
--duration-instant: 0ms;
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Easing */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Standard animations */
--transition-button: background-color var(--duration-fast) var(--ease-default),
                     transform var(--duration-fast) var(--ease-out),
                     box-shadow var(--duration-fast) var(--ease-default);

--transition-card: transform var(--duration-normal) var(--ease-out),
                   box-shadow var(--duration-normal) var(--ease-default);

--transition-modal: opacity var(--duration-normal) var(--ease-out),
                    transform var(--duration-normal) var(--ease-out);
```

---

## Implementation Priorities

### Phase 1: Foundation (Weeks 1-2)
- [ ] Design system setup (colors, typography, spacing)
- [ ] Component library basics (buttons, inputs, cards)
- [ ] Navigation structure
- [ ] Authentication screens
- [ ] Basic dashboard layout

### Phase 2: Warehouse POS (Weeks 3-4)
- [ ] Issue equipment flow
- [ ] Barcode scanner integration
- [ ] Cart management
- [ ] Member selection
- [ ] Transaction completion

### Phase 3: Receiving & Returns (Weeks 5-6)
- [ ] OCR scanning interface
- [ ] Packing slip processing
- [ ] Inventory updates
- [ ] Return processing
- [ ] Discrepancy handling

### Phase 4: Member Store (Weeks 7-8)
- [ ] Catalog browsing
- [ ] Product detail pages
- [ ] Request workflow
- [ ] Order tracking
- [ ] My equipment view

### Phase 5: Procurement (Weeks 9-10)
- [ ] Quote request flow
- [ ] Email integration UI
- [ ] Approval workflows
- [ ] Budget tracking
- [ ] Vendor management

### Phase 6: Reports & Polish (Weeks 11-12)
- [ ] Reporting dashboards
- [ ] Export functionality
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Final polish

---

## Appendix: Screen Mockup Checklist

Use this checklist when designing each screen:

- [ ] Mobile viewport (375px width) designed first
- [ ] Tablet viewport (768px) considered
- [ ] Desktop viewport (1440px) designed
- [ ] All interactive states defined (default, hover, focus, active, disabled)
- [ ] Loading states designed
- [ ] Empty states designed
- [ ] Error states designed
- [ ] Offline state considered
- [ ] Accessibility annotations included
- [ ] Touch targets minimum 44px
- [ ] Color contrast checked (4.5:1 minimum)
- [ ] Typography hierarchy clear
- [ ] Spacing consistent with design tokens
- [ ] Animation/transition behavior noted

---

**Document Status:** Living document - update as implementation progresses

**Feedback:** File issues or suggestions at [project repo]

**Last Review:** January 2026
