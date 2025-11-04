# Date App Server

Backend API server for the date appointment application.

## Features

- Express.js REST API
- CORS enabled for cross-origin requests
- JSON file storage for date submissions
- Input validation for phone numbers and required fields

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will run on **http://localhost:5000**

## API Endpoints

### POST /api/save-date
Save a new date appointment.

**Request Body:**
```json
{
  "selectedDate": "2025-11-10",
  "phoneNumber": "123456789",
  "activities": ["Bowling 🎳", "Coffee ☕"],
  "activityDescription": "Bowling 🎳, Coffee ☕"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Date saved successfully! ❤️",
  "data": {
    "id": 1699123456789,
    "selectedDate": "2025-11-10",
    "phoneNumber": "123456789",
    "activities": ["Bowling 🎳", "Coffee ☕"],
    "activityDescription": "Bowling 🎳, Coffee ☕",
    "createdAt": "2025-11-04T12:00:00.000Z"
  }
}
```

### GET /api/dates
Retrieve all saved dates.

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

### GET /api/dates/:id
Retrieve a specific date by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

### GET /api/health
Health check endpoint.

**Response (200):**
```json
{
  "success": true,
  "message": "Server is running! ❤️",
  "timestamp": "2025-11-04T12:00:00.000Z"
}
```

## Data Storage

Date submissions are stored in `dates.json` file in the server directory.

## Validation

- Phone number must be exactly 9 digits
- `selectedDate` and `phoneNumber` are required fields
