# Travel Ticket Selling System API – Node.js & Express

A secure RESTful API for a travel ticket platform, built with Node.js, Express, and MongoDB. The application supports user registration, JWT-based authentication with refresh tokens, and ticket purchasing with real-time balance validation. It features a modular structure and enforces robust user-level access control.

## Project Overview

This project implements the backend logic of a travel ticket-selling platform using a modular Node.js and Express architecture. Authenticated users can register, log in, purchase tickets (only if they have sufficient balance), and access their personal data. Authentication is managed with JWT tokens and secured through middleware, while refresh tokens ensure long-term session continuity.
Tickets are tightly linked to users, and balance validation is enforced before any purchase is accepted. MongoDB aggregation is used to return comprehensive user profiles, including their purchased ticket history, through optimized queries. Input is rigorously validated using Joi schemas, ensuring data integrity across all routes.

## Key Features

### Authentication & Security
- User registration and login with JWT-based authentication
- Secure password hashing using bcryptjs
- Refresh token mechanism for renewing JWT access tokens
- Protected routes enforced via middleware verifying access tokens

### Input Validation
- Joi schemas validate user input for registration, login, and ticket purchase
- Custom Joi validation with descriptive error messages (e.g., password rules, URL format)

### Ticket Management
- Ticket purchasing with real-time balance validation
- Ticket ownership: tickets are linked to the authenticated user
- Purchase rejection if the user has insufficient funds

### User Operations
- Get all users (returns non-sensitive data for all registered users)
- Get user by ID (requires authentication, returns own profile data)
- Get user with tickets: MongoDB `$lookup` joins user profile with purchased tickets
- Delete user account securely (only self-deletion allowed)

### Architecture & Design
- Modular codebase with separate folders for routes, controllers, models, middleware, schemas, and utilities
- Consistent error handling with meaningful HTTP status codes
- Environment-based configuration using `.env` variables
- Mongoose ODM for schema modeling and MongoDB interaction
- Designed for scalability and maintainability in larger applications


## Getting Started

Follow these steps to run the project locally:

1. **Clone the repository**
```bash
git clone https://github.com/JustinaVilcinskaite/travel-ticket-selling-system-api-node-express.git
cd travel-ticket-selling-system-api-node-express
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file**
```env
PORT=3002
MONGO_CONNECTION=your_mongo_db_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

4. **Run the application**
```bash
npm run dev
```

> The server will start on `http://localhost:3002` (or the port you define).

5. **Test the API (Optional)**  
Use tools like [Thunder Client](https://www.thunderclient.com/), Postman, or `curl`.

Example test routes:
- `POST /users` – Register a new user  
- `POST /login` – Log in and receive tokens  
- `POST /tickets` – Purchase a ticket (requires auth headers)


## Project Structure

```
travel-ticket-selling-system-api-node-express/
├── index.js               # Entry point: sets up Express app and routes  
├── .env                   # Environment variables (not committed)  
├── .gitignore             # Ignores node_modules, .env, etc.  
├── package.json           # Dependencies and scripts  
├── eslint.config.js       # ESLint configuration  
├── src/
│   ├── controller/        # Business logic (user, ticket)
│   ├── route/             # Express route handlers
│   ├── model/             # Mongoose models
│   ├── schema/            # Joi validation schemas
│   ├── middleware/        # Auth and validation middleware
│   └── utils/             # Helper functions (regex, tokens, strings)
```

## API Endpoints Overview

| Method | Endpoint             | Description                               | Access        |
|--------|----------------------|-------------------------------------------|---------------|
| POST   | /users               | Register a new user                        | Public        |
| POST   | /login               | Log in and receive JWT tokens              | Public        |
| POST   | /tokens/refresh      | Get new access & refresh tokens            | Public        |
| GET    | /users               | Retrieve all users (excluding passwords)   | Authenticated |
| GET    | /users/:id           | Get user data by ID (self only)            | Authenticated |
| GET    | /users/:id/tickets   | Get user data with purchased tickets       | Authenticated |
| DELETE | /users/:id           | Delete own account                         | Authenticated |
| POST   | /tickets             | Purchase a ticket                          | Authenticated |


## Technologies Used

- **Node.js** & **Express.js** – JavaScript runtime and backend web framework  
- **MongoDB** with **Mongoose** – NoSQL database and ODM for schema modeling  
- **ES Modules** – Modern JavaScript syntax using `import`/`export` (enabled via `"type": "module"`)  
- **Joi** – Schema-based input validation for user and ticket routes  
- **JWT (jsonwebtoken)** – Token-based authentication (access & refresh tokens)  
- **bcryptjs** – Secure password hashing  
- **uuid** – Unique ID generation for users and tickets  
- **dotenv** – Environment variable configuration  
- **Nodemon** – Development utility for automatic server restarts  
- **CORS** – Middleware to handle cross-origin requests  
- **ESLint** – Code linting for consistent style and error prevention  




