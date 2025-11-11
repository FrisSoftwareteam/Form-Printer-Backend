# 🚀 Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or remote)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

The `.env` file is already created with default values. Update if needed:

```bash
# Edit .env file
# Update MONGO_URI if using remote MongoDB
# Change JWT_SECRET for production
# Set your API_KEY
```

### 3. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud) - update MONGO_URI in .env
```

### 4. Start the Server

```bash
npm run dev
```

You should see:

```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000 in development mode
```

## Test the API (3 Simple Steps)

### Step 1: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Copy the `token` from the response.

### Step 2: Generate Test Data

```bash
npm run generate-test-data 100
```

This creates `test_data.xlsx` with 100 sample rows.

### Step 3: Upload Excel File

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-api-key: your_api_key_here" \
  -F "file=@test_data.xlsx"
```

### Step 4: Search Data

```bash
curl -X GET "http://localhost:5000/api/search?name=John&page=1&limit=5" \
  -H "x-api-key: your_api_key_here"
```

## 🎉 Success!

You now have a fully functional Excel to MongoDB API!

## Next Steps

1. **Import Postman Collection**: Import `POSTMAN_COLLECTION.json` for easier testing
2. **Read Full Documentation**: Check `README.md` for all endpoints
3. **Test with Your Data**: Upload your own Excel files
4. **Explore Search**: Try different search queries

## Common Commands

```bash
# Development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Generate test data (custom size)
npm run generate-test-data 21000 large_data.xlsx
```

## API Endpoints Summary

| Method | Endpoint           | Description     | Auth          |
| ------ | ------------------ | --------------- | ------------- |
| POST   | /api/auth/login    | Get JWT token   | None          |
| POST   | /api/upload        | Upload Excel    | JWT + API Key |
| GET    | /api/search        | Search by name  | API Key       |
| GET    | /api/search/:field | Search by field | API Key       |
| GET    | /api/data          | Get all data    | API Key       |
| GET    | /api/stats         | Get statistics  | API Key       |

## Need Help?

- **Full Documentation**: `README.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **Project Overview**: `PROJECT_SUMMARY.md`
- **Postman Collection**: `POSTMAN_COLLECTION.json`

## Troubleshooting

**MongoDB not connecting?**

```bash
# Check if MongoDB is running
mongosh
```

**Port 5000 already in use?**

```bash
# Change PORT in .env
PORT=3000
```

**File upload fails?**

- Check file is .xlsx or .xls
- Max file size is 50MB
- Ensure uploads/ directory exists

---

**You're all set!** 🎊
