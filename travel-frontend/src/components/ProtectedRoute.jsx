import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, allowedRole }) {

  const { user, isAuthenticated } = useAuth()

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Logged in but wrong role
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute