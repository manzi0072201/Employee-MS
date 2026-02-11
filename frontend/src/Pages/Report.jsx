import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Report = () => {
    const [data, setData] = useState([]);
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const navigate = useNavigate();
    
    // States for Salary History Modal (Tracking View)
    const [history, setHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);

    useEffect(() => {
        fetchReport();
    }, []);

    // FETCH REPORT with FILTERS
    const fetchReport = async () => {
        try {
            const res = await axios.get("http://localhost:8000/report", {
                params: { 
                    min: min || undefined, 
                    max: max || undefined 
                }
            });
            setData(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    // ✅ Reset Button Logic
    const handleReset = () => {
        setMin("");
        setMax("");
        // Immediately fetch all data again
        axios.get("http://localhost:8000/report").then(res => setData(res.data));
    };

    // ✅ View Salary History Logic (Tracking)
    const handleViewHistory = async (emp) => {
        try {
            const res = await axios.get(`http://localhost:8000/salary-history/${emp.empNumber}`);
            setHistory(res.data);
            setSelectedEmp(emp);
            setShowModal(true);
        } catch (err) { 
            alert("Error fetching salary history"); 
        }
    };

    // Delete Logic
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`http://localhost:8000/employee/${id}`);
                fetchReport();
            } catch (err) {
                alert("Error deleting record. Check if they have salary records.");
            }
        }
    }

    // Edit Logic
    const handleEdit = (row) => {
        navigate("/", { state: { editData: row } });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* FILTER BAR */}
                <div className="bg-white p-6 rounded-2xl shadow-md flex items-end gap-4 border border-gray-200">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Min Salary</label>
                        <input 
                            type="number" 
                            value={min} 
                            onChange={(e) => setMin(e.target.value)} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="Min Amount"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1 text-gray-600">Max Salary</label>
                        <input 
                            type="number" 
                            value={max} 
                            onChange={(e) => setMax(e.target.value)} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="Max Amount"
                        />
                    </div>
                    <button onClick={fetchReport} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-all">
                        Filter
                    </button>
                    <button onClick={handleReset} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-all">
                        Reset
                    </button>
                </div>

                {/* MAIN TABLE */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <h2 className="text-2xl font-bold p-6 border-b text-gray-700 bg-gray-50">Employee Management Report</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-bold">
                                <tr>
                                    <th className="px-6 py-4">Emp #</th>
                                    <th className="px-6 py-4">Full Name</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Latest Gross</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((row) => (
                                    <tr key={row.empNumber} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{row.empNumber}</td>
                                        <td className="px-6 py-4">{`${row.fname || ''} ${row.lname || ''}`}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                                                {row.DepartmentName || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-green-600 font-bold">
                                            {Number(row.gsalary || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-3">
                                            <button onClick={() => handleViewHistory(row)} className="text-blue-600 font-bold hover:underline">View History</button>
                                            <button onClick={() => handleEdit(row)} className="text-amber-600 font-bold hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(row.empNumber)} className="text-red-500 font-bold hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ✅ SALARY HISTORY MODAL (TRACKING VIEW) */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Salary History Track</h3>
                                <p className="text-sm text-gray-500">{selectedEmp?.fname} {selectedEmp?.lname} (#{selectedEmp?.empNumber})</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                        </div>
                        <div className="max-h-96 overflow-y-auto pr-2">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                    <tr>
                                        <th className="p-3 text-left">Payment Date</th>
                                        <th className="p-3 text-right">Gross Amount</th>
                                        <th className="p-3 text-right">Deduction</th>
                                        <th className="p-3 text-right">Net Received</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {history.map((h, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="p-3 font-medium text-gray-600">{h.monthPymnt}</td>
                                            <td className="p-3 text-right font-bold text-gray-800">{Number(h.gsalary).toLocaleString()}</td>
                                            <td className="p-3 text-right text-red-500">-{Number(h.tdeduction).toLocaleString()}</td>
                                            <td className="p-3 text-right text-green-600 font-extrabold">{Number(h.netSalary).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {history.length === 0 && (
                                <div className="text-center py-12 text-gray-400 italic">No historical salary data found.</div>
                            )}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setShowModal(false)} className="bg-gray-800 text-white px-8 py-2 rounded-xl hover:bg-black transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Report