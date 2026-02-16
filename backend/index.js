const express = require('express')
const cors = require('cors')
const db = require('./config/database')
const errorHandler = require('./middleware/errorHandler')
const requestLogger = require('./middleware/requestLogger')
const { API_PORT } = require('./utils/constants')

const employeeRoutes = require('./routes/employeeRoutes')
const departmentRoutes = require('./routes/departmentRoutes')
const salaryRoutes = require('./routes/salaryRoutes')
const reportRoutes = require('./routes/reportRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/employee', employeeRoutes)
app.use('/department', departmentRoutes)
app.use('/salary', salaryRoutes)
app.use('/report', reportRoutes)
app.use('/auth', authRoutes)

app.use(errorHandler)

app.get('/health', (req, res) => {
    res.json({ status: 'API is running', timestamp: new Date() })
})

// Initialize database schema and start server
const initializeDatabase = () => {
    // Ensure employee.gender column is compatible (varchar) to store values reliably
    db.query("ALTER TABLE employee MODIFY gender VARCHAR(10) DEFAULT NULL", (err) => {
        if (err) {
            console.warn('Could not modify employee.gender column:', err.message)
        } else {
            console.log('Ensured employee.gender column is VARCHAR(10)')
        }

        // Ensure users table exists for authentication
        const createUsers = `CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        db.query(createUsers, (uErr) => {
            if (uErr) {
                console.warn('Could not create users table:', uErr.message)
            } else {
                console.log('Ensured users table exists')
            }
        })
    })
}

// Start server after a brief delay to ensure database is ready
setTimeout(() => {
    initializeDatabase()
    app.listen(API_PORT, () => {
        console.log(` Employee Management System (EPMS) running on http://localhost:${API_PORT}`)
    })
}, 1000)

module.exports = app