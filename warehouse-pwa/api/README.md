# USAR Warehouse API

Azure Functions backend for the USAR Warehouse PWA.

## Prerequisites

- Node.js 18+
- Azure Functions Core Tools (`npm install -g azure-functions-core-tools@4`)
- Docker (for local SQL Server) OR Azure SQL Database

## Local Development Setup

### 1. Install Dependencies

```bash
cd warehouse-api
npm install
```

### 2. Set Up Local Database

**Option A: Docker (Recommended)**

```bash
# Start SQL Server in Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" \
  -p 1433:1433 --name usar-sql \
  -d mcr.microsoft.com/mssql/server:2022-latest

# Create database
docker exec -it usar-sql /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "YourPassword123!" -C \
  -Q "CREATE DATABASE usar_warehouse"
```

**Option B: Azure SQL Database**

Create an Azure SQL Database and update `local.settings.json` with your connection details.

### 3. Initialize Database

```bash
# Run schema creation
# Connect to your database and execute scripts/schema.sql

# Import data from Excel files
npm run import-data
# Then execute the generated scripts/seed-data.sql
```

### 4. Configure Environment

Edit `local.settings.json`:

```json
{
  "Values": {
    "SQL_SERVER": "localhost",
    "SQL_DATABASE": "usar_warehouse",
    "SQL_USER": "sa",
    "SQL_PASSWORD": "YourPassword123!",
    "JWT_SECRET": "your-secret-key-change-in-production"
  }
}
```

### 5. Start the API

```bash
npm start
```

The API will be available at `http://localhost:7071/api`

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout |
| Users | GET/POST /api/users, GET/PUT /api/users/{id} |
| Catalog | GET /api/categories, /api/itemTypes, /api/variants, /api/sizes, /api/catalog |
| Inventory | GET/PUT /api/inventory, POST /api/inventory/adjust, GET /api/inventory/low-stock |
| Requests | GET/POST /api/requests, GET/PUT /api/requests/{id}, POST /api/requests/{id}/fulfill |
| Purchase Orders | GET/POST /api/purchaseOrders, GET/PUT /api/purchaseOrders/{id} |
| Vendors | GET/POST /api/vendors, GET/PUT /api/vendors/{id} |
| Issued Items | GET /api/issuedItems, POST /api/issuedItems, POST /api/issuedItems/{id}/return |
| Notifications | GET /api/notifications, PUT /api/notifications/{id}/read |

## Deployment to Azure

```bash
# Login to Azure
az login

# Create resource group
az group create --name usar-warehouse-rg --location westus2

# Create Function App
az functionapp create \
  --name usar-warehouse-api \
  --resource-group usar-warehouse-rg \
  --consumption-plan-location westus2 \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --storage-account usarwarehousestorage

# Deploy
func azure functionapp publish usar-warehouse-api
```

## Default Admin Credentials

After running the schema, a default admin user is created:

- **Email:** admin@lacountyfire.gov
- **Password:** admin123 (change immediately!)
