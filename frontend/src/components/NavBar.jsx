import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavBar = () => {
  const location = useLocation();

  // Helper function to highlight the active link
  const linkStyle = (path) => 
    `px-4 py-2 rounded-lg transition-all font-medium ${
      location.pathname === path 
        ? "bg-blue-600 text-white shadow-md" 
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-blue-600 tracking-tight">
              EPMS <span className="text-gray-800">System</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className={linkStyle("/")}>
              Employee
            </Link>
            <Link to="/Department" className={linkStyle("/Department")}>
              Department
            </Link>
            <Link to="/Salaryform" className={linkStyle("/Salaryform")}>
              Salary Form
            </Link>
            <Link to="/Report" className={linkStyle("/Report")}>
              Report
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar