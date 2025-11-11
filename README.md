# Excel to MongoDB API

A complete backend service built with Node.js, Express, TypeScript, and MongoDB that allows uploading Excel files and provides powerful search and data management APIs.

## Features

- 📊 Upload Excel files (.xlsx, .xls) and automatically create MongoDB collections
- 🔍 Search by name or any field with pagination
- 🔐 JWT-based authentication for protected routes
- 🛡️ Security features: helmet, CORS, rate limiting, input sanitization
- ⚡ Efficient bulk insert for 21k+ rows
- 📈 Statistics and metadata tracking
- 🔑 API key validation

## Tech Stack

- Node.js + Express.js (TypeScript)
- MongoDB + Mongoose
- Multer (file uploads)
- xlsx (Excel parsing)
- JWT authentication
- express-validator (input validation)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create uploads directory:

```bash
mkdir uploads
```

4. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

5. Update `.env` with your configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/excel_db
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
API_KEY=your_api_key
```

## Running the Application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com"
  }
}
```

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Upload & Data Management

#### Upload Excel File

```
POST /api/upload
Headers:
  Authorization: Bearer <token>
  x-api-key: <your_api_key>
Content-Type: multipart/form-data

Form Data:
  file: <excel_file>
  collectionName: mydata (optional)

Response:
{
  "success": true,
  "message": "File uploaded and processed successfully",
  "data": {
    "collectionName": "mydata",
    "totalRows": 21000,
    "fields": ["name", "email", "phone", ...],
    "uploadedAt": "2025-11-11T..."
  }
}
```

#### Refresh Data

```
POST /api/refresh
Headers:
  Authorization: Bearer <token>
  x-api-key: <your_api_key>
Content-Type: multipart/form-data

Form Data:
  file: <new_excel_file>
  collectionName: mydata
```

### Search & Query

#### Search by Name

```
GET /api/search?name=John&page=1&limit=10
Headers:
  x-api-key: <your_api_key>

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

#### Search by Field

```
GET /api/search/email?value=john@example.com&page=1&limit=10
Headers:
  x-api-key: <your_api_key>
```

#### Get All Data (Paginated)

```
GET /api/data?page=1&limit=10&collection=mydata
Headers:
  x-api-key: <your_api_key>
```

#### Get Statistics

```
GET /api/stats?collection=mydata
Headers:
  x-api-key: <your_api_key>

Response:
{
  "success": true,
  "stats": {
    "collectionName": "mydata",
    "originalFileName": "users.xlsx",
    "totalRows": 21000,
    "fields": ["name", "email", "phone"],
    "uploadedAt": "2025-11-11T...",
    "uploadedBy": "admin@example.com"
  }
}
```

#### Get All Collections

```
GET /api/collections
Headers:
  x-api-key: <your_api_key>
```

## How It Works

### Upload and Parsing Flow

1. **File Upload**: Client uploads Excel file via multipart/form-data
2. **Validation**: Multer validates file type (.xlsx, .xls) and size (max 50MB)
3. **Parsing**: xlsx library reads the Excel file and extracts:
   - Sheet name (used as collection name)
   - Header row (becomes MongoDB field names)
   - All data rows
4. **Schema Creation**: Dynamic Mongoose schema is created based on headers
5. **Bulk Insert**: Data is inserted in chunks of 1000 documents for optimal performance
6. **Metadata Storage**: Upload metadata is saved for tracking and statistics
7. **Cleanup**: Temporary uploaded file is deleted

### Security Features

- JWT authentication for protected routes
- API key validation for all endpoints
- Rate limiting (100 requests per 15 minutes)
- Input sanitization against NoSQL injection
- CORS with configurable origins
- Helmet for security headers
- Password hashing with bcrypt

## Testing with Postman

1. **Login** to get JWT token:

   - POST `http://localhost:5000/api/auth/login`
   - Body: `{"email": "admin@example.com", "password": "admin123"}`
   - Save the returned token

2. **Upload Excel**:

   - POST `http://localhost:5000/api/upload`
   - Headers:
     - `Authorization: Bearer <token>`
     - `x-api-key: your_api_key`
   - Body: form-data with key `file` and your Excel file

3. **Search**:
   - GET `http://localhost:5000/api/search?name=John`
   - Headers: `x-api-key: your_api_key`

## Example Request/Response for /api/search?name=John

### Request

```bash
curl -X GET "http://localhost:5000/api/search?name=John&page=1&limit=10" \
  -H "x-api-key: your_api_key_here"
```

### Response

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
    },
    {
      "_id": "673234abc123def456789013",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "phone": "555-5678",
      "address": "456 Oak Ave",
      "city": "Los Angeles",
      "age": 42,
      "department": "Sales",
      "salary": 72000,
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

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Upload Excel
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer <token>" \
  -H "x-api-key: your_api_key" \
  -F "file=@/path/to/your/file.xlsx"

# Search by name
curl -X GET "http://localhost:5000/api/search?name=John&page=1&limit=10" \
  -H "x-api-key: your_api_key"

# Get all data
curl -X GET "http://localhost:5000/api/data?page=1&limit=10" \
  -H "x-api-key: your_api_key"
```

## Project Structure

```
.
├── src/
│   ├── config/
│   │   ├── database.ts       # MongoDB connection
│   │   └── multer.ts         # File upload configuration
│   ├── controllers/
│   │   ├── authController.ts # Authentication logic
│   │   ├── uploadController.ts # Upload handling
│   │   └── dataController.ts # Search and query logic
│   ├── middleware/
│   │   ├── auth.ts           # JWT & API key validation
│   │   ├── errorHandler.ts   # Global error handler
│   │   ├── rateLimiter.ts    # Rate limiting
│   │   └── validation.ts     # Input validation
│   ├── models/
│   │   ├── User.ts           # User model
│   │   └── UploadMetadata.ts # Upload tracking
│   ├── routes/
│   │   ├── authRoutes.ts     # Auth endpoints
│   │   ├── uploadRoutes.ts   # Upload endpoints
│   │   └── dataRoutes.ts     # Data query endpoints
│   ├── utils/
│   │   ├── excelParser.ts    # Excel parsing logic
│   │   ├── dynamicModel.ts   # Dynamic schema creation
│   │   └── jwt.ts            # JWT utilities
│   └── server.ts             # Entry point
├── uploads/                  # Temporary file storage
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Performance Notes

- Bulk insert processes 21k+ rows in chunks of 1000 for optimal memory usage
- Indexes are automatically created on all fields for faster searches
- Text indexes on name/email/phone fields for full-text search
- Pagination prevents memory issues with large datasets

## License

MIT
