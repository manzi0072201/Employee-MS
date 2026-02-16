# Employee Management System (EPMS) - Frontend

A modern web application for managing employees, departments, and salary information built with React, Vite, and Tailwind CSS.

## Features

✅ **Employee Management**
- View all employees in a structured table
- Add new employees with full details (name, address, gender, position, department)
- Edit existing employee information
- Delete employee records
- Search and filter employees

✅ **Department Management**
- Create and manage departments
- Update department names and gross salary information
- Delete departments (with validation checks)
- Assign employees to departments

✅ **Salary Management**
- Record salary information for employees
- Automatic net salary calculation (Gross - Deduction = Net)
- Track payment history for each employee
- Edit and delete salary records
- Filter salary records by employee

✅ **Reports & Analytics**
- View comprehensive employee reports
- Filter employees by salary range
- Search employees by ID
- View salary history modal for detailed tracking
- Export-ready data structure

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── NavBar.jsx          # Navigation component
│   ├── Pages/
│   │   ├── Employee.jsx        # Employee management page
│   │   ├── Department.jsx      # Department management page
│   │   ├── Salaryform.jsx      # Salary management page
│   │   └── Report.jsx          # Reports and analytics page
│   ├── api/
│   │   └── config.js           # API configuration and axios instance
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # Entry point
│   ├── App.css                 # App styles
│   └── index.css               # Global styles
├── package.json
└── README.md
```

## Pages Overview

### 1. Employee Management (/)
- **Add Employee**: Fill in first name, last name, address, gender, position, and select department
- **View Employees**: Displays all employees in a table with complete information
- **Edit Employee**: Click "Edit" button to modify employee details
- **Delete Employee**: Click "Delete" to remove an employee
- Uses blue color scheme

### 2. Department Management (/Department)
- **Add Department**: Create new departments with code, name, and gross salary
- **View Departments**: See all departments in a table
- **Edit Department**: Update department information
- **Delete Department**: Remove departments (only if no employees assigned)
- Uses green color scheme

### 3. Salary Management (/Salaryform)
- **Add Salary Record**: Enter employee ID, payment month, gross salary, and deductions
- **Auto Calculate**: Net salary is automatically calculated
- **View Records**: See all salary records in a table with employee names
- **Edit Record**: Modify existing salary records
- **Delete Record**: Remove salary entries
- Uses purple color scheme

### 4. Employee Report (/Report)
- **Filter by Salary Range**: Enter min and max salary to filter results
- **Filter by Employee ID**: Search for specific employees
- **View Salary History**: Click "History" to see all salary records for an employee
- **Delete from Report**: Remove employee records directly from the report
- Shows gross, net salary, and total payment records

## API Endpoints Used

- `GET /employee` - Fetch all employees
- `POST /employee` - Create new employee
- `PUT /employee/:id` - Update employee
- `DELETE /employee/:id` - Delete employee
- `GET /department` - Fetch all departments
- `POST /department` - Create new department
- `PUT /department/:id` - Update department
- `DELETE /department/:id` - Delete department
- `GET /salary` - Fetch all salary records
- `POST /salary` - Create salary record
- `PUT /salary/:salaryId` - Update salary record
- `DELETE /salary/:salaryId` - Delete salary record
- `GET /salary/history/:empNumber` - Fetch salary history for employee
- `GET /report` - Fetch employee report with filters

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Client-side routing

## Design Features

- **Clean & Simple UI**: Professional design suitable for school/college projects
- **Responsive Layout**: Works on desktop and tablet devices
- **Color-Coded Sections**: Each module has its own color (Blue, Green, Purple)
- **Data Tables**: Easy-to-read table format for all records
- **Modal Windows**: Salary history displayed in an elegant modal
- **Form Validation**: All required fields must be filled
- **Loading States**: Visual feedback during data operations
- **Error Handling**: User-friendly error messages

## How to Use

### Adding an Employee
1. Go to "Employee" page
2. Click "+ Add Employee" button
3. Fill in all required fields with (*)
4. Select a department from the dropdown
5. Click "Add Employee" button

### Viewing Salary History
1. Go to "Report" page
2. Click "History" button on any employee row
3. A modal window opens showing all salary records
4. View detailed payment information

### Filtering Reports
1. Go to "Report" page
2. Enter minimum and maximum salary amounts
3. Optionally enter employee ID
4. Click "Filter" button to apply filters
5. Click "Reset" to clear all filters

## Development Notes

- All API calls use a centralized configuration file (`src/api/config.js`)
- The application uses React Hooks for state management
- Tailwind CSS handles all styling (no separate CSS files needed except imports)
- Each page is self-contained as a component

## Troubleshooting

**Issue**: Pages show "No records found"
- **Solution**: Make sure the backend API is running on `http://localhost:8000`

**Issue**: Cannot add/edit records
- **Solution**: Check that all required fields (marked with *) are filled

**Issue**: Cannot delete department
- **Solution**: Remove all employees assigned to that department first

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Author Notes

This is a school/college project for teaching Employee Management System concepts. It demonstrates:
- CRUD operations (Create, Read, Update, Delete)
- Form handling in React
- API integration with backend
- Responsive UI design
- State management
- Component composition
- Data filtering and display

---

**Created for**: Educational purposes  
**Last Updated**: February 2026  
**Version**: 1.0.0
