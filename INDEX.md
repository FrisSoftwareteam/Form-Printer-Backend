# 📚 Documentation Index

Welcome to the Excel to MongoDB API documentation! This guide will help you navigate all available documentation.

## 🚀 Getting Started

**New to this project? Start here:**

1. **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes

   - Installation steps
   - Basic testing
   - Common commands

2. **[README.md](README.md)** - Complete project documentation
   - Features overview
   - API endpoints
   - Configuration guide
   - Project structure

## 📖 Detailed Guides

### For Developers

- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical overview

  - Architecture explanation
  - Upload flow diagram
  - Performance benchmarks
  - Code structure

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive testing
  - cURL examples
  - Postman setup
  - Security testing
  - Performance testing

### For DevOps

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment
  - Environment setup
  - Deployment options (Heroku, AWS, Docker)
  - Security hardening
  - Monitoring setup

## 📁 Key Files

### Configuration

- `.env` - Environment variables (already configured)
- `.env.example` - Environment template
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

### Testing

- `POSTMAN_COLLECTION.json` - Postman API collection
- `scripts/generateTestData.js` - Test data generator

### Setup

- `setup.sh` - Automated setup script

## 🎯 Quick Navigation

### I want to...

**...get started quickly**
→ [QUICKSTART.md](QUICKSTART.md)

**...understand the architecture**
→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

**...test the API**
→ [TESTING_GUIDE.md](TESTING_GUIDE.md)

**...deploy to production**
→ [DEPLOYMENT.md](DEPLOYMENT.md)

**...see all API endpoints**
→ [README.md](README.md#api-endpoints)

**...understand security features**
→ [README.md](README.md#security-features)

**...troubleshoot issues**
→ [TESTING_GUIDE.md](TESTING_GUIDE.md#common-issues)

## 📡 API Endpoints Quick Reference

| Endpoint             | Method | Auth          | Description              |
| -------------------- | ------ | ------------- | ------------------------ |
| `/api/auth/login`    | POST   | None          | Login and get JWT        |
| `/api/auth/register` | POST   | None          | Register new user        |
| `/api/upload`        | POST   | JWT + API Key | Upload Excel file        |
| `/api/refresh`       | POST   | JWT + API Key | Refresh collection data  |
| `/api/search`        | GET    | API Key       | Search by name           |
| `/api/search/:field` | GET    | API Key       | Search by any field      |
| `/api/data`          | GET    | API Key       | Get all data (paginated) |
| `/api/stats`         | GET    | API Key       | Get statistics           |
| `/api/collections`   | GET    | API Key       | List all collections     |
| `/health`            | GET    | None          | Health check             |

## 🔧 Common Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm start               # Run production build

# Testing
npm run generate-test-data        # Generate 100 rows
npm run generate-test-data 21000  # Generate 21k rows

# Setup
./setup.sh              # Run setup script
```

## 📦 Project Structure

```
PRESCOBack/
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.ts          # Entry point
├── scripts/               # Utility scripts
├── uploads/               # Temporary file storage
├── docs/                  # Documentation (this folder)
└── [config files]         # Various config files
```

## 🎓 Learning Path

### Beginner

1. Read [QUICKSTART.md](QUICKSTART.md)
2. Follow installation steps
3. Test with generated data
4. Try Postman collection

### Intermediate

1. Read [README.md](README.md)
2. Understand all endpoints
3. Test with your own Excel files
4. Explore [TESTING_GUIDE.md](TESTING_GUIDE.md)

### Advanced

1. Study [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
2. Review source code structure
3. Customize for your needs
4. Deploy using [DEPLOYMENT.md](DEPLOYMENT.md)

## 🔐 Security Checklist

- [ ] Changed default `JWT_SECRET`
- [ ] Changed default `API_KEY`
- [ ] Updated `ADMIN_PASSWORD`
- [ ] Configured `ALLOWED_ORIGINS`
- [ ] Using HTTPS in production
- [ ] MongoDB authentication enabled
- [ ] Regular dependency updates

## 🐛 Troubleshooting

**Problem:** Can't connect to MongoDB
**Solution:** Check [TESTING_GUIDE.md - Common Issues](TESTING_GUIDE.md#common-issues)

**Problem:** File upload fails
**Solution:** Check [TESTING_GUIDE.md - Common Issues](TESTING_GUIDE.md#common-issues)

**Problem:** Authentication errors
**Solution:** Verify JWT token and API key

**Problem:** Deployment issues
**Solution:** Check [DEPLOYMENT.md - Troubleshooting](DEPLOYMENT.md#troubleshooting-production-issues)

## 📞 Support Resources

- **Documentation**: You're reading it!
- **Postman Collection**: `POSTMAN_COLLECTION.json`
- **Example Data**: Run `npm run generate-test-data`
- **Logs**: Check console output for detailed errors

## 🎯 Next Steps

1. ✅ Read [QUICKSTART.md](QUICKSTART.md)
2. ✅ Install and run the project
3. ✅ Test with sample data
4. ✅ Upload your own Excel files
5. ✅ Deploy to production (when ready)

---

**Happy coding!** 🚀

Need help? Start with [QUICKSTART.md](QUICKSTART.md) or check [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed examples.
