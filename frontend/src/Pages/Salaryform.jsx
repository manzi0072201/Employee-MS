import React, { useState, useEffect } from 'react'
import api from '../api/config'

const SalaryForm = () => {
    const [salaries, setSalaries] = useState([])
    const [employees, setEmployees] = useState([])
    // State for each column in your salary table
    const [empNumber, setEmpNumber] = useState("")
    const [monthPymnt, setMonthPymnt] = useState("")
    const [gsalary, setGsalary] = useState("")
    const [tdeduction, setTdeduction] = useState("")
    const [netSalary, setNetSalary] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        fetchSalaries()
        fetchEmployees()
    }, [])

    const fetchSalaries = async () => {
        try {
            const response = await api.get('/salary')
            setSalaries(response.data)
        } catch (err) {
            console.error('Error fetching salaries:', err)
        }
    }

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employee')
            setEmployees(response.data)
        } catch (err) {
            console.error('Error fetching employees:', err)
        }
    }

    const getEmployeeName = (empNum) => {
        const emp = employees.find(e => e.empNumber === empNum)
        return emp ? `${emp.fname} ${emp.lname}` : "Unknown"
    }

    // Helper to calculate net salary automatically
    const calculateNet = (gross, deduct) => {
        const net = Number(gross || 0) - Number(deduct || 0);
        setNetSalary(net.toString());
    }

    const handleGrossSalaryChange = (value) => {
        setGsalary(value)
        calculateNet(value, tdeduction)
    }

    const handleDeductionChange = (value) => {
        setTdeduction(value)
        calculateNet(gsalary, value)
    }

    const resetForm = () => {
        setEmpNumber("")
        setMonthPymnt("")
        setGsalary("")
        setTdeduction("")
        setNetSalary("")
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (salary) => {
        setEmpNumber(salary.empNumber)
        setMonthPymnt(salary.monthPymnt)
        setGsalary(salary.gsalary)
        setTdeduction(salary.tdeduction)
        setNetSalary(salary.netSalary)
        setEditingId(salary.salaryId)
        setShowForm(true)
    }

    const handleDelete = async (salary) => {
        if (window.confirm("Are you sure you want to delete this salary record?")) {
            try {
                // Prefer deleting by salaryId when available, otherwise use empNumber+monthPymnt
                if (salary?.salaryId) {
                    await api.delete(`/salary/${salary.salaryId}`)
                } else {
                    await api.delete(`/salary?empNumber=${salary.empNumber}&monthPymnt=${encodeURIComponent(salary.monthPymnt)}`)
                }
                alert("Salary Record Deleted Successfully")
                fetchSalaries()
            } catch(err) {
                console.error(err)
                alert(err.response?.data?.error || "Error deleting salary record")
            }
        }
    }

    const handleSubmit = async (e) => { 
        e.preventDefault()
        setLoading(true)
        const salaryData = { empNumber: Number(empNumber), monthPymnt, gsalary: Number(gsalary), tdeduction: Number(tdeduction), netSalary: Number(netSalary) }
        try {
            if (editingId) {
                await api.put(`/salary/${editingId}`, { tdeduction: Number(tdeduction), monthPymnt, gsalary: Number(gsalary), netSalary: Number(netSalary) })
                alert("Salary Record Updated Successfully")
                setEditingId(null)
            } else {
                await api.post("/salary", salaryData)
                alert("Salary Details Added Successfully")
            }
            resetForm()
            fetchSalaries()
        } catch(err) {
            console.error(err)
            alert(err.response?.data?.error || "Error saving salary record")
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Salary Management</h1>
                        <p className="text-gray-600 mt-1">Total Records: {salaries.length}</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            {showForm ? "Cancel" : "+ Add Salary Record"}
                        </button>
                        <button 
                            onClick={fetchSalaries}
                            className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Add/Edit Salary Form */}
                {showForm && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            {editingId ? "Edit Salary Record" : "Add New Salary Record"}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={empNumber} 
                                    onChange={(e) => setEmpNumber(e.target.value)}
                                    disabled={editingId !== null}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.empNumber} value={emp.empNumber}>
                                            {emp.empNumber} - {emp.fname} {emp.lname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Month *</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={monthPymnt} 
                                    onChange={(e) => setMonthPymnt(e.target.value)} 
                                    placeholder="e.g. January 2024"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary *</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={gsalary} 
                                    onChange={(e) => handleGrossSalaryChange(e.target.value)} 
                                    placeholder="e.g. 80000"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Deduction *</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={tdeduction} 
                                    onChange={(e) => handleDeductionChange(e.target.value)} 
                                    placeholder="e.g. 5000"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary (Auto)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg outline-none cursor-not-allowed"
                                    value={netSalary} 
                                    readOnly
                                    placeholder="Calculated automatically"
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-3 mt-2">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : editingId ? "Update Record" : "Add Salary Record"}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={resetForm}
                                    className="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Salaries Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 border-b-2 border-gray-300">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Employee ID</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Employee Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Payment Month</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Gross Salary</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Deduction</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Net Salary</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaries.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                                        No salary records found. Add one to get started!
                                    </td>
                                </tr>
                            ) : (
                                salaries.map(salary => (
                                    <tr key={salary.salaryId} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-700">{salary.empNumber}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{getEmployeeName(salary.empNumber)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{salary.monthPymnt}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">{Number(salary.gsalary).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-red-600 font-medium">-{Number(salary.tdeduction).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-green-600">{Number(salary.netSalary).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleEdit(salary)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2 text-sm transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(salary)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SalaryForm