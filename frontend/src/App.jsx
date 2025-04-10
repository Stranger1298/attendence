import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Statistics from './components/Statistics'
import Schedule from './components/schedule'
import AttendanceForm from './components/AttendanceForm'
import  ShortNotes from './components/ShortNotes'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (success) => {
    setIsAuthenticated(success)
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ?
                <Login onLogin={handleLogin} /> :
                <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ?
                <Dashboard /> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/statistics"
            element={
              isAuthenticated ?
                <Statistics /> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/schedule"
            element={
              isAuthenticated ?
                <Schedule /> :
                <Navigate to="/login" />
            }
          />
          <Route
            path="/attendance"
            element={
              isAuthenticated ?
                <AttendanceForm /> :
                <Navigate to="/login" />
            }
          />

          <Route
            path="/notes"
            element={
              isAuthenticated ?
                <ShortNotes /> :
                <Navigate to="/login" />
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
