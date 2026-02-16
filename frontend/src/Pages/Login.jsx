import React, { useState } from 'react'
import api from '../api/config'
import { useNavigate } from 'react-router-dom'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { username, password })
      localStorage.setItem('token', res.data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      onLogin && onLogin()
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="input-field mb-3" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="input-field mb-3" />
        <button className="btn-primary w-full">Login</button>
      </form>
    </div>
  )
}

export default Login
