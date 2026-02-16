import React, { useState, useEffect } from 'react'
import api from '../api/config'

const Department = () => {
    const [departments, setDepartments] = useState([])
    const [Departmentcode, setDepartmentcode] = useState("")
    const [DepartmentName, setDepartmentName] = useState("")
    const [GroSalary, setGroSalary] = useState("")
    const [editingCode, setEditingCode] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        fetchDepartments()
    }, [])

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
        const departmentData = { Departmentcode, DepartmentName, GroSalary: GroSalary || null }
        try {
            if (editingCode) {
                await api.put(`/department/${editingCode}`, { DepartmentName, GroSalary: GroSalary || null })
                alert("Department Updated Successfully")
                setEditingCode(null)
            } else {
                await api.post("/department", departmentData)
                alert("Department Added Successfully")
            }
            resetForm()
            fetchDepartments()
        } catch(err) {
            console.error(err)
            alert(err.response?.data?.error || "Error saving department")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (department) => {
        setDepartmentcode(department.Departmentcode)
        setDepartmentName(department.DepartmentName)
        setGroSalary(department.GroSalary || "")
        setEditingCode(department.Departmentcode)
        setShowForm(true)
    }

    const handleDelete = async (Departmentcode) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                await api.delete(`/department/${Departmentcode}`)
                alert("Department Deleted Successfully")
                fetchDepartments()
            } catch(err) {
                console.error(err)
                alert(err.response?.data?.error || "Error deleting department")
            }
        }
    }

    const resetForm = () => {
        setDepartmentcode("")
        setDepartmentName("")
        setGroSalary("")
        setEditingCode(null)
        setShowForm(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Department Management</h1>
                            <p className="text-gray-600 mt-1">Total Departments: {departments.length}</p>
                        </div>
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            {showForm ? "Cancel" : "+ Add Department"}
                        </button>
                    </div>

                    {/* Add/Edit Department Form */}
                    {showForm && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                {editingCode ? "Edit Department" : "Add New Department"}
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Code *</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={Departmentcode} 
                                        onChange={(e) => setDepartmentcode(e.target.value)} 
                                        placeholder="e.g. D001"
                                        disabled={editingCode !== null}
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={DepartmentName} 
                                        onChange={(e) => setDepartmentName(e.target.value)} 
                                        placeholder="e.g. Sales"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary</label>
                                    <input 
                                        type="number" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={GroSalary} 
                                        onChange={(e) => setGroSalary(e.target.value)} 
                                        placeholder="e.g. 50000"
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-3 mt-2">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : editingCode ? "Update Department" : "Add Department"}
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

                    {/* Departments Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200 border-b-2 border-gray-300">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Department Code</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Department Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Gross Salary</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                                            No departments found. Add one to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    departments.map(department => (
                                        <tr key={department.Departmentcode} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-700">{department.Departmentcode}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{department.DepartmentName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{department.GroSalary || "-"}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleEdit(department)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 text-sm transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(department.Departmentcode)}
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

export default Department
