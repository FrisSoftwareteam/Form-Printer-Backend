# Excel to MongoDB API - Project Summary

## 🎯 What This Project Does

This is a complete backend API service that:

1. Accepts Excel file uploads (.xlsx, .xls)
2. Automatically creates MongoDB collections from Excel data
3. Uses Excel headers as database field names
4. Efficiently inserts 21,000+ rows using bulk operations
5. Provides secure REST APIs for searching and querying data
6. Includes JWT authentication and API key validation

## 📁 Project Structure

```
PRESCOBack/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection setup
│   │   └── multer.ts            # File upload configuration
│   ├── controllers/
│   │   ├── authController.ts    # Login/register logic
│   │   ├── uploadController.ts  # Excel upload handling
│   │   └── dataController.ts    # Search & query operations
│   ├── middleware/
│   │   ├── auth.ts              # JWT & API key validation
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── rateLimiter.ts       # Rate limiting (100 req/15min)
│   │   └── validation.ts        # Input validation rules
│   ├── models/
│   │   ├── User.ts              # User authentication model
│   │   └── UploadMetadata.ts    # Upload tracking model
│   ├── routes/
│   │   ├── authRoutes.ts        # /api/auth/* routes
│   │   ├── uploadRoutes.ts      # /api/upload, /api/refresh
│   │   └── dataRoutes.ts        # /api/search, /api/data, /api/stats
│   ├── utils/
│   │   ├── excelParser.ts       # Excel file parsing logic
│   │   ├── dynamicModel.ts      # Dynamic schema creation
│   │   └── jwt.ts               # JWT token generation
│   └── server.ts                # Application entry point
├── scripts/
│   └── generateTestData.js      # Generate test Excel files
├── uploads/                     # Temporary file storage
├── .env                         # Environment configuration
├── .env.example                 # Environment template
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── POSTMAN_COLLECTION.json      # Postman API tests
├── TESTING_GUIDE.md             # Detailed testing instructions
├── README.md                    # Main documentation
└── setup.sh                     # Setup script

```

## 🔑 Key Features Implemented

### 1. Excel Upload & Processing

- **File validation**: Only .xlsx and .xls files (max 50MB)
- **Dynamic schema**: Creates MongoDB schema from Excel headers
- **Bulk insert**: Processes data in chunks of 1000 for performance
- **Header cleaning**: Converts headers to valid MongoDB field names
- **Metadata tracking**: Stores upload info (filename, rows, fields, timestamp)

### 2. Authentication & Security

- **JWT authentication**: Protects upload/refresh routes
- **API key validation**: Required for all endpoints
- **Rate limiting**: 100 requests per 15 minutes per IP
- **Input sanitization**: Prevents NoSQL injection attacks
- **Password hashing**: bcrypt with salt rounds
- **CORS protection**: Configurable allowed origins
- **Helmet.js**: Security headers

### 3. Search & Query APIs

- **Search by name**: Searches all fields containing "name"
- **Search by field**: Search any specific field (email, phone, etc.)
- **Pagination**: Configurable page size (default 10, max 1000)
- **Get all data**: Paginated retrieval of entire collection
- **Statistics**: Upload metadata and collection info
- **List collections**: View all uploaded collections

### 4. Performance Optimizations

- **Chunked inserts**: 1000 documents per batch
- **Indexed fields**: All fields automatically indexed
- **Text indexes**: Full-text search on name/email/phone
- **Lean queries**: Faster MongoDB queries
- **Streaming**: Efficient memory usage for large files

## 🚀 How to Run

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB (if not running)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB

# 3. Run development server
npm run dev
```

### Generate Test Data

```bash
# Generate 100 rows
npm run generate-test-data

# Generate 21,000 rows
npm run generate-test-data 21000 large_test.xlsx
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/register` - Register new user

### Upload (Protected)

- `POST /api/upload` - Upload Excel file
- `POST /api/refresh` - Replace collection data

### Query (API Key Required)

- `GET /api/search?name=John` - Search by name
- `GET /api/search/:field?value=test` - Search by any field
- `GET /api/data?page=1&limit=10` - Get all data
- `GET /api/stats` - Get upload statistics
- `GET /api/collections` - List all collections

## 🔐 Security Configuration

### Environment Variables (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/excel_db
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
API_KEY=your_api_key_here
ALLOWED_ORIGINS=http://localhost:3000
```

### Protected Routes

- Upload/Refresh: Require JWT token + API key
- Search/Query: Require API key only
- Auth: Public (no authentication)

## 📊 Upload Flow Explained

1. **Client uploads Excel file** via multipart/form-data
2. **Multer validates** file type and size
3. **xlsx library parses** Excel file:
   - Extracts sheet name → collection name
   - Reads header row → field names
   - Reads all data rows
4. **Headers are cleaned**:
   - Lowercase conversion
   - Special chars → underscores
   - Spaces → underscores
5. **Dynamic Mongoose model created** with:
   - Mixed type fields (flexible data types)
   - Indexes on all fields
   - Text indexes on name/email/phone
6. **Existing data cleared** from collection
7. **Bulk insert in chunks**:
   - 1000 documents per batch
   - Continues on duplicate errors
   - Logs progress per chunk
8. **Metadata saved** to UploadMetadata collection
9. **Temporary file deleted**
10. **Response sent** with stats

## 🧪 Testing

### With cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Upload (save token from login)
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-api-key: your_api_key_here" \
  -F "file=@test_data.xlsx"

# Search
curl -X GET "http://localhost:5000/api/search?name=John" \
  -H "x-api-key: your_api_key_here"
```

### With Postman

1. Import `POSTMAN_COLLECTION.json`
2. Set variables: `baseUrl`, `apiKey`
3. Run "Login" request (saves token automatically)
4. Test other endpoints

See `TESTING_GUIDE.md` for comprehensive testing instructions.

## 📦 Dependencies

### Production

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **multer**: File upload handling
- **xlsx**: Excel file parsing
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **helmet**: Security headers
- **cors**: CORS handling
- **express-rate-limit**: Rate limiting
- **express-mongo-sanitize**: NoSQL injection prevention
- **express-validator**: Input validation
- **dotenv**: Environment variables

### Development

- **typescript**: Type safety
- **tsx**: TypeScript execution
- **@types/\***: Type definitions

## 🎯 Performance Benchmarks

Expected performance on modern hardware:

| Rows    | Upload Time | Search Time | Memory Usage |
| ------- | ----------- | ----------- | ------------ |
| 1,000   | ~1-2 sec    | <100ms      | ~50MB        |
| 10,000  | ~3-5 sec    | <200ms      | ~100MB       |
| 21,000  | ~5-10 sec   | <300ms      | ~150MB       |
| 50,000  | ~15-20 sec  | <500ms      | ~250MB       |
| 100,000 | ~30-40 sec  | <1sec       | ~400MB       |

## 🛠️ Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port Already in Use

```bash
# Change PORT in .env file
PORT=3000
```

### File Upload Fails

- Check file size (max 50MB)
- Verify file extension (.xlsx or .xls)
- Ensure uploads/ directory exists

## 🔄 Future Enhancements (Optional)

- [ ] Add data validation rules per field
- [ ] Support CSV file uploads
- [ ] Add data export functionality
- [ ] Implement field type detection
- [ ] Add data transformation options
- [ ] Support multiple sheet uploads
- [ ] Add data versioning
- [ ] Implement soft deletes
- [ ] Add audit logging
- [ ] Create admin dashboard

## 📝 License

MIT

---

**Ready to use!** Just run `npm install && npm run dev` and start uploading Excel files.
