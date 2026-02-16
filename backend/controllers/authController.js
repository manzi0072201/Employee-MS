const db = require('../config/database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

exports.register = (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Missing username or password' })

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, users) => {
        if (err) return res.status(500).json({ error: 'DB error' })
        if (users.length > 0) return res.status(400).json({ error: 'Username already exists' })

        const hash = bcrypt.hashSync(password, 8)
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err2, result) => {
            if (err2) return res.status(500).json({ error: 'Failed to create user' })
            const token = jwt.sign({ id: result.insertId, username }, JWT_SECRET, { expiresIn: '8h' })
            res.status(201).json({ message: 'User registered', token })
        })
    })
}

exports.login = (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Missing username or password' })

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, users) => {
        if (err) return res.status(500).json({ error: 'DB error' })
        if (users.length === 0) return res.status(400).json({ error: 'Invalid credentials' })

        const user = users[0]
        const valid = bcrypt.compareSync(password, user.password)
        if (!valid) return res.status(400).json({ error: 'Invalid credentials' })

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' })
        res.json({ message: 'Login successful', token })
    })
}
