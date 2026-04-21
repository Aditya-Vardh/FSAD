# SettleUp - Smart Bill Settlement & Expense Sharing System

A complete full-stack web application for managing group expenses and bill settlements, built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Group Management**: Create and manage expense groups with multiple members
- **Expense Tracking**: Add expenses with equal or custom split options
- **Real-time Balance Calculation**: Automatic calculation of who owes what
- **Settlement System**: Settle payments and update balances in real-time
- **Dashboard**: Overview of all groups, total owed, and total to receive
- **Modern UI**: Material Design base with Claymorphism applied to key elements

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Project Structure

```
project/
├── backend/
│   ├── models/          # MongoDB models (User, Group, Expense, Settlement)
│   ├── routes/          # API routes (auth, groups, expenses, settlements, dashboard)
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Express server setup
│   └── package.json     # Backend dependencies
├── src/
│   ├── components/      # Reusable components (Navbar, ProtectedRoute)
│   ├── contexts/        # React contexts (AuthContext)
│   ├── pages/           # Page components (Login, Register, Dashboard, Groups, GroupDetail)
│   ├── utils/           # Utility functions (API client)
│   ├── App.tsx          # Main app component with routing
│   └── main.tsx         # Entry point
└── package.json         # Frontend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/settleup
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On Windows
mongod

# On Mac/Linux
sudo systemctl start mongod
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root (optional, defaults to localhost:5000):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Documentation

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ name: string, email: string, password: string }`
- **Response**: `{ token: string, user: { id, name, email } }`

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: { id, name, email } }`

### Groups Endpoints

#### Get All Groups
- **GET** `/api/groups`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of groups

#### Get Single Group
- **GET** `/api/groups/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Group object

#### Create Group
- **POST** `/api/groups`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name: string, description?: string, members?: string[] }`
- **Response**: Created group

#### Update Group
- **PUT** `/api/groups/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name?: string, description?: string, members?: string[] }`
- **Response**: Updated group

#### Delete Group
- **DELETE** `/api/groups/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

### Expenses Endpoints

#### Get Expenses for Group
- **GET** `/api/expenses/group/:groupId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of expenses

#### Create Expense
- **POST** `/api/expenses`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: 
  ```json
  {
    "description": "string",
    "amount": number,
    "paidBy": "userId",
    "group": "groupId",
    "splitType": "equal" | "custom",
    "splits": [{"user": "userId", "amount": number}] // required if splitType is "custom"
  }
  ```
- **Response**: Created expense

#### Update Expense
- **PUT** `/api/expenses/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ description?: string, amount?: number }`
- **Response**: Updated expense

#### Delete Expense
- **DELETE** `/api/expenses/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: string }`

### Settlements Endpoints

#### Get Settlements for Group
- **GET** `/api/settlements/group/:groupId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of settlements

#### Get Balances for Group
- **GET** `/api/settlements/balances/:groupId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Object with user IDs as keys and balance objects as values

#### Create Settlement
- **POST** `/api/settlements`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ fromUser: "userId", toUser: "userId", group: "groupId", amount: number }`
- **Response**: Created settlement

### Dashboard Endpoints

#### Get Dashboard Summary
- **GET** `/api/dashboard/summary`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 
  ```json
  {
    "totalOwed": number,
    "totalToReceive": number,
    "groups": [
      {
        "group": { "id": string, "name": string, "description": string },
        "balance": number,
        "owed": number,
        "toReceive": number
      }
    ]
  }
  ```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Group Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  createdBy: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Collection
```javascript
{
  _id: ObjectId,
  description: String,
  amount: Number,
  paidBy: ObjectId (ref: User),
  group: ObjectId (ref: Group),
  splitType: "equal" | "custom",
  splits: [
    {
      user: ObjectId (ref: User),
      amount: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Settlement Collection
```javascript
{
  _id: ObjectId,
  fromUser: ObjectId (ref: User),
  toUser: ObjectId (ref: User),
  group: ObjectId (ref: Group),
  amount: Number,
  settledAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## UI/UX Design Philosophy

### Material Design Base
- Clean, structured layouts with proper spacing
- Consistent typography and color scheme
- Responsive grid system
- Standard input fields and tables

### Claymorphism Application
Claymorphism is applied **selectively** to enhance visual hierarchy:

1. **Primary Action Buttons**: Add Expense, Settle Bill, Create Group buttons use claymorphism for depth and prominence
2. **Dashboard Summary Cards**: The three main cards (Total Owed, To Receive, Net Balance) use claymorphism to draw attention
3. **NOT Applied To**:
   - Input fields (standard Material Design inputs)
   - Tables (clean, flat design)
   - Navbar (simple, flat design)

### Color Scheme
- Light theme with soft off-white/light gray background
- Primary purple gradient (#667eea to #764ba2)
- Green for positive balances
- Red for negative balances/owed amounts

## Error Handling

- Frontend: User-friendly error messages displayed in UI
- Backend: Proper HTTP status codes and error messages
- Input validation on both frontend and backend
- Authentication errors redirect to login

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes on frontend and backend
- Input validation and sanitization
- CORS configuration

## Running the Project

1. Start MongoDB
2. Start backend: `cd backend && npm start`
3. Start frontend: `npm run dev`
4. Open browser to `http://localhost:5173`

## Production Build

### Frontend
```bash
npm run build
```
Output will be in the `dist` folder.

### Backend
The backend is ready for production. Make sure to:
- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Configure MongoDB Atlas or production MongoDB instance
- Set up proper CORS origins

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env`
- For MongoDB Atlas, use the connection string provided

### CORS Errors
- Ensure backend is running on the correct port
- Check `VITE_API_URL` in frontend `.env`

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set correctly
- Verify token is being sent in Authorization header

## License

This project is created for educational purposes as part of a Full Stack Application Development course.
