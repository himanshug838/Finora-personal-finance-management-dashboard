import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finora - Personal Finance Management API",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for Finora Personal Finance Management Dashboard. Test all endpoints directly via Swagger UI.",
      contact: {
        name: "Finora Engineering Team",
        email: "support@finora.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT Bearer token obtained from /api/v1/auth/login",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error description" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "himanshu@gmail.com" },
            password: { type: "string", example: "123456" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Himanshu Gaur" },
            email: { type: "string", example: "himanshu@gmail.com" },
            password: { type: "string", example: "123456" },
          },
        },
        Account: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            accountName: { type: "string", example: "Main Savings Account" },
            accountType: { type: "string", example: "savings" },
            balance: { type: "number", example: 50000 },
            currency: { type: "string", example: "INR" },
            institutionName: { type: "string", example: "HDFC Bank" },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d2" },
            amount: { type: "number", example: 1500 },
            type: { type: "string", enum: ["income", "expense", "transfer"], example: "expense" },
            category: { type: "string", example: "Groceries" },
            date: { type: "string", format: "date-time", example: "2026-09-07T10:00:00.000Z" },
            note: { type: "string", example: "Supermarket shopping" },
          },
        },
        Budget: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d3" },
            category: { type: "string", example: "Dining Out" },
            amountLimit: { type: "number", example: 10000 },
            period: { type: "string", example: "monthly" },
          },
        },
        FinancialGoal: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d4" },
            name: { type: "string", example: "Emergency Fund" },
            targetAmount: { type: "number", example: 100000 },
            currentAmount: { type: "number", example: 25000 },
            targetDate: { type: "string", format: "date", example: "2026-12-31" },
            category: { type: "string", example: "savings" },
            status: { type: "string", example: "active" },
          },
        },
        Investment: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d5" },
            name: { type: "string", example: "Nifty 50 Index Fund" },
            assetType: { type: "string", example: "stocks" },
            amountInvested: { type: "number", example: 50000 },
            currentValue: { type: "number", example: 58000 },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication & Authorization Endpoints" },
      { name: "Accounts", description: "Financial Accounts Management" },
      { name: "Transactions", description: "Income, Expense & Transfer Transactions" },
      { name: "Budgets", description: "Budget Planning & Progress Tracking" },
      { name: "Financial Goals", description: "Goal Creation, Add/Withdraw Savings" },
      { name: "Investments", description: "Investment Portfolio & Holding Tracking" },
      { name: "Net Worth", description: "Net Worth Calculations, Breakdown & Snapshots" },
      { name: "Recurring Transactions", description: "Recurring Subscriptions & Bills" },
      { name: "Dashboard", description: "Consolidated Financial Overview Metrics" },
      { name: "Analytics", description: "Financial Analytics, Trends & Reports" },
      { name: "Plaid", description: "Plaid Bank Link Integration" },
      { name: "Notifications", description: "System & User Notifications" },
      { name: "Search", description: "Global Search across Transactions & Accounts" },
      { name: "Profile", description: "User Profile Management" },
      { name: "Security", description: "Security Settings & Password Management" },
    ],
    paths: {
      "/api/v1/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "Validation error" },
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Authenticate user and receive token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
                example: {
                  email: "himanshu@gmail.com",
                  password: "123456",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    message: "Login successful",
                    token: "jwt_token_string",
                    user: { id: "user_id", name: "Himanshu Gaur", email: "himanshu@gmail.com" },
                  },
                },
              },
            },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/api/v1/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token",
          responses: {
            200: { description: "Token refreshed successfully" },
          },
        },
      },
      "/api/v1/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout user",
          responses: {
            200: { description: "Logged out successfully" },
          },
        },
      },
      "/api/v1/auth/update": {
        put: {
          tags: ["Auth"],
          summary: "Update user profile info",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Profile updated successfully" },
          },
        },
      },
      "/api/v1/accounts": {
        get: {
          tags: ["Accounts"],
          summary: "Get all user financial accounts",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "List of accounts" } },
        },
        post: {
          tags: ["Accounts"],
          summary: "Create a new financial account",
          security: [{ BearerAuth: [] }],
          responses: { 201: { description: "Account created" } },
        },
      },
      "/api/v1/accounts/{id}": {
        get: {
          tags: ["Accounts"],
          summary: "Get account by ID",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Account details" } },
        },
        put: {
          tags: ["Accounts"],
          summary: "Update account by ID",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Account updated" } },
        },
        delete: {
          tags: ["Accounts"],
          summary: "Delete account by ID",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Account deleted" } },
        },
      },
      "/api/v1/transactions": {
        get: {
          tags: ["Transactions"],
          summary: "Get all transactions",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "List of transactions" } },
        },
        post: {
          tags: ["Transactions"],
          summary: "Create a transaction",
          security: [{ BearerAuth: [] }],
          responses: { 201: { description: "Transaction created" } },
        },
      },
      "/api/v1/transactions/{id}": {
        get: {
          tags: ["Transactions"],
          summary: "Get transaction by ID",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Transaction details" } },
        },
        put: {
          tags: ["Transactions"],
          summary: "Update transaction by ID",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Transaction updated" } },
        },
        delete: {
          tags: ["Transactions"],
          summary: "Delete transaction by ID",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Transaction deleted" } },
        },
      },
      "/api/v1/budgets": {
        get: {
          tags: ["Budgets"],
          summary: "Get all budgets",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "List of budgets" } },
        },
        post: {
          tags: ["Budgets"],
          summary: "Create a budget",
          security: [{ BearerAuth: [] }],
          responses: { 201: { description: "Budget created" } },
        },
      },
      "/api/v1/budgets/{id}/progress": {
        get: {
          tags: ["Budgets"],
          summary: "Get budget progress by ID",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Budget progress" } },
        },
      },
      "/api/v1/goals": {
        get: {
          tags: ["Financial Goals"],
          summary: "Get all financial goals",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "List of goals" } },
        },
        post: {
          tags: ["Financial Goals"],
          summary: "Create a financial goal",
          security: [{ BearerAuth: [] }],
          responses: { 201: { description: "Goal created" } },
        },
      },
      "/api/v1/goals/summary": {
        get: {
          tags: ["Financial Goals"],
          summary: "Get summary of financial goals",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Goal summary metrics" } },
        },
      },
      "/api/v1/goals/{id}/add-money": {
        post: {
          tags: ["Financial Goals"],
          summary: "Add money to a financial goal",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", properties: { amount: { type: "number", example: 5000 } } } } },
          },
          responses: { 200: { description: "Money added to goal" } },
        },
      },
      "/api/v1/goals/{id}/withdraw": {
        post: {
          tags: ["Financial Goals"],
          summary: "Withdraw money from a financial goal",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", properties: { amount: { type: "number", example: 1000 } } } } },
          },
          responses: { 200: { description: "Money withdrawn from goal" } },
        },
      },
      "/api/v1/investments": {
        get: {
          tags: ["Investments"],
          summary: "Get all investments",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "List of investments" } },
        },
        post: {
          tags: ["Investments"],
          summary: "Add an investment",
          security: [{ BearerAuth: [] }],
          responses: { 201: { description: "Investment added" } },
        },
      },
      "/api/v1/net-worth": {
        get: {
          tags: ["Net Worth"],
          summary: "Get current net worth",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Net worth summary" } },
        },
      },
      "/api/v1/net-worth/breakdown": {
        get: {
          tags: ["Net Worth"],
          summary: "Get net worth asset and liability breakdown",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Breakdown details" } },
        },
      },
      "/api/v1/dashboard": {
        get: {
          tags: ["Dashboard"],
          summary: "Get overall dashboard summary data",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Dashboard overview data" } },
        },
      },
      "/api/v1/analytics/overview": {
        get: {
          tags: ["Analytics"],
          summary: "Get financial analytics overview",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Analytics overview data" } },
        },
      },
      "/api/v1/analytics/income-expense": {
        get: {
          tags: ["Analytics"],
          summary: "Get income vs expense comparison analytics",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Income vs expense data" } },
        },
      },
      "/api/v1/notifications": {
        get: {
          tags: ["Notifications"],
          summary: "Get user notifications",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "List of notifications" } },
        },
      },
      "/api/v1/plaid/create-link-token": {
        post: {
          tags: ["Plaid"],
          summary: "Create Plaid Link token",
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Link token created" } },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
