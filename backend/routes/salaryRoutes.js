const express = require('express')
const router = express.Router()
const salaryController = require('../controllers/salaryController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, salaryController.getAllSalaries)
router.post('/', authMiddleware, salaryController.createSalary)
router.put('/:salaryId', authMiddleware, salaryController.updateSalary)
router.delete('/:salaryId', authMiddleware, salaryController.deleteSalary)
router.get('/history/:empNumber', authMiddleware, salaryController.getSalaryHistory)
router.delete('/', authMiddleware, salaryController.deleteSalaryByQuery)

module.exports = router
