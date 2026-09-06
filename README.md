Finora — Personal Finance Management Dashboard

A modern full-stack Personal Finance Management (PFM) Dashboard built with the MERN stack to help users manage, track, analyze, and understand their complete financial life from one unified platform.

📌 Project Overview

Finora is a Personal Finance Management Dashboard designed to provide users with a centralized view of their financial activities.

The application allows users to manage:

💰 Income
💸 Expenses
🏦 Bank Accounts
💳 Transactions
📊 Budgets
📈 Investments
🎯 Financial Goals
🔄 Recurring Transactions
💎 Net Worth
🔔 Financial Alerts
📊 Advanced Financial Analytics
🔎 Search & Filtering
🏦 Bank Account Integration using Plaid

The project follows a structured MERN stack architecture with a modular backend and responsive frontend.

🚀 Technology Stack
Frontend
React.js
React Router
Tailwind CSS
Recharts
Context API
JavaScript
Responsive Design
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
bcrypt
Express Validator
Express Rate Limit
Helmet
CORS
Cookie Parser
Morgan
Node Cron
External APIs
Plaid API
Development Tools
VS Code
Postman
Git
GitHub
MongoDB Atlas
Nodemon
🏗️ Architecture

Finora follows a modular MVC-oriented backend architecture.

Finora
│
├── Frontend
│   ├── Components
│   ├── Pages
│   ├── Context
│   ├── Services
│   ├── Hooks
│   └── Utils
│
└── Backend
    ├── Config
    ├── Controllers
    ├── Models
    ├── Routes
    ├── Middleware
    ├── Services
    ├── Validators
    ├── Jobs
    └── Utils
Backend Request Flow
Client
   ↓
Route
   ↓
Middleware
   ↓
Validator
   ↓
Controller
   ↓
Service
   ↓
Model
   ↓
MongoDB
   ↓
Response
📊 Project Development Progress
Original 20-Module Roadmap
#	Module	Status
1	Authentication	✅ Completed
2	Account Management	✅ Completed
3	Transaction Management	✅ Completed
4	Budget Management	✅ Completed
5	Investment Management	✅ Completed
6	Dashboard & Analytics	✅ Completed
7	Plaid Integration	✅ Completed
8	Notifications & Alerts	✅ Completed
9	Net Worth Tracking	✅ Completed
10	Financial Goals	✅ Completed
11	Recurring Transactions	✅ Completed
12	Advanced Analytics & Reports	✅ Completed
13	Search & Filtering	✅ Completed
14	User Profile & Settings	✅ Completed
15	Security Improvements	✅ Completed
16	API Validation & Error Handling	🔄 In Progress
17	Frontend Responsive Polish	⏳ Remaining
18	Testing	⏳ Remaining
19	Production Deployment	⏳ Remaining
20	Final Finora Dashboard Polish	⏳ Remaining
Current Progress
Completed completely: 15 / 20
Currently implementing: Module 16
Remaining after Module 16: 4 modules
Overall Progress

75% of the planned modules are fully completed.

Once Module 16 is completed:

80% of the roadmap will be completed.

✅ Completed Features
1. Authentication

Implemented:

User registration
User login
Password hashing
JWT authentication
Access tokens
Refresh tokens
Refresh token rotation
HTTP-only refresh token cookies
Logout
Logout from all devices
Account active/inactive checks
Strong password validation
Login rate limiting
Refresh token rate limiting
2. Account Management

Users can manage their financial accounts and account information.

Supported account-related functionality includes:

Account creation
Account updates
Account deletion
Account retrieval
Account types
Account balances
3. Transaction Management

Implemented:

Income transactions
Expense transactions
Transaction categories
Transaction amounts
Transaction dates
Account association
Manual transactions
Plaid transactions
Recurring transaction association
4. Budget Management

Implemented:

Budget creation
Budget updates
Budget deletion
Budget tracking
Category-based budgets
Budget usage calculations
Budget alerts
5. Investment Management

Implemented:

Investment records
Investment types
Investment amounts
Investment tracking
Investment analytics
6. Dashboard & Analytics

The dashboard provides a unified financial overview including:

Total income
Total expenses
Account balances
Investment information
Budget information
Financial summaries
Financial charts

Charts are implemented using Recharts.

7. Plaid Integration

Plaid integration has been implemented for bank account connectivity.

The backend supports the Plaid integration flow while keeping sensitive Plaid credentials on the server side.

PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox

Plaid secrets must never be exposed to the frontend or committed to GitHub.

8. Notifications & Alerts

Implemented financial alerts for:

Budget alerts
Transaction alerts
Recurring transaction alerts
Goal alerts
Net worth alerts
9. Net Worth Tracking

Implemented:

Assets
   +
Investments
   -
Liabilities
   =
Net Worth

Net worth snapshots and historical tracking are supported.

10. Financial Goals

Users can create and manage financial goals.

Examples:

Emergency Fund
New Car
Vacation
Education
Investment Target
11. Recurring Transactions

Implemented:

Recurring transaction creation
Recurring transaction management
Recurring schedules
Automatic transaction generation
Cron-based recurring transaction processing
12. Advanced Analytics & Reports

Implemented APIs for:

Analytics Overview
Income vs Expense
Spending Analysis
Monthly Trends
Budget Performance
Investment Analytics
Net Worth Analytics
Financial Reports
13. Search & Filtering

A unified search API supports:

Transactions
Accounts
Investments
Budgets
Goals
Recurring Transactions

Filters include:

Search query
Category
Transaction type
Account
Amount range
Date range
Status
Account type
Investment type
Pagination
Sorting
14. User Profile & Settings

Implemented user preferences including:

Timezone
Language
Date format
Week starting day
Default transaction type
Notification preferences
15. Security Improvements

Security improvements include:

Short-lived access tokens
Refresh token rotation
Hashed refresh tokens
HTTP-only cookies
Token reuse detection
Logout all devices
Password verification
Strong password rules
Rate limiting
Helmet
CORS configuration
Account status verification
🔄 Current Module
Module 16 — API Validation & Error Handling

The backend currently includes centralized:

API error handling
Async error handling
Request validation
404 handling
Mongoose validation handling
Duplicate key handling
Invalid ObjectId handling
JWT error handling
Invalid JSON handling
Payload size handling

Current middleware:

middleware/
├── errorHandler.middle.js
├── notFound.middle.js
├── validate.middle.js
└── verifyToken.middle.js

The remaining work for this module is to complete comprehensive API testing and verify that all routes return consistent error responses.

⏳ Remaining Modules
Module 17 — Frontend Responsive Polish

The frontend will be optimized for:

Desktop
Laptop
Tablet
Mobile

Areas to improve:

Sidebar
Navbar
Dashboard cards
Charts
Tables
Forms
Modals
Search
Filters
Profile
Settings
Loading states
Empty states
Error states
Light/Dark theme consistency
Module 18 — Testing

Testing will cover:

Backend
Authentication
Accounts
Transactions
Budgets
Investments
Goals
Recurring transactions
Plaid
Net worth
Analytics
Search
Profile
Security
Validation
Error handling
Frontend
Components
Pages
Forms
API integration
Authentication flow
Responsive UI
Theme switching
Module 19 — Production Deployment

Deployment preparation will include:

Production environment variables
MongoDB Atlas
Backend deployment
Frontend deployment
CORS configuration
Production cookies
HTTPS
Plaid production configuration
Security configuration
Production builds
Module 20 — Final Finora Dashboard Polish

Final improvements will include:

Performance optimization
UI consistency
UX improvements
Animations
Loading states
Empty states
Error states
Accessibility
Responsive improvements
Code cleanup
Final dashboard refinement
🔐 Backend Development Guidelines

All backend development should follow these rules.

1. Follow MVC Architecture

Keep responsibilities separated.

