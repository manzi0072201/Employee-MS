import React, { useState, useEffect } from 'react'
import api from '../api/config'

const Employee = () => {
    const [employees, setEmployees] = useState([])
    const [departments, setDepartments] = useState([])
    const [fname, setfname] = useState("")
    const [lname, setlname] = useState("")
    const [address, setaddress] = useState("")
    const [gender, setgender] = useState("")
    const [postion, setpostion] = useState("")
    const [Departmentcode, setDepartmentcode] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchEmployees()
        fetchDepartments()
    }, [])

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employee')
            setEmployees(response.data)
        } catch (err) {
            console.error('Error fetching employees:', err)
            alert('Failed to fetch employees')
        }
    }

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/department')
            setDepartments(response.data)
        } catch (err) {
            console.error('Error fetching departments:', err)
        }
    }

    const handleSubmit = async (e) => { 
        e.preventDefault()
        setLoading(true)
        const employeeData = { fname, lname, address, gender, postion, Departmentcode: Departmentcode || null }
        
        try {
            if (editingId) {
                await api.put(`/employee/${editingId}`, employeeData)
                alert("Employee Updated Successfully")
                setEditingId(null)
            } else {
                await api.post("/employee", employeeData)
                alert("Employee Added Successfully")
            }
            resetForm()
            fetchEmployees()
        } catch(err) {
            console.error(err)
            alert(err.response?.data?.error || "Error saving employee")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (employee) => {
        setfname(employee.fname)
        setlname(employee.lname)
        setaddress(employee.address)
        setgender(employee.gender)
        setpostion(employee.postion)
        setDepartmentcode(employee.Departmentcode || "")
        setEditingId(employee.empNumber)
        setShowForm(true)
    }

    const handleDelete = async (empNumber) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await api.delete(`/employee/${empNumber}`)
                alert("Employee Deleted Successfully")
                fetchEmployees()
            } catch(err) {
                console.error(err)
                alert(err.response?.data?.error || "Error deleting employee")
            }
        }
    }

    const resetForm = () => {
        setfname("")
        setlname("")
        setaddress("")
        setgender("")
        setpostion("")
        setDepartmentcode("")
        setEditingId(null)
        setShowForm(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
                            <p className="text-gray-600 mt-1">Total Employees: {employees.length}</p>
                        </div>
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            {showForm ? "Cancel" : "+ Add Employee"}
                        </button>
                    </div>

                    {/* Add/Edit Employee Form */}
                    {showForm && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                {editingId ? "Edit Employee" : "Add New Employee"}
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={fname} 
                                        onChange={(e) => setfname(e.target.value)} 
                                        placeholder="First Name"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={lname} 
                                        onChange={(e) => setlname(e.target.value)} 
                                        placeholder="Last Name"
                                        required 
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={address} 
                                        onChange={(e) => setaddress(e.target.value)} 
                                        placeholder="Address"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={gender} 
                                        onChange={(e) => setgender(e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={postion} 
                                        onChange={(e) => setpostion(e.target.value)} 
                                        placeholder="Position"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={Departmentcode} 
                                        onChange={(e) => setDepartmentcode(e.target.value)}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept.Departmentcode} value={dept.Departmentcode}>
                                                {dept.DepartmentName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2 flex gap-3 mt-2">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : editingId ? "Update Employee" : "Add Employee"}
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

                    {/* Employees Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200 border-b-2 border-gray-300">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">First Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Last Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Address</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Gender</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Position</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Department</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                                            No employees found. Add one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map(employee => (
                                        <tr key={employee.empNumber} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.empNumber}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.fname}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.lname}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.address}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.gender || "-"}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.postion}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {departments.find(d => d.Departmentcode === employee.Departmentcode)?.DepartmentName || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleEdit(employee)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.empNumber)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
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

export default Employee