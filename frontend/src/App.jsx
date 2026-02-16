import React, { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import Department from './Pages/Department'
import Employee from './Pages/Employee'
import Report from './Pages/Report'
import Salaryform from './Pages/Salaryform'
import Login from './Pages/Login'
import Register from './Pages/Register'

import{BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import api from './api/config'

const Protected = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return children
}

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setLoggedIn(true)
    }
  }, [])

  return (
    <div>
      
      <Router>
        <NavBar isLoggedIn={loggedIn} />  
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/register" element={<Register onRegister={() => setLoggedIn(true)} />} />
          <Route path="/" element={<Protected><Employee /></Protected>} />
          <Route path="/Department" element={<Protected><Department /></Protected>} />
          <Route path="/Report" element={<Protected><Report /></Protected>} />
          <Route path="/Salaryform" element={<Protected><Salaryform /></Protected>} />
        </Routes>
      </Router>
      
    </div>
  )
}

export default App