import React, { useState } from 'react'
import axios from 'axios'

const SalaryForm = () => {
    // State for each column in your salary table
    const [empNumber, setEmpNumber] = useState("")
    const [monthPymnt, setMonthPymnt] = useState("")
    const [gsalary, setGsalary] = useState("")
    const [tdeduction, setTdeduction] = useState("")
    const [netSalary, setNetSalary] = useState("")

    // Helper to calculate net salary automatically
    const calculateNet = (gross, deduct) => {
        const net = Number(gross || 0) - Number(deduct || 0);
        setNetSalary(net.toString());
    }

    const handleSubmit = async (e) => { 
        e.preventDefault()
        const salaryData = { empNumber, monthPymnt, gsalary, tdeduction, netSalary }
        try {
          // Note: Use /salary endpoint for POSTing new salary records
          await axios.post("http://localhost:8000/salary", salaryData)
          alert("Salary Details Added Successfully")
          // Reset form
          setEmpNumber(""); setMonthPymnt(""); setGsalary(""); setTdeduction(""); setNetSalary("");
        } catch(err) {
          console.error(err)
          alert("Error connecting to server")
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Salary Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Number - The link to your employee table */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Number</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={empNumber} 
              onChange={(e) => setEmpNumber(e.target.value)} 
              placeholder="e.g. 101"
              required 
            />
          </div>

          {/* Month of Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Month</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={monthPymnt} 
              onChange={(e) => setMonthPymnt(e.target.value)} 
              placeholder="e.g. January 2024"
              required 
            />
          </div>

          {/* Gross Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={gsalary} 
              onChange={(e) => {
                  setGsalary(e.target.value);
                  calculateNet(e.target.value, tdeduction);
              }} 
              placeholder="e.g. 80000"
              required 
            />
          </div>

          {/* Total Deduction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Deduction</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={tdeduction} 
              onChange={(e) => {
                  setTdeduction(e.target.value);
                  calculateNet(gsalary, e.target.value);
              }} 
              placeholder="e.g. 5000"
              required 
            />
          </div>

          {/* Net Salary (Read Only / Automatic) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg outline-none cursor-not-allowed"
              value={netSalary} 
              readOnly
              placeholder="Calculated automatically"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md mt-4"
          >
            Add Salary Record
          </button>
        </form>
      </div>
    </div>
  )
}

export default SalaryForm