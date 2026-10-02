import {
  Package,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  Clock,
  IndianRupee
} from 'lucide-react'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

import '../styles/adminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoadingStats(true)

        const [bookingsResponse, paymentsResponse] =
          await Promise.all([
            api.get('/bookings/all'),
            api.get('/payments/all')
          ])

        setBookings(bookingsResponse.data)
        setPayments(paymentsResponse.data)
      } catch (error) {
        console.error(
          'Failed to load dashboard statistics:',
          error
        )
      } finally {
        setLoadingStats(false)
      }
    }

    loadDashboardStats()
  }, [])

  const successfulPayments = payments.filter(
    (payment) => payment.status === 'SUCCESS'
  )

  const pendingPayments = payments.filter(
    (payment) => payment.status === 'PENDING'
  )

  const totalRevenue = successfulPayments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">

        {/* HEADER */}
        <div className="admin-dashboard-header">
          <div>
            <p className="admin-eyebrow">Administration</p>

            <h1>Admin Dashboard</h1>

            <p className="admin-header-description">
              Manage your travel platform, packages, bookings,
              and users from one place.
            </p>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* ADMIN ACCOUNT */}
        <div className="admin-account-card">
          <div className="admin-account-icon">
            <ShieldCheck size={25} />
          </div>

          <div className="admin-account-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span>Administrator Account</span>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <section className="admin-summary-section">

          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Overview</p>
              <h2>Payment Summary</h2>
            </div>

            <button
              type="button"
              className="admin-view-payments-button"
              onClick={() => navigate('/admin/payments')}
            >
              View Payments
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="admin-summary-grid">

            {/* TOTAL BOOKINGS */}
            <div className="admin-summary-card">
              <div className="admin-summary-icon admin-summary-booking">
                <CalendarDays size={21} />
              </div>

              <div>
                <span>Total Bookings</span>

                <strong>
                  {loadingStats ? '—' : bookings.length}
                </strong>
              </div>
            </div>

            {/* TOTAL PAYMENTS */}
            <div className="admin-summary-card">
              <div className="admin-summary-icon admin-summary-payment">
                <CreditCard size={21} />
              </div>

              <div>
                <span>Total Payments</span>

                <strong>
                  {loadingStats ? '—' : payments.length}
                </strong>
              </div>
            </div>

            {/* SUCCESSFUL PAYMENTS */}
            <div className="admin-summary-card">
              <div className="admin-summary-icon admin-summary-success">
                <CheckCircle size={21} />
              </div>

              <div>
                <span>Successful Payments</span>

                <strong>
                  {loadingStats
                    ? '—'
                    : successfulPayments.length}
                </strong>
              </div>
            </div>

            {/* PENDING PAYMENTS */}
            <div className="admin-summary-card">
              <div className="admin-summary-icon admin-summary-pending">
                <Clock size={21} />
              </div>

              <div>
                <span>Pending Payments</span>

                <strong>
                  {loadingStats
                    ? '—'
                    : pendingPayments.length}
                </strong>
              </div>
            </div>

            {/* TOTAL REVENUE */}
            <div className="admin-summary-card admin-revenue-card">
              <div className="admin-summary-icon admin-summary-revenue">
                <IndianRupee size={21} />
              </div>

              <div>
                <span>Total Revenue</span>

                <strong>
                  {loadingStats
                    ? '—'
                    : formatCurrency(totalRevenue)}
                </strong>
              </div>
            </div>

          </div>
        </section>

        {/* MANAGEMENT CARDS */}
        <div className="admin-management-grid">

          {/* PACKAGES */}
          <div className="admin-management-card">
            <div className="admin-card-icon admin-package-icon">
              <Package size={24} />
            </div>

            <h2>Package Management</h2>

            <p>
              Create, view, update, and remove travel packages
              available to customers.
            </p>

            <button
              type="button"
              onClick={() => navigate('/admin/packages')}
            >
              Manage Packages
              <ArrowRight size={16} />
            </button>
          </div>

          {/* BOOKINGS */}
          <div className="admin-management-card">
            <div className="admin-card-icon admin-booking-icon">
              <CalendarDays size={24} />
            </div>

            <h2>Booking Management</h2>

            <p>
              View customer bookings and manage booking status
              from the administration panel.
            </p>

            <button
              type="button"
              onClick={() => navigate('/admin/bookings')}
            >
              Manage Bookings
              <ArrowRight size={16} />
            </button>
          </div>

          {/* USERS */}
          <div className="admin-management-card">
            <div className="admin-card-icon admin-users-icon">
              <Users size={24} />
            </div>

            <h2>User Management</h2>

            <p>
              View registered customers and manage user
              account information.
            </p>

            <button
              type="button"
              onClick={() => navigate('/admin/users')}
            >
              Manage Users
              <ArrowRight size={16} />
            </button>
          </div>

          {/* SETTINGS */}
          <div className="admin-management-card">
            <div className="admin-card-icon admin-settings-icon">
              <Settings size={24} />
            </div>

            <h2>Settings</h2>

            <p>
              View and manage your administrator account
              settings and security information.
            </p>

            <button
              type="button"
              onClick={() => navigate('/settings')}
            >
              Open Settings
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminDashboard