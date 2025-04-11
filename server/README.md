# Server Documentation

## Overview
This is the backend server for the CEN Project 2025, built with Express.js and MongoDB. The server provides RESTful APIs for club management and data processing.

## Project Structure
```
server/
├── db/                 # Database configuration and connection
├── public/            # Static files served by Express
├── resources/         # Data files and resources
├── routes/            # API route handlers
├── scripts/           # Utility scripts (e.g., PDF processing)
├── views/             # Server-side view templates
├── .env              # Environment variables
├── server.js         # Main application entry point
└── package.json      # Project dependencies and scripts
```

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Environment Setup
1. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5050
   MONGODB_URI=your_mongodb_connection_string
   ```

## Installation
```bash
# Install dependencies
npm install
```

## Available Scripts
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with hot reload (using nodemon)
- `npm run extract-clubs` - Run the PDF extraction script for club data

## API Endpoints

### Root API
Base URL: `/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` or `/index` or `/index.html` | Serves the main index.html page |

### Clubs API
Base URL: `/api/clubs`

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/` | Get all clubs | `major` (optional): Filter by major<br>`sortBy` (optional): Sort by field (e.g., 'recentlyUpdated') |
| POST | `/` | Create a new club | None |
| PUT | `/:id` | Update a club by ID | None |
| DELETE | `/:id` | Delete a club by ID | None |

### Request/Response Examples

#### Create Club
```javascript
POST /api/clubs
Content-Type: application/json

{
    "name": "Club Name",           // Required
    "description": "Description",  // Optional
    "major": ["Computer Science", "Engineering"],   // Required, Array
    "chillMeter": "5",              // Optional, String
    "socials": {                   // Optional
        "instagram": "@clubhandle",
        "website": "https://clubwebsite.com"
    }
}

// Success Response (201 Created)
{
    "message": "Club created successfully",
    "id": "60d21b4667d0d8992e610c85"
}

// Error Response (400 Bad Request)
{
    "message": "Name and major are required"
}
```

#### Get Clubs
```javascript
GET /api/clubs?major=Computer Science&sortBy=recentlyUpdated

// Success Response (200 OK)
[
    {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Computer Science Club",
        "description": "A club for CS majors",
        "major": ["Computer Science", "Engineering"],
        "chillMeter": "5",
        "socials": {
            "instagram": "@csclub",
            "website": "https://csclub.edu"
        },
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    // ... more clubs
]

// No Results Response (200 OK)
{
    "message": "No clubs found",
    "data": []
}
```

#### Update Club
```javascript
PUT /api/clubs/60d21b4667d0d8992e610c85
Content-Type: application/json

{
    "name": "Updated Club Name",
    "description": "Updated description",
    "major": ["Computer Science"],
    "chillMeter": "7"
}

// Success Response (200 OK)
{
    "message": "Club updated successfully",
    "id": "60d21b4667d0d8992e610c85"
}

// Error Response (404 Not Found)
{
    "message": "Club not found"
}
```

#### Delete Club
```javascript
DELETE /api/clubs/60d21b4667d0d8992e610c85

// Success Response (200 OK)
{
    "message": "Club deleted successfully",
    "id": "60d21b4667d0d8992e610c85"
}

// Error Response (404 Not Found)
{
    "message": "Club not found"
}
```

## Database Schema

### Club Collection
```javascript
{
    _id: ObjectId,
    name: String,           // Required
    description: String,    // Optional
    major: Array,           // Required, Array of strings
    chillMeter: String,     // Optional, String
    socials: String (website),        // Optional
    createdAt: Date,        // Automatically set
    updatedAt: Date         // Automatically set
}
```

## Error Handling
The server implements standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (Invalid input or ID format)
- 404: Not Found
- 500: Server Error

All error responses include a `message` field explaining the error.

## Development Guidelines
1. Follow the existing route structure for new endpoints
2. Use async/await for database operations
3. Implement proper error handling
4. Add input validation for all endpoints
5. Document new API endpoints in this README

## Testing
To add tests for new features:
1. Create test files in a `__tests__` directory
2. Use Jest or your preferred testing framework
3. Include both success and error cases
4. Test database operations with a test database


## Troubleshooting
Common issues and solutions:
1. MongoDB Connection Issues
   - Check .env file configuration
   - Verify MongoDB is running
   - Check network connectivity

## Contributing
1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License
ISC 