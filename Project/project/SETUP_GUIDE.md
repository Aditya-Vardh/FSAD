# SettleUp - Complete Setup Guide

This guide will walk you through setting up and running the SettleUp application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB**
   - Option A: Local MongoDB installation
     - Download from: https://www.mongodb.com/try/download/community
   - Option B: MongoDB Atlas (Cloud - Free tier available)
     - Sign up at: https://www.mongodb.com/cloud/atlas

3. **Code Editor** (Recommended: VS Code)
   - Download from: https://code.visualstudio.com/

4. **Git** (Optional, for version control)
   - Download from: https://git-scm.com/

## Step-by-Step Setup

### Step 1: Clone/Navigate to Project

If you have the project files, navigate to the project directory:
```bash
cd project
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
   - Create a file named `.env` in the `backend` directory
   - Copy the contents from `.env.example` or create with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/settleup
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

   **For MongoDB Atlas:**
   - Replace `MONGODB_URI` with your Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/settleup`

4. **Start MongoDB (if using local installation):**
   - **Windows:** Open Command Prompt as Administrator and run:
     ```bash
     mongod
     ```
   - **Mac/Linux:**
     ```bash
     sudo systemctl start mongod
     # or
     brew services start mongodb-community
     ```

5. **Start the backend server:**
```bash
npm start
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

**Keep this terminal window open!**

### Step 3: Frontend Setup

1. **Open a new terminal window** and navigate to the project root:
```bash
cd project
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file (optional):**
   - Create a file named `.env` in the project root
   - Add:
```env
VITE_API_URL=http://localhost:5000/api
```

   Note: This is optional as the default is already set to `http://localhost:5000/api`

4. **Start the frontend development server:**
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 4: Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:5173`
3. You should see the SettleUp login page

### Step 5: Create Your First Account

1. Click "Register here" or navigate to `/register`
2. Fill in:
   - Name: Your full name
   - Email: Your email address
   - Password: At least 6 characters
3. Click "Register"
4. You'll be automatically logged in and redirected to the dashboard

## Testing the Application

### Test Flow:

1. **Create a Group:**
   - Click "Groups" in the navbar
   - Click "Create Group"
   - Enter name and description
   - Click "Create"

2. **Add Members (Optional):**
   - Currently, groups are created with just you as a member
   - To add members, you'll need to register additional accounts

3. **Add an Expense:**
   - Click on a group to view details
   - Click "Add Expense"
   - Fill in:
     - Description: e.g., "Dinner"
     - Amount: e.g., 100.00
     - Paid By: Select yourself
     - Split Type: Choose "Equal Split" or "Custom Split"
   - Click "Add Expense"

4. **View Balances:**
   - The balances table will show who owes what
   - Net balance shows the final amount

5. **Settle Payment:**
   - Click "Settle Up"
   - Select the person you're paying
   - Enter the amount
   - Click "Settle"

## Troubleshooting

### Backend Issues

**Problem: MongoDB connection error**
```
Solution:
1. Ensure MongoDB is running (check with: mongosh)
2. Verify MONGODB_URI in .env is correct
3. For Atlas: Check your IP is whitelisted
```

**Problem: Port 5000 already in use**
```
Solution:
1. Change PORT in backend/.env to another port (e.g., 5001)
2. Update VITE_API_URL in frontend/.env accordingly
```

**Problem: Module not found errors**
```
Solution:
1. Delete node_modules folder
2. Delete package-lock.json
3. Run: npm install
```

### Frontend Issues

**Problem: Cannot connect to API**
```
Solution:
1. Ensure backend is running on port 5000
2. Check VITE_API_URL in .env
3. Check browser console for CORS errors
```

**Problem: Port 5173 already in use**
```
Solution:
Vite will automatically use the next available port
Check the terminal for the actual port number
```

**Problem: Blank page or errors**
```
Solution:
1. Check browser console (F12) for errors
2. Clear browser cache
3. Restart the dev server
```

### Common Errors

**Error: "Authentication required"**
- You're not logged in
- Solution: Go to `/login` and log in

**Error: "Group not found"**
- The group ID is invalid or you're not a member
- Solution: Go back to Groups page and select a valid group

**Error: "Validation failed"**
- Check that all required fields are filled
- Ensure amounts are positive numbers
- Check email format is correct

## Production Build

### Frontend Build

1. **Build for production:**
```bash
npm run build
```

2. **Preview production build:**
```bash
npm run preview
```

3. **Deploy:**
   - The `dist` folder contains the production build
   - Deploy to any static hosting (Vercel, Netlify, etc.)

### Backend Deployment

1. **Set environment variables:**
   - `NODE_ENV=production`
   - `JWT_SECRET`: Use a strong, random secret
   - `MONGODB_URI`: Your production MongoDB URI

2. **Deploy to:**
   - Heroku
   - Railway
   - DigitalOcean
   - AWS
   - Any Node.js hosting platform

## Project Structure Overview

```
project/
├── backend/              # Backend API
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Server entry point
│   └── package.json     # Backend dependencies
├── src/                 # Frontend React app
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── utils/           # Utilities
│   └── App.tsx          # Main app
├── README.md            # Main documentation
├── API_DOCUMENTATION.md # API reference
└── SETUP_GUIDE.md      # This file
```

## Next Steps

1. **Explore the codebase** to understand the structure
2. **Read API_DOCUMENTATION.md** for API details
3. **Read CLAYMORPHISM_EXPLANATION.md** for design details
4. **Customize** the application for your needs
5. **Add features** like email notifications, export to PDF, etc.

## Support

If you encounter any issues:
1. Check the error messages in the console
2. Review the documentation files
3. Ensure all prerequisites are installed
4. Verify environment variables are set correctly

## Success Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] Can access the login page
- [ ] Can register a new account
- [ ] Can log in
- [ ] Can create a group
- [ ] Can add an expense
- [ ] Can view balances
- [ ] Can settle payments

Once all items are checked, your SettleUp application is fully functional! 🎉
