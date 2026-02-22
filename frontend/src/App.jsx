import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Signup from './pages/signup'
import Dashboard from './pages/dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/landing'
import Upload from './pages/upload'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute> } />
      <Route path="/upload" element={
      <ProtectedRoute>
        <Upload />
      </ProtectedRoute>} />
    </Routes>
  )
}