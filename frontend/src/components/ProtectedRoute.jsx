import { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u))
    return unsubscribe
  }, [])


    
  console.log('Current user value:', user)
  if (user === undefined) return <p>Loading...</p>
  if (!user) return <Navigate to="/" />
  return children
}