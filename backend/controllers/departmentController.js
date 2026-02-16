const db = require('../config/database')

exports.getAllDepartments = (req, res) => {
    db.query('SELECT * FROM department', (err, result) => {
        if (err) {
            console.error('Error fetching departments:', err.message)
            return res.status(500).json({ error: 'Failed to fetch department data' })
        }
        res.json(result)
    })
}

exports.createDepartment = (req, res) => {
    const { Departmentcode, DepartmentName, GroSalary } = req.body

    if (!Departmentcode || !DepartmentName) {
        return res.status(400).json({ error: 'Missing required fields: Departmentcode, DepartmentName' })
    }

    const sql = 'INSERT INTO department (Departmentcode, DepartmentName, GroSalary) VALUES (?, ?, ?)'
    db.query(sql, [Departmentcode, DepartmentName, GroSalary || null], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Department code already exists' })
            }
            console.error('Error inserting department:', err.message)
            return res.status(500).json({ error: 'Failed to insert department data' })
        }
        res.status(201).json({ 
            message: 'Department inserted successfully',
            department: { Departmentcode, DepartmentName, GroSalary }
        })
    })
}

exports.updateDepartment = (req, res) => {
    const { id } = req.params
    const { DepartmentName, GroSalary } = req.body

    if (!DepartmentName) {
        return res.status(400).json({ error: 'Missing required field: DepartmentName' })
    }

    db.query('SELECT * FROM department WHERE Departmentcode = ?', [id], (err, dept) => {
        if (err) {
            console.error('Error checking department:', err.message)
            return res.status(500).json({ error: 'Failed to check department' })
        }
        if (dept.length === 0) {
            return res.status(404).json({ error: 'Department not found' })
        }

        const sql = 'UPDATE department SET DepartmentName = ?, GroSalary = ? WHERE Departmentcode = ?'
        db.query(sql, [DepartmentName, GroSalary || null, id], (err, result) => {
            if (err) {
                console.error('Error updating department:', err.message)
                return res.status(500).json({ error: 'Failed to update department data' })
            }
            res.json({ 
                message: 'Department updated successfully',
                department: { Departmentcode: id, DepartmentName, GroSalary }
            })
        })
    })
}

exports.deleteDepartment = (req, res) => {
    const { id } = req.params

    db.query('SELECT * FROM department WHERE Departmentcode = ?', [id], (err, dept) => {
        if (err) {
            console.error('Error checking department:', err.message)
            return res.status(500).json({ error: 'Failed to check department' })
        }
        if (dept.length === 0) {
            return res.status(404).json({ error: 'Department not found' })
        }

        db.query('SELECT COUNT(*) as count FROM employee WHERE Departmentcode = ?', [id], (err, result) => {
            if (err) {
                console.error('Error checking employees:', err.message)
                return res.status(500).json({ error: 'Failed to check employees' })
            }
            if (result[0].count > 0) {
                return res.status(400).json({ error: 'Cannot delete department with assigned employees' })
            }

            db.query('DELETE FROM department WHERE Departmentcode = ?', [id], (err, result) => {
                if (err) {
                    console.error('Error deleting department:', err.message)
                    return res.status(500).json({ error: 'Failed to delete department data' })
                }
                res.json({ 
                    message: 'Department deleted successfully',
                    Departmentcode: id
                })
            })
        })
    })
}
