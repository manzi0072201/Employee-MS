import React, { useState, useEffect } from 'react'
import api from '../api/config'

const Report = () => {
    const [data, setData] = useState([])
    const [min, setMin] = useState("")
    const [max, setMax] = useState("")
    const [empNumber, setEmpNumber] = useState("")
    
    // States for Salary History Modal (Tracking View)
    const [history, setHistory] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedEmp, setSelectedEmp] = useState(null)

    useEffect(() => {
        fetchReport();
    }, []);

    // FETCH REPORT with FILTERS
    const fetchReport = async () => {
        try {
            const params = {}
            if (min) params.min = min
            if (max) params.max = max
            if (empNumber) params.empNumber = empNumber
            
            const res = await api.get("/report", { params })
            setData(res.data)
        } catch (err) {
            console.error("Fetch error:", err)
        }
    }

    // ✅ Reset Button Logic
    const handleReset = () => {
        setMin("")
        setMax("")
        setEmpNumber("")
        api.get("/report").then(res => setData(res.data))
    }

    // ✅ View Salary History Logic (Tracking)
    const handleViewHistory = async (emp) => {
        try {
            const res = await api.get(`/salary/history/${emp.empNumber}`)
            setHistory(res.data.salaryHistory)
            setSelectedEmp(emp)
            setShowModal(true)
        } catch (err) { 
            console.error(err)  
            alert("Error fetching salary history") 
        }
    }

    // Delete Logic
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await api.delete(`/employee/${id}`)
                fetchReport()
                alert("Employee deleted successfully")
            } catch (err) {
                alert(err.response?.data?.error || "Error deleting record.")
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* FILTER BAR */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Records</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Min Salary</label>
                            <input 
                                type="number" 
                                value={min} 
                                onChange={(e) => setMin(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Min Amount"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Max Salary</label>
                            <input 
                                type="number" 
                                value={max} 
                                onChange={(e) => setMax(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Max Amount"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Employee ID</label>
                            <input 
                                type="number" 
                                value={empNumber} 
                                onChange={(e) => setEmpNumber(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Employee ID"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={fetchReport} 
                                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-all"
                            >
                                Filter
                            </button>
                            <button 
                                onClick={handleReset} 
                                className="flex-1 bg-slate-500 text-white px-6 py-2 rounded-lg hover:bg-slate-600 font-semibold transition-all"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* MAIN TABLE */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        <div className="p-6 border-b bg-blue-700">
                        <h2 className="text-2xl font-bold text-white">Employee Report</h2>
                        <p className="text-blue-100 mt-1">Total Records: {data.length}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-200 border-b-2 border-gray-300">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Emp ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Full Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Gender</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Position</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Department</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Gross Salary</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Net Salary</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Records</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            No records found. Try adjusting your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row) => (
                                        <tr key={row.empNumber} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-gray-700">{row.empNumber}</td>
                                            <td className="px-6 py-4 text-gray-700">{`${row.fname || ''} ${row.lname || ''}`}</td>
                                            <td className="px-6 py-4 text-gray-700">{row.gender || "-"}</td>
                                            <td className="px-6 py-4 text-gray-700">{row.postion || "-"}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">
                                                    {row.DepartmentName || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{Number(row.latestGrossSalary || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 font-semibold text-green-600">{Number(row.latestNetSalary || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-gray-700">{row.totalPaymentRecords || 0}</td>
                                            <td className="px-6 py-4 text-center space-x-2">
                                                <button 
                                                    onClick={() => handleViewHistory(row)} 
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                >
                                                    History
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(row.empNumber)} 
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

            {/* SALARY HISTORY MODAL (TRACKING VIEW) */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-3xl w-full p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Salary History</h3>
                                <p className="text-sm text-gray-600">{selectedEmp?.fname} {selectedEmp?.lname} (ID: {selectedEmp?.empNumber})</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-700 sticky top-0">
                                    <tr>
                                        <th className="p-3 text-left font-semibold">Payment Month</th>
                                        <th className="p-3 text-right font-semibold">Gross Salary</th>
                                        <th className="p-3 text-right font-semibold">Deduction</th>
                                        <th className="p-3 text-right font-semibold">Net Salary</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-center text-gray-500">
                                                No salary records found for this employee.
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map((h, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-700">{h.monthPymnt}</td>
                                                <td className="p-3 text-right text-gray-700">{Number(h.gsalary).toLocaleString()}</td>
                                                <td className="p-3 text-right text-red-600 font-semibold">-{Number(h.tdeduction).toLocaleString()}</td>
                                                <td className="p-3 text-right text-green-600 font-bold">{Number(h.netSalary).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}



export default Report