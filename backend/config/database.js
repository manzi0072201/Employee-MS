const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'epms'
})

db.connect((err) => {
    if (err) {
        console.log('Database Failed to connect', err)
        return
    }
    console.log('Database Connected Successfully')
})

module.exports = db