# Testing Guide

## Quick Start Testing

### 1. Start the Server

```bash
npm install
npm run dev
```

Server should start on `http://localhost:5000`

### 2. Test with cURL

#### Step 1: Login to get JWT token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com"
  }
}
```

Save the token for next requests!

#### Step 2: Upload Excel File

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-api-key: your_api_key_here" \
  -F "file=@/path/to/your/file.xlsx" \
  -F "collectionName=users"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "File uploaded and processed successfully",
  "data": {
    "collectionName": "users",
    "totalRows": 21000,
    "fields": ["name", "email", "phone", "address"],
    "uploadedAt": "2025-11-11T..."
  }
}
```

#### Step 3: Search by Name

```bash
curl -X GET "http://localhost:5000/api/search?name=John&page=1&limit=10" \
  -H "x-api-key: your_api_key_here"
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "createdAt": "2025-11-11T..."
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

#### Step 4: Search by Email

```bash
curl -X GET "http://localhost:5000/api/search/email?value=john@example.com" \
  -H "x-api-key: your_api_key_here"
```

#### Step 5: Get All Data (Paginated)

```bash
curl -X GET "http://localhost:5000/api/data?page=1&limit=10" \
  -H "x-api-key: your_api_key_here"
```

#### Step 6: Get Statistics

```bash
curl -X GET "http://localhost:5000/api/stats" \
  -H "x-api-key: your_api_key_here"
```

**Expected Response:**

```json
{
  "success": true,
  "stats": {
    "collectionName": "users",
    "originalFileName": "data.xlsx",
    "totalRows": 21000,
    "fields": ["name", "email", "phone"],
    "uploadedAt": "2025-11-11T...",
    "uploadedBy": "admin@example.com"
  }
}
```

#### Step 7: Get All Collections

```bash
curl -X GET "http://localhost:5000/api/collections" \
  -H "x-api-key: your_api_key_here"
```

### 3. Test with Postman

1. Import `POSTMAN_COLLECTION.json` into Postman
2. Update collection variables:
   - `baseUrl`: `http://localhost:5000`
   - `apiKey`: Your API key from `.env`
3. Run "Login" request first (token will be saved automatically)
4. Run other requests in order

## Creating Test Excel File

If you don't have a test Excel file, create one with these columns:

| name       | email            | phone    | address     | city        |
| ---------- | ---------------- | -------- | ----------- | ----------- |
| John Doe   | john@example.com | 555-1234 | 123 Main St | New York    |
| Jane Smith | jane@example.com | 555-5678 | 456 Oak Ave | Los Angeles |
| ...        | ...              | ...      | ...         | ...         |

Save as `test_data.xlsx`

## Common Issues

### Issue: "Invalid or missing API key"

**Solution:** Make sure you set `x-api-key` header with the value from your `.env` file

### Issue: "Not authorized to access this route"

**Solution:**

1. Login first to get JWT token
2. Add `Authorization: Bearer <token>` header to protected routes

### Issue: "No collections found"

**Solution:** Upload an Excel file first using `/api/upload`

### Issue: "MongoDB connection error"

**Solution:**

1. Make sure MongoDB is running
2. Check `MONGO_URI` in `.env` file
3. For local MongoDB: `mongodb://localhost:27017/excel_db`

### Issue: "Only Excel files (.xlsx, .xls) are allowed"

**Solution:** Make sure you're uploading a valid Excel file with .xlsx or .xls extension

## Performance Testing

For testing with large files (21k+ rows):

```bash
# Monitor upload progress
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-api-key: your_api_key" \
  -F "file=@large_file.xlsx" \
  --progress-bar
```

Expected performance:

- 21,000 rows: ~5-10 seconds
- 50,000 rows: ~15-20 seconds
- 100,000 rows: ~30-40 seconds

## Security Testing

### Test Rate Limiting

Run this command 101 times quickly:

```bash
for i in {1..101}; do
  curl -X GET "http://localhost:5000/api/data?page=1&limit=1" \
    -H "x-api-key: your_api_key"
done
```

After 100 requests, you should get:

```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

### Test Invalid JWT

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer invalid_token" \
  -H "x-api-key: your_api_key" \
  -F "file=@test.xlsx"
```

Expected: 401 Unauthorized

### Test SQL Injection Protection

```bash
curl -X GET "http://localhost:5000/api/search?name=\$ne:null" \
  -H "x-api-key: your_api_key"
```

Should be sanitized and return no malicious results.

## Example Test Workflow

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Upload file
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-api-key: your_api_key_here" \
  -F "file=@test_data.xlsx"

# 3. Search
curl -X GET "http://localhost:5000/api/search?name=John" \
  -H "x-api-key: your_api_key_here"

# 4. Get stats
curl -X GET "http://localhost:5000/api/stats" \
  -H "x-api-key: your_api_key_here"
```

## Monitoring Logs

Watch server logs for detailed information:

```bash
npm run dev
```

Look for:

- ✅ MongoDB Connected
- 📁 Processing file
- 📊 Creating/updating collection
- ✅ Inserted chunk X: Y documents
- 🗑️ Cleared X existing documents
