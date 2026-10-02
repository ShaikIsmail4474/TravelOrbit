import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Package,
  User,
  CreditCard
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import api from '../services/api'

import '../styles/adminBookings.css'

function AdminBookings() {

  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [statusLoadingId, setStatusLoadingId] = useState(null)

  const loadBookings = async () => {

    try {

      setLoading(true)
      setError('')

      const [
        bookingsResponse,
        paymentsResponse
      ] = await Promise.all([
        api.get('/bookings/all'),
        api.get('/payments/all')
      ])

      setBookings(bookingsResponse.data)
      setPayments(paymentsResponse.data)

    } catch (err) {

      console.error(
        'Failed to load bookings and payments:',
        err
      )

      if (err.response?.status === 401) {

        setError(
          'Your session has expired. Please login again.'
        )

      } else if (err.response?.status === 403) {

        setError(
          'You are not authorized to view bookings and payments.'
        )

      } else {

        setError(
          'Unable to load bookings. Please try again later.'
        )

      }

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {
    loadBookings()
  }, [])

  const formatDate = (date) => {

    if (!date) {
      return '-'
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )

  }

  const formatTime = (time) => {

    if (!time) {
      return '-'
    }

    const [hours, minutes] = time.split(':')

    const date = new Date()

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    )

    return date.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    )

  }

  const formatDateTime = (dateTime) => {

    if (!dateTime) {
      return '-'
    }

    return new Date(dateTime).toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    )

  }

  const getPaymentForBooking = (bookingId) => {

    return payments.find(
      (payment) =>
        payment.bookingId === bookingId
    )

  }

  const handleStatusChange = async (
    bookingId,
    newStatus
  ) => {

    try {

      setStatusLoadingId(bookingId)

      const response = await api.put(
        `/bookings/${bookingId}/status`,
        null,
        {
          params: {
            status: newStatus
          }
        }
      )

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === bookingId
            ? response.data
            : booking
        )
      )

    } catch (err) {

      console.error(
        'Failed to update booking status:',
        err
      )

      if (err.response?.status === 401) {

        alert(
          'Your session has expired. Please login again.'
        )

      } else if (err.response?.status === 403) {

        alert(
          'You are not authorized to update booking status.'
        )

      } else if (err.response?.data?.message) {

        alert(
          err.response.data.message
        )

      } else {

        alert(
          'Unable to update booking status. Please try again.'
        )

      }

    } finally {

      setStatusLoadingId(null)

    }

  }

  return (
    <>
      <Navbar />

      <main className="admin-bookings-page">

        <section className="admin-bookings-header">

          <div className="container">

            <button
              type="button"
              className="admin-bookings-back"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft size={17} />
              Back to Admin Dashboard
            </button>

            <div className="admin-bookings-heading">

              <span className="section-eyebrow">
                Administration
              </span>

              <h1>
                Booking Management
              </h1>

              <p>
                View and manage customer bookings and payment
                information from one place.
              </p>

            </div>

          </div>

        </section>

        <section className="admin-bookings-section">

          <div className="container">

            {loading && (
              <Loading message="Loading bookings..." />
            )}

            {!loading && error && (
              <ErrorMessage message={error} />
            )}

            {!loading &&
              !error &&
              bookings.length === 0 && (

                <div className="admin-bookings-empty">

                  <CalendarDays size={42} />

                  <h2>
                    No Bookings Found
                  </h2>

                  <p>
                    There are currently no customer bookings
                    available.
                  </p>

                </div>

              )
            }

            {!loading &&
              !error &&
              bookings.length > 0 && (

                <div className="admin-bookings-list">

                  <div className="admin-bookings-summary">

                    <div>

                      <span>
                        Total Bookings
                      </span>

                      <strong>
                        {bookings.length}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Total Payments
                      </span>

                      <strong>
                        {payments.length}
                      </strong>

                    </div>

                  </div>

                  {bookings.map((booking) => {

                    const payment =
                      getPaymentForBooking(booking.id)

                    return (
                      <article
                        key={booking.id}
                        className="admin-booking-card"
                      >

                        <div className="admin-booking-card-header">

                          <div>

                            <span className="admin-booking-label">
                              Booking ID
                            </span>

                            <h2>
                              #{booking.id}
                            </h2>

                          </div>

                          <div className="admin-booking-status-control">

                            <label
                              htmlFor={`status-${booking.id}`}
                            >
                              Status
                            </label>

                            <select
                              id={`status-${booking.id}`}
                              value={booking.status}
                              onChange={(event) =>
                                handleStatusChange(
                                  booking.id,
                                  event.target.value
                                )
                              }
                              disabled={
                                statusLoadingId === booking.id
                              }
                              className={`admin-booking-status-select admin-status-${booking.status?.toLowerCase()}`}
                            >
                              <option value="PENDING">
                                PENDING
                              </option>

                              <option value="CONFIRMED">
                                CONFIRMED
                              </option>

                              <option value="CANCELLED">
                                CANCELLED
                              </option>

                            </select>

                          </div>

                        </div>

                        <div className="admin-booking-card-content">

                          <div className="admin-booking-section-block">

                            <div className="admin-booking-block-title">
                              <User size={17} />
                              Customer
                            </div>

                            <div className="admin-booking-info">

                              <strong>
                                {booking.userName}
                              </strong>

                              <span>
                                <Mail size={14} />
                                {booking.userEmail}
                              </span>

                            </div>

                          </div>

                          <div className="admin-booking-section-block">

                            <div className="admin-booking-block-title">
                              <Package size={17} />
                              Travel Package
                            </div>

                            <div className="admin-booking-info">

                              <strong>
                                {booking.packageName}
                              </strong>

                              <span>
                                <MapPin size={14} />
                                {booking.destination}
                              </span>

                            </div>

                          </div>

                          <div className="admin-booking-section-block">

                            <div className="admin-booking-block-title">
                              <CalendarDays size={17} />
                              Travel Date
                            </div>

                            <div className="admin-booking-info">

                              <strong>
                                {formatDate(
                                  booking.travelDate
                                )}
                              </strong>

                              <span>
                                {booking.durationDays} days
                              </span>

                            </div>

                          </div>

                          <div className="admin-booking-section-block">

                            <div className="admin-booking-block-title">
                              <Clock size={17} />
                              Booking Time
                            </div>

                            <div className="admin-booking-info">

                              <strong>
                                {formatDate(
                                  booking.bookingDate
                                )}
                              </strong>

                              <span>
                                {formatTime(
                                  booking.bookingTime
                                )}
                              </span>

                            </div>

                          </div>

                        </div>

                        <div className="admin-booking-card-footer">

                          <div>

                            <span>
                              Package Price
                            </span>

                            <strong>
                              ₹{Number(
                                booking.price
                              ).toLocaleString('en-IN')}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Payment
                            </span>

                            <strong>
                              {payment
                                ? payment.status
                                : 'NOT PAID'}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Payment Method
                            </span>

                            <strong>
                              {payment?.paymentMethod || '-'}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Transaction ID
                            </span>

                            <strong>
                              {payment?.transactionId || '-'}
                            </strong>

                          </div>

                        </div>

                        {payment && (

                          <div className="admin-booking-card-footer">

                            <div>

                              <span>
                                Payment Created
                              </span>

                              <strong>
                                {formatDateTime(
                                  payment.createdAt
                                )}
                              </strong>

                            </div>

                            <div>

                              <span>
                                Paid At
                              </span>

                              <strong>
                                {formatDateTime(
                                  payment.paidAt
                                )}
                              </strong>

                            </div>

                          </div>

                        )}

                      </article>
                    )

                  })}

                </div>

              )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default AdminBookings

