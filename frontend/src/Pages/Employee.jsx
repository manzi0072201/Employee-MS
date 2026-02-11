import React, { useState } from 'react'
import axios from 'axios'

const Employee = () => {
    const [fname, setfname] = useState("")
    const [lname, setlname] = useState("")
    const [address, setaddress] = useState("")
    const [gender, setgender] = useState("")
    const [postion, setpostion] = useState("")

    const handleSubmit = async (e) => { 
        e.preventDefault()
        const employeeData = { fname, lname, address, gender, postion }
        try {
          await axios.post("http://localhost:8000/employee", employeeData)
          alert("Employee Added Successfully")
          setfname(""); setlname(""); setaddress(""); setgender(""); setpostion("");
        } catch(err) {
          console.error(err)
          alert("Error connecting to server")
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Employee Management System
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={fname} 
              onChange={(e) => setfname(e.target.value)} 
              placeholder="e.g. Manzi"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={lname} 
              onChange={(e) => setlname(e.target.value)} 
              placeholder="e.g. Bonheur"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={address} 
              onChange={(e) => setaddress(e.target.value)} 
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={postion} 
              onChange={(e) => setpostion(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md mt-4"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  )
}

export default Employee
