const mysql = require('mysql2')
//CREATE CONNECTION

const db= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'epms'
})
//connect to database

db.connect((err) =>{
    if (err){
        console.log('Database Failed to connect',err)
        return
    }
    console.log('Database Connected Successfully')
})

module.exports = db