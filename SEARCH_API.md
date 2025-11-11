# Search API Documentation

## Overview

The search API now supports multi-field search across the `prescodatas` collection with a dedicated model for better performance and reliability.

## Endpoints

### 1. Multi-Field Search

Search across multiple fields simultaneously: name, email, mobile_no, and account_number.

**Endpoint:** `GET /api/search`

**Query Parameters:**

- `query` (required): Search term
- `collection` (optional): Collection name (defaults to "prescodatas")

**Examples:**

```bash
# Search by name
GET /api/search?query=ABA

# Search by email
GET /api/search?query=test@example.com

# Search by phone number
GET /api/search?query=08055671310

# Search by account number
GET /api/search?query=12596
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "6913620ef6c7ffc6a9926b01",
      "s_no": 9,
      "account_number": 12596,
      "name": "ABA CITY PRAYER PROJECT",
      "address": "P.O.BOX 2375 ABA ABIA STATE",
      "units_held": 3000,
      "rights_due": 500,
      "amount": 710000,
      "mobile_no": "08055671310",
      "email": null
    }
  ],
  "count": 1
}
```

### 2. Field-Specific Search

Search by a specific field only.

**Endpoint:** `GET /api/search/:field`

**Path Parameters:**

- `field`: Field name (name, email, mobile_no, account_number, address, s_no, units_held, rights_due, amount)

**Query Parameters:**

- `value` (required): Search value
- `collection` (optional): Collection name (defaults to "prescodatas")

**Examples:**

```bash
# Search by name field only
GET /api/search/name?value=ABA

# Search by email field only
GET /api/search/email?value=test@example.com

# Search by mobile number field only
GET /api/search/mobile_no?value=08055671310

# Search by account number field only
GET /api/search/account_number?value=12596
```

### 3. Get All Data

Retrieve all records from the collection.

**Endpoint:** `GET /api/data`

**Query Parameters:**

- `collection` (optional): Collection name (defaults to "prescodatas")

**Example:**

```bash
GET /api/data
GET /api/data?collection=prescodatas
```

### 4. Get Record by Account Number

Retrieve a single record by account number (no authentication required).

**Endpoint:** `GET /api/fetch-with-account/:id`

**Path Parameters:**

- `id`: Account number

**Example:**

```bash
GET /api/fetch-with-account/12596
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "6913620ef6c7ffc6a9926b01",
    "s_no": 9,
    "account_number": 12596,
    "name": "ABA CITY PRAYER PROJECT",
    "address": "P.O.BOX 2375 ABA ABIA STATE",
    "units_held": 3000,
    "rights_due": 500,
    "amount": 710000,
    "mobile_no": "08055671310",
    "email": null
  }
}
```

## Authentication

All endpoints except `/api/fetch-with-account/:id` require an API key in the request headers:

```
X-API-Key: your-api-key-here
```

## Data Model

The `prescodatas` collection has the following schema:

```typescript
{
  s_no: number;
  account_number: number;
  name: string;
  address: string;
  units_held: number;
  rights_due: number;
  amount: number;
  mobile_no?: string;
  email?: string;
}
```

## Search Features

- **Case-insensitive**: All text searches are case-insensitive
- **Partial matching**: Searches use regex for partial matches
- **Numeric search**: Account numbers are searched as exact numeric matches
- **Multi-field**: The main search endpoint searches across name, email, mobile_no, and account_number simultaneously
- **Indexed fields**: name, email, mobile_no, and account_number are indexed for better performance
