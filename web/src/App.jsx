import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import StarField from './components/StarField'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Router>
      <div className="relative min-h-screen bg-space-black text-space-white overflow-x-hidden">
        {/* Animated Star Background */}
        <StarField />
        
        {/* Main Content */}
        <div className="relative z-10">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={
              <>
                <Navigation />
                <Hero />
              </>
            } />
            
            {/* Authentication Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            
            {/* Protected Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