Routes

Routes should only define endpoints and middleware.

router.post(
  "/",
  verifyToken,
  validateRequest,
  createTransaction
);

Routes should not contain business logic.

2. Controllers

Controllers should handle:

Request data
Calling services/models
Response formatting
Error handling

Avoid putting large business logic directly inside controllers.

3. Models

Mongoose models should contain:

Schema definitions
Field validation
Indexes
Relationships
Model-level configuration
4. Services

Complex business logic should go into:

services/

For example:

analytics.service.js
recurringTransaction.service.js
netWorthSnapshot.service.js
token.service.js
5. Validators

Every API accepting user input should validate the request.

Use:

validators/

and centralized:

validate.middle.js

Validation should happen before the controller executes.

6. Error Handling

Do not repeatedly write:

try {
   ...
} catch(error) {
   res.status(500).json(...)
}

Use:

asyncHandler()

and:

errorHandler.middle.js

Use ApiError for expected application errors.

Example:

throw new ApiError(
  404,
  "Transaction not found"
);
🔑 Backend API Guidelines

All APIs should follow a consistent structure.

Example:

GET
POST
PUT/PATCH
DELETE

Use versioned APIs:

/api/v1/

Example:

/api/v1/accounts
/api/v1/transactions
/api/v1/budgets
/api/v1/investments
📦 API Response Format

Successful responses should follow:

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

Error responses should follow:

{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}

This keeps the frontend API handling consistent.

🔒 Backend Security Guidelines

Never commit:

.env

Never expose:

JWT_SECRET
PLAID_SECRET
MONGO_URL

to the frontend.

Sensitive configuration belongs only in environment variables.

Use:

.env
.env.example

.env.example should contain placeholders, not real credentials.

🗄️ MongoDB Guidelines

Use:

MongoDB Atlas
      ↓
Mongoose
      ↓
Models

Guidelines:

Use schema validation
Use indexes carefully
Avoid duplicate indexes
Use ObjectId references where appropriate
Use timestamps
Handle duplicate keys
Validate IDs
Avoid unnecessary database queries
🖥️ Frontend Development Guidelines

The frontend should follow a component-based architecture.

Recommended structure:

Frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── assets/
│   ├── routes/
│   └── App.jsx
⚛️ React Guidelines
Components

Components should be:

Reusable
Small
Focused
Easy to maintain

Avoid putting an entire page into one huge component.

Context API

Use Context API for global state such as:

Authentication
Theme
User
Global preferences

Don't use Context API for every piece of local state.

🎨 Tailwind CSS Guidelines

Use Tailwind CSS consistently.

Prioritize:

Responsive classes
Reusable components
Consistent spacing
Consistent typography
Consistent border radius
Consistent shadows
Light/dark theme support

Example:

<div className="
  rounded-2xl
  p-6
  shadow-lg
  bg-white
  dark:bg-gray-900
">
📱 Responsive Design Guidelines

Every frontend component must be checked against:

Mobile
Tablet
Desktop
Large Desktop

Use Tailwind breakpoints:

sm
md
lg
xl
2xl

Do not design only for desktop.

📊 Chart Guidelines

Since Finora uses Recharts:

Charts must be responsive
Charts should handle empty data
Charts should have meaningful labels
Charts should support dark mode
Charts should not overflow mobile screens

Use:

<ResponsiveContainer
  width="100%"
  height={300}
>
⏳ Loading / Error / Empty States

Every API-based frontend page should handle:

Loading
   ↓
Success
   ↓
Empty
   ↓
Error

Example:

Loading transactions...

No transactions found.

Unable to load transactions.
[Retry]

Never leave a blank screen when an API fails.

🔐 Frontend Authentication Guidelines

Access tokens should not be stored in localStorage for the current security architecture.

The frontend should use the backend authentication flow with HTTP-only refresh-token cookies.

API requests should support credentials, for example:

fetch(url, {
  credentials: "include"
});

