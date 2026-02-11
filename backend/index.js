const express = require('express')
const cors = require('cors')
const db = require('./config/database')

const app = express()
app.use (cors())
app.use(express.json())

//TEST API OF EPMS 

//GET ALL EMPLOYEES
app.get('/employee', (req, res) => {
    db.query('SELECT * FROM employee', (err, result) => {
        if(err){
            console.log('Error fetching data from database', err)
            res.status(500).json({ error: 'Failed to fetch employee data' })
        } else {
            res.json(result)
        }

    }
    )
}   )

//INSERT ALL EMPLOYEES
app.post('/employee', (req, res) => {
    const {fname, lname, address, gender, postion} = req.body
 
    db.query('INSERT INTO employee (fname, lname, address, gender, postion) VALUES (?, ?, ?, ?, ?)', [fname, lname, address, gender, postion], (err, result) => {
        if(err){
            console.log('Error inserting data into database', err)
            res.status(500).json({ error: 'Failed to insert employee data' })
        } else {
            res.json({ message: 'Employee inserted successfully', result })
        }
    })
})

// UPDATE EMPLOYEES
app.put('/employee/:id', (req, res) => {
    const { id } = req.params;
    const { fname, lname, address, gender, postion } = req.body; 

    const sql = 'UPDATE employee SET fname = ?, lname = ?, address = ?, gender = ?, postion = ? WHERE empNumber = ?';
    db.query(sql, [fname, lname, address, gender, postion, id], (err, result) => {
        if (err) {
            console.error('Database Error:', err); // Use err.message for cleaner logs
            return res.status(500).json({ error: 'Failed to update employee data' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.json({ 
            message: 'Employee updated successfully', 
            result: { id, fname, lname, address, gender, postion }
        });
    });
});

//DELETE EMPLOYEES
app.delete('/employee/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employee WHERE empNumber = ?', [id], (err, result) => {
        if (err) {
            console.error('Database Error:', err)
            return res.status(500).json({ error: 'Failed to delete employee data' })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.json({ 
            message: 'Employee deleted successfully', 
            result: { id }
        });
    });
});

//API ENDPOINTS FOR DEPARTMENT
//GET ALL DEPARTMENTS
app.get('/department', (req, res) => {
    db.query('SELECT * FROM department', (err, result) => {
        if(err){
            console.log('Error fetching data from database', err)
            res.status(500).json({ error: 'Failed to fetch department data' })
        } else {
            res.json(result)
        }

    }
    )
}   )

// INSERT ALL DEPARTMENTS
app.post('/department', (req, res) => {
    const {Departmentcode, DepartmentName, GroSalary} = req.body
 
    db.query('INSERT INTO department (Departmentcode, DepartmentName, GroSalary) VALUES (?, ?, ?)', [Departmentcode, DepartmentName, GroSalary], (err, result) => {
        if(err){
            console.log('Error inserting data into database', err)
            res.status(500).json({ error: 'Failed to insert department data' })
        } else {
            res.json({ message: 'Department inserted successfully', result })
        }
    })
})

//UPDATE DEPARTMENT
app.put('/department/:id', (req, res) => {
    const { id } = req.params;
    const { Departmentcode, DepartmentName, GroSalary } = req.body; 

    const sql = 'UPDATE department SET Departmentcode = ?, DepartmentName = ?, GroSalary = ? WHERE Departmentcode = ?';
    db.query(sql, [Departmentcode, DepartmentName, GroSalary, id], (err, result) => {
        if (err) {
            console.error('Database Error:', err); // Use err.message for cleaner logs
            return res.status(500).json({ error: 'Failed to update department data' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        return res.json({ 
            message: 'Department updated successfully', 
            result: { id, Departmentcode, DepartmentName, GroSalary }
        });
    });
});

//DELETE DEPARTMENT
app.delete('/department/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM department WHERE Departmentcode = ?', [id], (err, result) => {
        if (err) {
            console.error('Database Error:', err)
            return res.status(500).json({ error: 'Failed to delete department data' })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        return res.json({ 
            message: 'Department deleted successfully', 
            result: { id }
        });
    });
});

//ENDPOINTS FOR SALARIES
// GET ALL SALARIES (With Dynamic Range Filtering)
app.get('/salary', (req, res) => {
    const { min, max } = req.query;
    
    // Using CAST because columns are varchar(20) to ensure numeric comparison works
    let sql = 'SELECT * FROM salary WHERE 1=1';
    const params = [];

    if (min) {
        sql += " AND CAST(gsalary AS UNSIGNED) >= ?";
        params.push(min);
    }
    if (max) {
        sql += " AND CAST(gsalary AS UNSIGNED) <= ?";
        params.push(max);
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log('Error fetching salary data:', err);
            res.status(500).json({ error: 'Failed to fetch salary data' });
        } else {
            res.json(result);
        }
    });
});

// INSERT SALARY RECORD
app.post('/salary', (req, res) => {
    const { tdeduction, monthPymnt, gsalary, netSalary, empNumber } = req.body;
 
    const sql = 'INSERT INTO salary (tdeduction, monthPymnt, gsalary, netSalary, empNumber) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [tdeduction, monthPymnt, gsalary, netSalary, empNumber], (err, result) => {
        if (err) {
            console.log('Error inserting salary data:', err);
            res.status(500).json({ error: 'Failed to insert salary data' });
        } else {
            res.json({ message: 'Salary record inserted successfully', result });
        }
    });
});

