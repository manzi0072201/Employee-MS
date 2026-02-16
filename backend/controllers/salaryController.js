const db = require('../config/database')

exports.getAllSalaries = (req, res) => {
    const { min, max, empNumber } = req.query
    
    let sql = 'SELECT * FROM salary WHERE 1=1'
    const params = []

    if (empNumber) {
        sql += ' AND empNumber = ?'
        params.push(empNumber)
    }

    if (min) {
        sql += ' AND CAST(gsalary AS UNSIGNED) >= ?'
        params.push(min)
    }
    if (max) {
        sql += ' AND CAST(gsalary AS UNSIGNED) <= ?'
        params.push(max)
    }

    sql += ' ORDER BY empNumber DESC'

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error fetching salary data:', err.message)
            return res.status(500).json({ error: 'Failed to fetch salary data' })
        }
        res.json(result)
    })
}

exports.createSalary = (req, res) => {
    const { tdeduction, monthPymnt, gsalary, netSalary, empNumber } = req.body

    if (!tdeduction || !monthPymnt || !gsalary || !netSalary || !empNumber) {
        return res.status(400).json({ error: 'Missing required fields: tdeduction, monthPymnt, gsalary, netSalary, empNumber' })
    }

    if (isNaN(empNumber)) {
        return res.status(400).json({ error: 'empNumber must be a number' })
    }

    db.query('SELECT * FROM employee WHERE empNumber = ?', [empNumber], (err, employee) => {
        if (err) {
            console.error('Error checking employee:', err.message)
            return res.status(500).json({ error: 'Failed to validate employee' })
        }
        if (employee.length === 0) {
            return res.status(400).json({ error: `Employee with empNumber ${empNumber} does not exist` })
        }

        db.query('SELECT * FROM salary WHERE empNumber = ? AND monthPymnt = ?', [empNumber, monthPymnt], (err, existing) => {
            if (err) {
                console.error('Error checking existing salary:', err.message)
                return res.status(500).json({ error: 'Failed to check existing salary record' })
            }
            if (existing.length > 0) {
                return res.status(400).json({ error: `Salary record already exists for employee ${empNumber} in ${monthPymnt}` })
            }

            const sql = 'INSERT INTO salary (tdeduction, monthPymnt, gsalary, netSalary, empNumber) VALUES (?, ?, ?, ?, ?)'
            db.query(sql, [tdeduction, monthPymnt, gsalary, netSalary, empNumber], (err, result) => {
                if (err) {
                    console.error('Error inserting salary data:', err.message)
                    return res.status(500).json({ error: 'Failed to insert salary record' })
                }
                res.status(201).json({ 
                    message: 'Salary record inserted successfully',
                    salaryId: result.insertId,
                    salary: { tdeduction, monthPymnt, gsalary, netSalary, empNumber }
                })
            })
        })
    })
}

exports.updateSalary = (req, res) => {
    const { salaryId } = req.params
    const { tdeduction, monthPymnt, gsalary, netSalary } = req.body

    if (!tdeduction || !monthPymnt || !gsalary || !netSalary) {
        return res.status(400).json({ error: 'Missing required fields: tdeduction, monthPymnt, gsalary, netSalary' })
    }

    db.query('SELECT * FROM salary WHERE salaryId = ?', [salaryId], (err, salary) => {
        if (err) {
            console.error('Error checking salary:', err.message)
            return res.status(500).json({ error: 'Failed to check salary record' })
        }
        if (salary.length === 0) {
            return res.status(404).json({ error: 'Salary record not found' })
        }

        const sql = 'UPDATE salary SET tdeduction = ?, monthPymnt = ?, gsalary = ?, netSalary = ? WHERE salaryId = ?'
        db.query(sql, [tdeduction, monthPymnt, gsalary, netSalary, salaryId], (err, result) => {
            if (err) {
                console.error('Error updating salary:', err.message)
                return res.status(500).json({ error: 'Failed to update salary record' })
            }
            res.json({ 
                message: 'Salary updated successfully',
                salary: { salaryId, tdeduction, monthPymnt, gsalary, netSalary }
            })
        })
    })
}

exports.deleteSalary = (req, res) => {
    const { salaryId } = req.params

    db.query('SELECT * FROM salary WHERE salaryId = ?', [salaryId], (err, salary) => {
        if (err) {
            console.error('Error checking salary:', err.message)
            return res.status(500).json({ error: 'Failed to check salary record' })
        }
        if (salary.length === 0) {
            return res.status(404).json({ error: 'Salary record not found' })
        }

        db.query('DELETE FROM salary WHERE salaryId = ?', [salaryId], (err, result) => {
            if (err) {
                console.error('Error deleting salary:', err.message)
                return res.status(500).json({ error: 'Failed to delete salary record' })
            }
            res.json({ 
                message: 'Salary record deleted successfully',
                salaryId: salaryId
            })
        })
    })
}

// Delete by query params fallback: /salary?empNumber=...&monthPymnt=...
exports.deleteSalaryByQuery = (req, res) => {
    const { empNumber, monthPymnt } = req.query

    if (!empNumber || !monthPymnt) {
        return res.status(400).json({ error: 'Provide empNumber and monthPymnt to delete salary record' })
    }

    db.query('SELECT * FROM salary WHERE empNumber = ? AND monthPymnt = ?', [empNumber, monthPymnt], (err, rows) => {
        if (err) {
            console.error('Error checking salary by query:', err.message)
            return res.status(500).json({ error: 'Failed to check salary record' })
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Salary record not found for given empNumber and month' })
        }

        db.query('DELETE FROM salary WHERE empNumber = ? AND monthPymnt = ?', [empNumber, monthPymnt], (err2, result) => {
            if (err2) {
                console.error('Error deleting salary by query:', err2.message)
                return res.status(500).json({ error: 'Failed to delete salary record' })
            }
            res.json({ message: 'Salary record deleted successfully', empNumber, monthPymnt })
        })
    })
}

exports.getSalaryHistory = (req, res) => {
    const { empNumber } = req.params

    if (isNaN(empNumber)) {
        return res.status(400).json({ error: 'empNumber must be a number' })
    }

    db.query('SELECT * FROM employee WHERE empNumber = ?', [empNumber], (err, employee) => {
        if (err) {
            console.error('Error checking employee:', err.message)
            return res.status(500).json({ error: 'Failed to check employee' })
        }
        if (employee.length === 0) {
            return res.status(404).json({ error: 'Employee not found' })
        }

        const sql = 'SELECT monthPymnt, gsalary, tdeduction, netSalary FROM salary WHERE empNumber = ? ORDER BY monthPymnt DESC'
        
        db.query(sql, [empNumber], (err, results) => {
            if (err) {
                console.error('Error fetching salary history:', err.message)
                return res.status(500).json({ error: 'Failed to fetch salary history' })
            }
            res.json({
                empNumber: empNumber,
                employee: employee[0],
                salaryHistory: results
            })
        })
    })
}
