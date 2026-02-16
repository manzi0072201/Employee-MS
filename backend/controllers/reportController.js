const db = require('../config/database')

exports.getEmployeeReport = (req, res) => {
    const min = req.query.min ? Number(req.query.min) : null
    const max = req.query.max ? Number(req.query.max) : null
    const empNumber = req.query.empNumber ? Number(req.query.empNumber) : null

    let sql = `
        SELECT 
            e.empNumber, 
            e.fname, 
            e.lname, 
            e.gender,
            e.postion, 
            COALESCE(d.DepartmentName, 'Unassigned') as DepartmentName, 
            MAX(s.gsalary) as latestGrossSalary,
            MAX(s.netSalary) as latestNetSalary,
            COUNT(s.empNumber) as totalPaymentRecords
        FROM employee e
        LEFT JOIN department d ON e.Departmentcode = d.Departmentcode
        LEFT JOIN salary s ON e.empNumber = s.empNumber
        WHERE 1=1
    `
    const params = []

    if (empNumber) {
        sql += ' AND e.empNumber = ?'
        params.push(empNumber)
    }

    if (min !== null) {
        sql += ' AND CAST(s.gsalary AS UNSIGNED) >= ?'
        params.push(min)
    }
    if (max !== null) {
        sql += ' AND CAST(s.gsalary AS UNSIGNED) <= ?'
        params.push(max)
    }

    sql += ' GROUP BY e.empNumber, e.fname, e.lname, e.gender, e.postion, d.DepartmentName ORDER BY e.fname'

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error generating report:', err.message)
            return res.status(500).json({ error: 'Failed to generate report' })
        }
        res.json(results)
    })
}