or Axios:

axios.defaults.withCredentials = true;
🌙 Theme Guidelines

Finora supports:

☀️ Light Mode
🌙 Dark Mode

Theme styling must remain consistent across:

Dashboard
Sidebar
Navbar
Cards
Tables
Forms
Modals
Charts
Settings
🔎 Search Guidelines

Search functionality should:

Debounce API requests where appropriate
Support filters
Handle empty results
Handle loading
Handle errors
Preserve responsive design
🧹 Code Quality Guidelines

Before adding new code:

Check whether a reusable component already exists
Avoid duplicate logic
Keep functions focused
Use meaningful variable names
Keep controllers clean
Keep business logic in services
Validate input
Handle errors
Avoid unnecessary dependencies
🌿 Git & GitHub Guidelines

Do not commit:

.env
node_modules/
dist/
build/

Use .gitignore.

Sensitive credentials must never be committed.

Recommended commit style:

feat: add transaction filtering
fix: resolve refresh token issue
refactor: improve analytics service
security: improve authentication flow
docs: update README
📁 Backend Folder Structure

Current backend follows:

Backend/
│
├── config/
│   ├── db.config.js
│   ├── plaid.config.js
│   ├── rateLimit.config.js
│   └── security.config.js
│
├── controllers/
│
├── middleware/
│   ├── errorHandler.middle.js
│   ├── notFound.middle.js
│   ├── validate.middle.js
│   └── verifyToken.middle.js
│
├── models/
│
├── routes/
│
├── services/
│
├── validators/
│
├── jobs/
│
├── utils/
│
├── src/
│   └── app.js
│
├── index.js
├── .env
└── package.json
🔄 Development Workflow

For every new feature:

1. Decide feature requirements
        ↓
2. Create/update Model
        ↓
3. Create Service if business logic is complex
        ↓
4. Create Controller
        ↓
5. Create Validator
        ↓
6. Create Route
        ↓
7. Add Middleware
        ↓
8. Register Route in app.js
        ↓
9. Test API in Postman
        ↓
10. Integrate Frontend
        ↓
11. Test Responsive UI
        ↓
12. Commit changes
🧪 Testing Strategy

Backend APIs should first be tested independently using Postman.

Testing should include:

200 → Success
201 → Created
400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
409 → Conflict
413 → Payload Too Large
500 → Server Error

The frontend should then consume the verified APIs.

🚀 Future Development Roadmap
                    FINORA
                      │
        ┌─────────────┴─────────────┐
        │                           │
     BACKEND                    FRONTEND
        │                           │
   Modules 1–16              Module 17
        │                           │
        └─────────────┬─────────────┘
                      │
                  Module 18
                   Testing
                      │
                  Module 19
                 Deployment
                      │
                  Module 20
              Final Polish
                      │
                      ▼
              🚀 FINORA v1.0
🎯 Project Goal

The ultimate goal of Finora is to provide a secure, scalable, responsive, and intuitive personal finance platform where users can manage their complete financial life from a single dashboard.

The final application should provide:

One platform. One financial view. Better financial decisions.

👨‍💻 Development Status

Project: Finora – Personal Finance Management Dashboard

Stack: MERN

Architecture: MVC-oriented backend

Current Module: Module 16 – API Validation & Error Handling

Completed: 15 / 20 modules

Overall roadmap completion: 75%

Next Module: Module 17 – Frontend Responsive Polish

Final Target: Finora v1.0

One recommendation for your GitHub README

Don't put actual credentials in this README.

For example, never write:

PLAID_CLIENT_ID=actual_client_id
PLAID_SECRET=actual_secret
MONGO_URL=mongodb+srv://actual...
JWT_SECRET=actual_secret

Instead document them like:

PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Your actual .env should remain ignored by Git.

Your GitHub repository will then communicate the project very clearly:

Finora → MERN → MVC → 15 modules completed → Module 16 in progress → Modules 17–20 remaining → production-ready roadmap.
