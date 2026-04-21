# Quick Start Guide

Get SettleUp running in 5 minutes!

## Prerequisites Check

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (local or Atlas)

## Quick Setup

### 1. Backend (Terminal 1)

```bash
cd backend
npm install
# Create .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/settleup
# JWT_SECRET=your_secret_key
npm start
```

### 2. Frontend (Terminal 2)

```bash
cd project  # (if not already there)
npm install
npm run dev
```

### 3. Open Browser

Go to: `http://localhost:5173`

### 4. Register & Start Using!

1. Click "Register here"
2. Create an account
3. Create a group
4. Add expenses
5. Settle up!

## That's it! 🎉

For detailed setup, see `SETUP_GUIDE.md`
For API docs, see `API_DOCUMENTATION.md`
