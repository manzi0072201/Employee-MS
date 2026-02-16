# Employee Management System (EPMS) - Backend API

## Overview
A comprehensive Node.js/Express backend for managing employee records, departments, and salary information.

## Project Structure
```
backend/
├── config/              # Database configuration
├── controllers/         # Business logic for each resource
│   ├── employeeController.js
│   ├── departmentController.js
│   ├── salaryController.js
│   └── reportController.js
├── routes/              # API endpoint definitions
│   ├── employeeRoutes.js
│   ├── departmentRoutes.js
│   ├── salaryRoutes.js
│   └── reportRoutes.js
├── middleware/          # Custom middleware
│   ├── errorHandler.js
│   └── requestLogger.js
├── utils/               # Utility files
│   └── constants.js
├── models/              # Database models/schemas
├── epms.sql             # Database schema
├── package.json         # Dependencies
└── index.js             # Main application file
```

## Installation

### Prerequisites
- Node.js v14+
- MySQL 10.4+

### Setup
```bash
npm install
```

### Database Setup
1. Create the database using the provided SQL file:
```bash
mysql -u root -p < epms.sql
```

2. Verify database connection in `config/database.js`

### Start Server
```bash
npm run dev
```

Server runs on `http://localhost:8000`

## API Endpoints

### Employee Management
- `GET /employee` - Get all employees
- `POST /employee` - Create new employee
- `PUT /employee/:id` - Update employee
- `DELETE /employee/:id` - Delete employee

### Department Management
- `GET /department` - Get all departments
- `POST /department` - Create new department
- `PUT /department/:id` - Update department
- `DELETE /department/:id` - Delete department

### Salary Management
- `GET /salary` - Get all salary records
- `POST /salary` - Create salary record
- `PUT /salary/:salaryId` - Update salary record
- `DELETE /salary/:salaryId` - Delete salary record
- `GET /salary/history/:empNumber` - Get employee salary history

### Reports
- `GET /report` - Get employee salary report with filters

### Health Check
- `GET /health` - Check API status

## Error Handling
All API responses include proper HTTP status codes and error messages.

## Database Schema
- **employee** - Employee records with department association
- **department** - Department information
- **salary** - Salary records with foreign key to employees

## Features
✓ Input validation on all endpoints
✓ Cascading deletes for data integrity
✓ Comprehensive error handling
✓ Request logging
✓ RESTful API design
✓ Modular architecture with controllers and routes
