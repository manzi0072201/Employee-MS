const db = require('../config/database')

exports.getAllEmployees = (req, res) => {
    db.query('SELECT * FROM employee', (err, result) => {
        if (err) {
            console.error('Error fetching employees:', err.message)
            return res.status(500).json({ error: 'Failed to fetch employee data' })
        }
        res.json(result)
    })
}

exports.createEmployee = (req, res) => {
    const { fname, lname, address, gender, postion, Departmentcode } = req.body

    if (!fname || !lname || !address || !postion) {
        return res.status(400).json({ error: 'Missing required fields: fname, lname, address, postion' })
    }

    if (Departmentcode) {
        db.query('SELECT * FROM department WHERE Departmentcode = ?', [Departmentcode], (err, dept) => {
            if (err) {
                console.error('Error checking department:', err.message)
                return res.status(500).json({ error: 'Failed to validate department' })
            }
            if (dept.length === 0) {
                return res.status(400).json({ error: 'Department does not exist' })
            }
            insertEmployee()
        })
    } else {
        insertEmployee()
    }

    function insertEmployee() {
        const sql = 'INSERT INTO employee (fname, lname, address, gender, postion, Departmentcode) VALUES (?, ?, ?, ?, ?, ?)'
        db.query(sql, [fname, lname, address, gender, postion, Departmentcode || null], (err, result) => {
            if (err) {
                console.error('Error inserting employee:', err.message)
                return res.status(500).json({ error: 'Failed to insert employee data' })
            }
            res.status(201).json({ 
                message: 'Employee inserted successfully', 
                empNumber: result.insertId,
                employee: { empNumber: result.insertId, fname, lname, address, gender, postion, Departmentcode }
            })
        })
    }
}

exports.updateEmployee = (req, res) => {
    const { id } = req.params
    const { fname, lname, address, gender, postion, Departmentcode } = req.body

    if (!fname || !lname || !address || !postion) {
        return res.status(400).json({ error: 'Missing required fields: fname, lname, address, postion' })
    }

    db.query('SELECT * FROM employee WHERE empNumber = ?', [id], (err, employee) => {
        if (err) {
            console.error('Error checking employee:', err.message)
            return res.status(500).json({ error: 'Failed to check employee' })
        }
        if (employee.length === 0) {
            return res.status(404).json({ error: 'Employee not found' })
        }

        if (Departmentcode) {
            db.query('SELECT * FROM department WHERE Departmentcode = ?', [Departmentcode], (err, dept) => {
                if (err || dept.length === 0) {
                    return res.status(400).json({ error: 'Department does not exist' })
                }
                updateEmp()
            })
        } else {
            updateEmp()
        }
    })

    function updateEmp() {
        const sql = 'UPDATE employee SET fname = ?, lname = ?, address = ?, gender = ?, postion = ?, Departmentcode = ? WHERE empNumber = ?'
        db.query(sql, [fname, lname, address, gender, postion, Departmentcode || null, id], (err, result) => {
            if (err) {
                console.error('Error updating employee:', err.message)
                return res.status(500).json({ error: 'Failed to update employee data' })
            }
            res.json({ 
                message: 'Employee updated successfully', 
                employee: { id, fname, lname, address, gender, postion, Departmentcode }
            })
        })
    }
}

exports.deleteEmployee = (req, res) => {
    const { id } = req.params

    db.query('SELECT * FROM employee WHERE empNumber = ?', [id], (err, employee) => {
        if (err) {
            console.error('Error checking employee:', err.message)
            return res.status(500).json({ error: 'Failed to check employee' })
        }
        if (employee.length === 0) {
            return res.status(404).json({ error: 'Employee not found' })
        }

        // First delete associated salary records to avoid foreign key constraint
        db.query('DELETE FROM salary WHERE empNumber = ?', [id], (err, deleteResult) => {
            if (err) {
                console.error('Error deleting salary records:', err.message)
                return res.status(500).json({ error: 'Failed to delete associated salary records' })
            }

            // Then delete the employee
            db.query('DELETE FROM employee WHERE empNumber = ?', [id], (err, result) => {
                if (err) {
                    console.error('Error deleting employee:', err.message)
                    return res.status(500).json({ error: 'Failed to delete employee data' })
                }
                res.json({ 
                    message: 'Employee and associated salary records deleted successfully',
                    empNumber: id
                })
            })
        })
    })
}
