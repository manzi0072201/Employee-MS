import React from 'react'
import NavBar from './components/NavBar'
import Department from './Pages/Department'
import Employee from './Pages/Employee'
import Report from './Pages/Report'
import Salaryform from './Pages/Salaryform'

import{BrowserRouter as Router, Routes, Route} from 'react-router-dom'

const App = () => {
  return (
    <div>
      
      <Router>
        <NavBar />  
        <Routes>
          <Route path="/" element = {<Employee/>}/>
          <Route path="/Department" element = {<Department/>}/>
          <Route path="/Report" element = {<Report/>}/>
          <Route path="/Salaryform" element = {<Salaryform/>}/>
        </Routes>
      </Router>
      
    </div>
  )
}

export default App 