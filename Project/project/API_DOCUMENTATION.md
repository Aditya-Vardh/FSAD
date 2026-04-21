# SettleUp API Documentation

Complete API reference for the SettleUp backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400`: Validation failed
- `400`: User with this email already exists
- `500`: Server error

---

### Login
**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400`: Validation failed
- `401`: Invalid email or password
- `500`: Server error

---

## Groups Endpoints

### Get All Groups
**GET** `/groups`

Get all groups where the authenticated user is a member.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Weekend Trip",
    "description": "Trip expenses",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "createdAt": "2026-01-26T10:00:00.000Z",
    "updatedAt": "2026-01-26T10:00:00.000Z"
  }
]
```

---

### Get Single Group
**GET** `/groups/:id`

Get details of a specific group.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Weekend Trip",
  "description": "Trip expenses",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "members": [...],
  "createdAt": "2026-01-26T10:00:00.000Z",
  "updatedAt": "2026-01-26T10:00:00.000Z"
}
```

**Error Responses:**
- `404`: Group not found
- `500`: Server error

---

### Create Group
**POST** `/groups`

Create a new group.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Weekend Trip",
  "description": "Trip expenses",
  "members": ["507f1f77bcf86cd799439012"]
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Weekend Trip",
  "description": "Trip expenses",
  "createdBy": {...},
  "members": [...],
  "createdAt": "2026-01-26T10:00:00.000Z",
  "updatedAt": "2026-01-26T10:00:00.000Z"
}
```

**Error Responses:**
- `400`: Validation failed
- `500`: Server error

---

### Update Group
**PUT** `/groups/:id`

Update group details. Only members can update.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "members": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Updated Name",
  ...
}
```

**Error Responses:**
- `400`: Validation failed
- `404`: Group not found
- `500`: Server error

---

### Delete Group
**DELETE** `/groups/:id`

Delete a group. Only the creator can delete.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Group deleted successfully"
}
```

**Error Responses:**
- `404`: Group not found or not the creator
- `500`: Server error

---

## Expenses Endpoints

### Get Expenses for Group
**GET** `/expenses/group/:groupId`

Get all expenses for a specific group.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "description": "Dinner",
    "amount": 120.50,
    "paidBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "group": "507f1f77bcf86cd799439012",
    "splitType": "equal",
    "splits": [
      {
        "user": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe"
        },
        "amount": 40.17
      },
      {
        "user": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Jane Smith"
        },
        "amount": 40.17
      }
    ],
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
]
```

---

### Create Expense
**POST** `/expenses`

Add a new expense to a group.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (Equal Split):**
```json
{
  "description": "Dinner",
  "amount": 120.50,
  "paidBy": "507f1f77bcf86cd799439011",
  "group": "507f1f77bcf86cd799439012",
  "splitType": "equal"
}
```

**Request Body (Custom Split):**
```json
{
  "description": "Dinner",
  "amount": 120.50,
  "paidBy": "507f1f77bcf86cd799439011",
  "group": "507f1f77bcf86cd799439012",
  "splitType": "custom",
  "splits": [
    {
      "user": "507f1f77bcf86cd799439011",
      "amount": 60.25
    },
    {
      "user": "507f1f77bcf86cd799439012",
      "amount": 60.25
    }
  ]
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "description": "Dinner",
  "amount": 120.50,
  "paidBy": {...},
  "group": {...},
  "splitType": "equal",
  "splits": [...],
  "createdAt": "2026-01-26T10:00:00.000Z"
}
```

**Error Responses:**
- `400`: Validation failed
- `400`: Payer must be a member of the group
- `400`: Split amounts must equal the total expense amount
- `404`: Group not found
- `500`: Server error

---

### Update Expense
**PUT** `/expenses/:id`

Update an expense. Only group members can update.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "Updated Dinner",
  "amount": 150.00
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "description": "Updated Dinner",
  "amount": 150.00,
  ...
}
```

**Error Responses:**
- `400`: Validation failed
- `403`: Not authorized
- `404`: Expense not found
- `500`: Server error

---

### Delete Expense
**DELETE** `/expenses/:id`

Delete an expense. Only group members can delete.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Expense deleted successfully"
}
```

**Error Responses:**
- `403`: Not authorized
- `404`: Expense not found
- `500`: Server error

---

## Settlements Endpoints

### Get Settlements for Group
**GET** `/settlements/group/:groupId`

Get all settlements for a group.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "fromUser": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "toUser": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "group": "507f1f77bcf86cd799439013",
    "amount": 50.00,
    "settledAt": "2026-01-26T10:00:00.000Z"
  }
]
```

---

### Get Balances for Group
**GET** `/settlements/balances/:groupId`

Calculate and return balances for all members in a group.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "507f1f77bcf86cd799439011": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "paid": 120.50,
    "owes": 80.25,
    "net": 40.25
  },
  "507f1f77bcf86cd799439012": {
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "paid": 0,
    "owes": 40.25,
    "net": -40.25
  }
}
```

**Error Responses:**
- `404`: Group not found
- `500`: Server error

---

### Create Settlement
**POST** `/settlements`

Record a payment settlement.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fromUser": "507f1f77bcf86cd799439011",
  "toUser": "507f1f77bcf86cd799439012",
  "group": "507f1f77bcf86cd799439013",
  "amount": 50.00
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fromUser": {...},
  "toUser": {...},
  "group": {...},
  "amount": 50.00,
  "settledAt": "2026-01-26T10:00:00.000Z"
}
```

**Error Responses:**
- `400`: Validation failed
- `400`: Both users must be members of the group
- `403`: You can only settle debts you owe
- `404`: Group not found
- `500`: Server error

---

## Dashboard Endpoints

### Get Dashboard Summary
**GET** `/dashboard/summary`

Get summary of all groups, total owed, and total to receive.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalOwed": 120.50,
  "totalToReceive": 80.25,
  "groups": [
    {
      "group": {
        "id": "507f1f77bcf86cd799439011",
        "name": "Weekend Trip",
        "description": "Trip expenses"
      },
      "balance": 40.25,
      "owed": 0,
      "toReceive": 40.25
    },
    {
      "group": {
        "id": "507f1f77bcf86cd799439012",
        "name": "House Rent",
        "description": "Monthly rent"
      },
      "balance": -80.25,
      "owed": 80.25,
      "toReceive": 0
    }
  ]
}
```

**Error Responses:**
- `500`: Server error

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error message here",
  "errors": [
    {
      "msg": "Validation error",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (not authorized)
- `404`: Not Found
- `500`: Internal Server Error
