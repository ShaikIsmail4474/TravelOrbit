import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PaymentPage from '../pages/PaymentPage'
import PackageDetails from '../pages/PackageDetails'
import BookingConfirmation from '../pages/BookingConfirmation'
import Packages from '../pages/Packages'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CustomerDashboard from '../pages/CustomerDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import MyBookings from '../pages/MyBookings'
import Settings from '../pages/Settings'
import AdminPackages from '../pages/AdminPackages'
import AdminBookings from '../pages/AdminBookings'
import AdminUsers from '../pages/AdminUsers'
import AdminPayments from '../pages/AdminPayments'
import ProtectedRoute from '../components/ProtectedRoute'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/packages"
          element={<Packages />}
        />

        <Route
          path="/packages/:id"
          element={<PackageDetails />}
        />


        {/* Customer only */}

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <MyBookings />
            </ProtectedRoute>
          }
        />


        {/* Booking confirmation */}

        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />


        {/* Settings */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />


        {/* Admin only */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/packages"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminPackages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        {/* Admin Payments */}

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes