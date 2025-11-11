# 📡 API Documentation

Complete API reference for Excel to MongoDB service.

## Base URL

```
Development: http://localhost:5000
Production: https://your-domain.com
```

## Authentication

### API Key (Required for most endpoints)

Include in request headers:

```
x-api-key: your_api_key_here
```

### JWT Token (Required for protected routes)

Include in request headers:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Authentication

#### 1.1 Login

Get JWT token for authentication.

**Endpoint:** `POST /api/auth/login`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673234abc123def456789012",
    "email": "admin@example.com"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

#### 1.2 Register

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673234abc123def456789013",
    "email": "newuser@example.com"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "User already exists"
}
```

---

### 2. Upload Management

#### 2.1 Upload Excel File

Upload an Excel file and create/update MongoDB collection.

**Endpoint:** `POST /api/upload`

**Authentication:** JWT Token + API Key

**Headers:**

```
Authorization: Bearer <token>
x-api-key: your_api_key_here
Content-Type: multipart/form-data
```

**Form Data:**

- `file` (required): Excel file (.xlsx or .xls)
- `collectionName` (optional): Custom collection name

**Success Response (200):**

```json
{
  "success": true,
  "message": "File uploaded and processed successfully",
  "data": {
    "collectionName": "users",
    "totalRows": 21000,
    "fields": [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "age",
      "department",
      "salary"
    ],
    "uploadedAt": "2025-11-11T10:30:00.000Z"
  }
}
```

**Error Responses:**

_No file uploaded (400):_

```json
{
  "success": false,
  "error": "No file uploaded"
}
```

_Invalid file type (400):_

```json
{
  "success": false,
  "error": "Only Excel files (.xlsx, .xls) are allowed"
}
```

_Unauthorized (401):_

```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

---

#### 2.2 Refresh Collection Data

Replace existing collection data with new Excel file.

**Endpoint:** `POST /api/refresh`

**Authentication:** JWT Token + API Key

**Headers:**

```
Authorization: Bearer <token>
x-api-key: your_api_key_here
Content-Type: multipart/form-data
```

**Form Data:**

- `file` (required): Excel file (.xlsx or .xls)
- `collectionName` (optional): Collection to refresh

**Response:** Same as Upload Excel File

---

### 3. Search & Query

#### 3.1 Search by Name

Search for records where any field containing "name" matches the query.

**Endpoint:** `GET /api/search`

**Authentication:** API Key

**Headers:**

```
x-api-key: your_api_key_here
```

**Query Parameters:**

- `name` (required): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 1000)
- `collection` (optional): Collection name (default: latest uploaded)

**Example Request:**

```
GET /api/search?name=John&page=1&limit=10
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "673234abc123def456789012",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "555-1234",
      "address": "123 Main St",
      "city": "New York",
      "age": 35,
      "department": "Engineering",
      "salary": 85000,
      "createdAt": "2025-11-11T10:30:00.000Z",
      "updatedAt": "2025-11-11T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Name query parameter is required"
}
```

---

#### 3.2 Search by Field

Search for records by any specific field.

**Endpoint:** `GET /api/search/:field`

**Authentication:** API Key

**Headers:**

```
x-api-key: your_api_key_here
```

**Path Parameters:**

- `field`: Field name to search (e.g., email, phone, city)

**Query Parameters:**

- `value` (required): Search value
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 1000)
- `collection` (optional): Collection name

**Example Requests:**

```
GET /api/search/email?value=john@example.com
GET /api/search/phone?value=555-1234&page=1&limit=5
GET /api/search/city?value=New York
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "673234abc123def456789012",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "city": "New York"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Error Responses:**

_Missing value (400):_

```json
{
  "success": false,
  "error": "Value query parameter is required"
}
```

_Invalid field (400):_

```json
{
  "success": false,
  "error": "Field 'invalid_field' does not exist in collection"
}
```

---

#### 3.3 Get All Data

Retrieve all records with pagination.

**Endpoint:** `GET /api/data`

**Authentication:** API Key

**Headers:**

```
x-api-key: your_api_key_here
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 1000)
- `collection` (optional): Collection name

**Example Request:**

```
GET /api/data?page=1&limit=20
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "673234abc123def456789012",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-1234"
    },
    {
      "_id": "673234abc123def456789013",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "555-5678"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 21000,
    "pages": 1050
  }
}
```

---

#### 3.4 Get Statistics

Get metadata about uploaded collections.

**Endpoint:** `GET /api/stats`

**Authentication:** API Key

**Headers:**

```
x-api-key: your_api_key_here
```

**Query Parameters:**

- `collection` (optional): Collection name (default: latest uploaded)

**Example Request:**

```
GET /api/stats?collection=users
```

**Success Response (200):**

```json
{
  "success": true,
  "stats": {
    "collectionName": "users",
    "originalFileName": "employees_data.xlsx",
    "totalRows": 21000,
    "fields": [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "age",
      "department",
      "salary"
    ],
    "uploadedAt": "2025-11-11T10:30:00.000Z",
    "uploadedBy": "admin@example.com"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "No upload metadata found"
}
```

---

#### 3.5 Get All Collections

List all uploaded collections.

**Endpoint:** `GET /api/collections`

**Authentication:** API Key

**Headers:**

```
x-api-key: your_api_key_here
```

**Success Response (200):**

```json
{
  "success": true,
  "collections": [
    {
      "name": "users",
      "totalRows": 21000,
      "fields": ["name", "email", "phone"],
      "uploadedAt": "2025-11-11T10:30:00.000Z"
    },
    {
      "name": "customers",
      "totalRows": 5000,
      "fields": ["customer_name", "email", "country"],
      "uploadedAt": "2025-11-10T15:20:00.000Z"
    }
  ]
}
```

---

### 4. Health Check

#### 4.1 Health Status

Check if the API is running.

**Endpoint:** `GET /health`

**Authentication:** None

**Success Response (200):**

```json
{
  "status": "OK",
  "timestamp": "2025-11-11T10:30:00.000Z"
}
```

---

## Error Codes

| Code | Description                             |
| ---- | --------------------------------------- |
| 200  | Success                                 |
| 201  | Created                                 |
| 400  | Bad Request (validation error)          |
| 401  | Unauthorized (invalid/missing token)    |
| 403  | Forbidden (invalid API key)             |
| 404  | Not Found                               |
| 429  | Too Many Requests (rate limit exceeded) |
| 500  | Internal Server Error                   |

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Response when exceeded:**

```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## File Upload Specifications

### Supported Formats

- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

### File Size Limit

- Maximum: 50 MB

### Excel File Requirements

- Must have a header row (first row)
- Headers will be converted to lowercase
- Special characters in headers replaced with underscores
- Empty cells will be stored as `null`

### Example Excel Structure

| Name       | Email            | Phone    | City        |
| ---------- | ---------------- | -------- | ----------- |
| John Doe   | john@example.com | 555-1234 | New York    |
| Jane Smith | jane@example.com | 555-5678 | Los Angeles |

Becomes MongoDB documents:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "city": "New York"
}
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**

- `page`: Page number (starts at 1)
- `limit`: Items per page (max 1000)

**Response Format:**

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 21000,
    "pages": 2100
  }
}
```

---

## Search Behavior

### Case Insensitive

All searches are case-insensitive:

- `John` matches `john`, `JOHN`, `JoHn`

### Partial Matching

Searches use regex for partial matching:

- `John` matches `John Doe`, `Johnny`, `Johnson`

### Multiple Fields

Name search checks all fields containing "name":

- `name`, `first_name`, `last_name`, `full_name`

---

## Best Practices

### 1. Authentication

```bash
# Always store token securely
TOKEN=$(curl -s POST .../login | jq -r '.token')

# Use token in subsequent requests
curl -H "Authorization: Bearer $TOKEN" ...
```

### 2. Pagination

```bash
# Start with small page size
GET /api/data?page=1&limit=10

# Increase if needed
GET /api/data?page=1&limit=100
```

### 3. Error Handling

```javascript
try {
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": apiKey,
    },
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    console.error("Error:", data.error);
  }
} catch (error) {
  console.error("Network error:", error);
}
```

### 4. Large File Uploads

```bash
# Show progress
curl -X POST /api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-api-key: $API_KEY" \
  -F "file=@large_file.xlsx" \
  --progress-bar
```

---

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// Login
const login = async () => {
  const response = await axios.post("http://localhost:5000/api/auth/login", {
    email: "admin@example.com",
    password: "admin123",
  });
  return response.data.token;
};

// Upload Excel
const uploadExcel = async (token, filePath) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const response = await axios.post(
    "http://localhost:5000/api/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": "your_api_key_here",
        ...formData.getHeaders(),
      },
    }
  );

  return response.data;
};

// Search
const search = async (name) => {
  const response = await axios.get("http://localhost:5000/api/search", {
    params: { name, page: 1, limit: 10 },
    headers: { "x-api-key": "your_api_key_here" },
  });

  return response.data;
};
```

### Python

```python
import requests

# Login
def login():
    response = requests.post('http://localhost:5000/api/auth/login', json={
        'email': 'admin@example.com',
        'password': 'admin123'
    })
    return response.json()['token']

# Upload Excel
def upload_excel(token, file_path):
    with open(file_path, 'rb') as f:
        files = {'file': f}
        headers = {
            'Authorization': f'Bearer {token}',
            'x-api-key': 'your_api_key_here'
        }
        response = requests.post('http://localhost:5000/api/upload',
                                files=files, headers=headers)
        return response.json()

# Search
def search(name):
    params = {'name': name, 'page': 1, 'limit': 10}
    headers = {'x-api-key': 'your_api_key_here'}
    response = requests.get('http://localhost:5000/api/search',
                           params=params, headers=headers)
    return response.json()
```

---

## Testing with Postman

1. Import `POSTMAN_COLLECTION.json`
2. Set collection variables:
   - `baseUrl`: `http://localhost:5000`
   - `apiKey`: Your API key
3. Run "Login" request (token saved automatically)
4. Test other endpoints

---

**For more examples, see [TESTING_GUIDE.md](TESTING_GUIDE.md)**
