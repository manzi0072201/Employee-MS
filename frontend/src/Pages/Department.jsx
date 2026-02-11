import React, { useState } from 'react'
import axios from 'axios'

const Department = () => {
    const [Departmentcode, setDepartmentcode] = useState("")
    const [DepartmentName, setDepartmentName] = useState("")
    const [GroSalary, setGroSalary] = useState("")
  

    const handleSubmit = async (e) => { 
        e.preventDefault()
        const departmentData = { Departmentcode, DepartmentName, GroSalary }
        try {
          await axios.post(`http://localhost:8000/department${Departmentcode}`, departmentData)
          alert("Department Added Successfully")
          setDepartmentcode(""); setDepartmentName(""); setGroSalary("");
        } catch(err) {
          console.error(err)
          alert("Error connecting to server")
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Department Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={Departmentcode} 
              onChange={(e) => setDepartmentcode(e.target.value)} 
              placeholder="e.g. M001"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={DepartmentName} 
              onChange={(e) => setDepartmentName(e.target.value)} 
              placeholder="e.g. Marketing"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={GroSalary} 
              onChange={(e) => setGroSalary(e.target.value)} 
              placeholder="e.g. 50000"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md mt-4"
          >
            Add Department
          </button>
        </form>
      </div>
    </div>
  )
}

export default Department