// UPDATE SALARY RECORD
// Assumes empNumber + monthPymnt identifies a specific payment
app.put('/salary/:empNumber', (req, res) => {
    const { empNumber } = req.params;
    const { tdeduction, monthPymnt, gsalary, netSalary } = req.body; 

    const sql = 'UPDATE salary SET tdeduction = ?, monthPymnt = ?, gsalary = ?, netSalary = ? WHERE empNumber = ? AND monthPymnt = ?';
    
    // We use monthPymnt in WHERE to ensure we update the correct month's record
    db.query(sql, [tdeduction, monthPymnt, gsalary, netSalary, empNumber, monthPymnt], (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Failed to update salary data' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        return res.json({ 
            message: 'Salary updated successfully', 
            result: { empNumber, monthPymnt, gsalary, netSalary }
        });
    });
});

// DELETE SALARY RECORD
app.delete('/salary/:empNumber/:month', (req, res) => {
    const { empNumber, month } = req.params;
    
    db.query('DELETE FROM salary WHERE empNumber = ? AND monthPymnt = ?', [empNumber, month], (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Failed to delete salary data' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        return res.json({ 
            message: 'Salary record deleted successfully', 
            result: { empNumber, month }
        });
    });
});

//REPORTS LOGIC
app.get('/report', (req, res) => {
    const min = req.query.min ? Number(req.query.min) : null;
    const max = req.query.max ? Number(req.query.max) : null;

    // Joins Employee (e) + Department (d) + Latest Salary (s)
    let sql = `
        SELECT 
            e.empNumber, e.fname, e.lname, e.postion, 
            d.DepartmentName, 
            s.gsalary, s.netSalary 
        FROM employee e
        LEFT JOIN department d ON e.Departmentcode = d.Departmentcode
        LEFT JOIN salary s ON e.empNumber = s.empNumber
        WHERE 1=1
    `;
    const params = [];

    // Filter Logic for "Any Amount"
    if (min !== null) {
        sql += " AND CAST(s.gsalary AS UNSIGNED) >= ?";
        params.push(min);
    }
    if (max !== null) {
        sql += " AND CAST(s.gsalary AS UNSIGNED) <= ?";
        params.push(max);
    }

    // Ensure only the most recent salary shows in the main report
    sql += " GROUP BY e.empNumber";

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- 2. THE SALARY HISTORY ROUTE (For the View Button) ---
app.get('/salary-history/:empNumber', (req, res) => {
    const { empNumber } = req.params;
    const sql = "SELECT monthPymnt, gsalary, tdeduction, netSalary FROM salary WHERE empNumber = ? ORDER BY monthPymnt DESC";
    
    db.query(sql, [empNumber], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- 3. DELETE EMPLOYEE ROUTE ---
app.delete('/employee/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employee WHERE empNumber = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Cannot delete employee with linked salary records" });
        res.json("Deleted");
    });
});
const PORT = 8000
app.listen(PORT, () => console.log(`Your App is running on http://localhost:${PORT}`))