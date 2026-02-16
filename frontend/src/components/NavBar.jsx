import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../api/config'

const NavBar = ({ isLoggedIn = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const linkStyle = (path) => 
    `px-4 py-2 rounded-lg transition-all font-medium ${
      location.pathname === path 
        ? "bg-blue-600 text-white shadow-md" 
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-blue-600 tracking-tight">
              EPMS <span className="text-gray-800">System</span>
            </span>
          </div>

          <div className="hidden md:flex space-x-4">
            {isLoggedIn ? (
              <>
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
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkStyle("/login")}>Login</Link>
                <Link to="/register" className={linkStyle("/register")}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar