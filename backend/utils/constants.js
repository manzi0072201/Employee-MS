const API_PORT = process.env.PORT || 8000

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

const ERROR_MESSAGES = {
    EMPLOYEE_NOT_FOUND: 'Employee not found',
    DEPARTMENT_NOT_FOUND: 'Department not found',
    SALARY_NOT_FOUND: 'Salary record not found',
    MISSING_REQUIRED_FIELDS: 'Missing required fields',
    DATABASE_ERROR: 'Database operation failed',
    DUPLICATE_DEPARTMENT_CODE: 'Department code already exists'
}

module.exports = {
    API_PORT,
    HTTP_STATUS,
    ERROR_MESSAGES
}
