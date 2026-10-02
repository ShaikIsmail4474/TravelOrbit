import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CreditCard,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Package,
  User,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import api from '../services/api'

import '../styles/adminPayments.css'

function AdminPayments() {
  const navigate = useNavigate()

  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const loadPayments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/payments/all')

      // Admin should only see SUCCESS and PENDING payments
      const visiblePayments = response.data.filter(
        (payment) =>
          payment.status === 'SUCCESS' ||
          payment.status === 'PENDING'
      )

      setPayments(visiblePayments)
    } catch (err) {
      console.error('Failed to load payments:', err)

      setError(
        err.response?.data?.message ||
        'Failed to load payment information.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return '-'
    }

    return new Date(dateTime).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const filteredPayments =
    statusFilter === 'ALL'
      ? payments
      : payments.filter(
          (payment) => payment.status === statusFilter
        )

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

  const handleViewBooking = () => {
    navigate('/admin/bookings')
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="admin-payments-loading">
          <Loading />
        </div>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="admin-payments-page">
        <div className="admin-payments-container">

          {/* HEADER */}
          <div className="admin-payments-header">

            <div>
              <button
                type="button"
                className="admin-payments-back-button"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>

              <p className="admin-eyebrow">
                Administration
              </p>

              <h1>Payment Management</h1>

              <p className="admin-payments-description">
                View and monitor customer payment transactions
                across the travel platform.
              </p>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <ErrorMessage message={error} />
          )}

          {/* SUMMARY */}
          <section className="admin-payment-summary">

            {/* TOTAL */}
            <div className="admin-payment-stat">

              <div className="admin-payment-stat-icon">
                <CreditCard size={20} />
              </div>

              <div>
                <span>Total Payments</span>

                <strong>
                  {payments.length}
                </strong>
              </div>

            </div>

            {/* SUCCESSFUL */}
            <div className="admin-payment-stat">

              <div className="admin-payment-stat-icon success">
                <CheckCircle size={20} />
              </div>

              <div>
                <span>Successful</span>

                <strong>
                  {successfulPayments.length}
                </strong>
              </div>

            </div>

            {/* PENDING */}
            <div className="admin-payment-stat">

              <div className="admin-payment-stat-icon pending">
                <AlertCircle size={20} />
              </div>

              <div>
                <span>Pending</span>

                <strong>
                  {pendingPayments.length}
                </strong>
              </div>

            </div>

            {/* REVENUE */}
            <div className="admin-payment-stat">

              <div className="admin-payment-stat-icon revenue">
                <span>₹</span>
              </div>

              <div>
                <span>Revenue</span>

                <strong>
                  {formatCurrency(totalRevenue)}
                </strong>
              </div>

            </div>

          </section>

          {/* PAYMENTS SECTION */}
          <section className="admin-payments-section">

            <div className="admin-payments-section-header">

              <div>
                <h2>Payments</h2>

                <p>
                  {filteredPayments.length} payment
                  {filteredPayments.length !== 1
                    ? 's'
                    : ''}{' '}
                  displayed
                </p>
              </div>

              {/* FILTER */}
              <div className="admin-payment-filter">

                <label htmlFor="payment-status">
                  Status
                </label>

                <select
                  id="payment-status"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >

                  <option value="ALL">
                    All Payments
                  </option>

                  <option value="SUCCESS">
                    Successful
                  </option>

                  <option value="PENDING">
                    Pending
                  </option>

                </select>

              </div>

            </div>

            {/* PAYMENT LIST */}
            {filteredPayments.length === 0 ? (

              <div className="admin-payments-empty">

                <CreditCard size={30} />

                <h3>
                  No payments found
                </h3>

                <p>
                  There are no payments matching the
                  selected status.
                </p>

              </div>

            ) : (

              <div className="admin-payments-list">

                {filteredPayments.map((payment) => {

                  const isSuccessful =
                    payment.status === 'SUCCESS'

                  return (
                    <article
                      key={payment.paymentId}
                      className="admin-payment-card"
                    >

                      {/* CARD HEADER */}
                      <div className="admin-payment-card-header">

                        <div>

                          <span className="admin-payment-label">
                            Payment ID
                          </span>

                          <strong>
                            #{payment.paymentId}
                          </strong>

                        </div>

                        {/* STATUS */}
                        <div
                          className={`admin-payment-status ${
                            isSuccessful
                              ? 'success'
                              : 'pending'
                          }`}
                        >

                          {isSuccessful ? (
                            <CheckCircle size={14} />
                          ) : (
                            <AlertCircle size={14} />
                          )}

                          {payment.status}

                        </div>

                      </div>

                      {/* PAYMENT CONTENT */}
                      <div className="admin-payment-content">

                        {/* CUSTOMER */}
                        <div className="admin-payment-info">

                          <div className="admin-payment-info-title">
                            <User size={15} />
                            Customer
                          </div>

                          <strong>
                            {payment.customerName || '-'}
                          </strong>

                          <p>
                            <Mail size={13} />
                            {payment.customerEmail || '-'}
                          </p>

                        </div>

                        {/* PACKAGE */}
                        <div className="admin-payment-info">

                          <div className="admin-payment-info-title">
                            <Package size={15} />
                            Package
                          </div>

                          <strong>
                            {payment.packageName || '-'}
                          </strong>

                          <p>
                            <MapPin size={13} />
                            {payment.destination || '-'}
                          </p>

                        </div>

                        {/* AMOUNT */}
                        <div className="admin-payment-info">

                          <div className="admin-payment-info-title">
                            <CreditCard size={15} />
                            Payment
                          </div>

                          <strong>
                            {formatCurrency(payment.amount)}
                          </strong>

                          <p>
                            Method:{' '}
                            {payment.paymentMethod || '-'}
                          </p>

                        </div>

                        {/* TRANSACTION */}
                        <div className="admin-payment-info">

                          <div className="admin-payment-info-title">
                            <CreditCard size={15} />
                            Transaction
                          </div>

                          <strong className="transaction-id">
                            {payment.transactionId || '-'}
                          </strong>

                          <p>
                            Currency:{' '}
                            {payment.currency || 'INR'}
                          </p>

                        </div>

                      </div>

                      {/* CARD FOOTER */}
                      <div className="admin-payment-card-footer">

                        <div>
                          <Clock size={14} />

                          <span>
                            Created:{' '}
                            {formatDateTime(
                              payment.createdAt
                            )}
                          </span>
                        </div>

                        <div>
                          <CalendarDays size={14} />

                          <span>
                            Paid:{' '}
                            {formatDateTime(
                              payment.paidAt
                            )}
                          </span>
                        </div>

                        <div>
                          Booking #{payment.bookingId}
                        </div>

                        {/* VIEW BOOKING */}
                        <button
                          type="button"
                          className="admin-view-booking-button"
                          onClick={handleViewBooking}
                        >
                          View Booking

                          <ExternalLink size={14} />
                        </button>

                      </div>

                    </article>
                  )
                })}

              </div>

            )}

          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}

export default AdminPayments