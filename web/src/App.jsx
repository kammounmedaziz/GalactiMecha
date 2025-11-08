import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import StarField from './components/StarField'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import faceAuth from './utils/faceAuth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = faceAuth.isAuthenticated()
      setIsAuthenticated(authenticated)
    }
    checkAuth()
  }, [])

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
            
            {/* Dashboard Route - Unprotected for testing */}
            <Route 
              path="/dashboard" 
              element={<Dashboard setIsAuthenticated={setIsAuthenticated} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
