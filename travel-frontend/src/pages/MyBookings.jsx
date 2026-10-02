import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Clock3,
  MapPin,
  Eye,
  CreditCard
} from 'lucide-react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import {
  getMyBookings,
  getPaymentByBooking
} from '../services/bookingService'

import '../styles/myBookings.css'

function MyBookings() {

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    const loadBookings = async () => {

      try {

        setLoading(true)
        setError('')

        const bookingData = await getMyBookings()

        const bookingsWithPayments = await Promise.all(

          bookingData.map(async (booking) => {

            try {

              const payment =
                await getPaymentByBooking(booking.id)

              return {
                ...booking,
                payment
              }

            } catch (paymentError) {

              // Payment may not have been created yet.
              console.warn(
                `Payment not found for booking ${booking.id}`,
                paymentError
              )

              return {
                ...booking,
                payment: null
              }

            }

          })

        )

        setBookings(bookingsWithPayments)

      } catch (err) {

        console.error(
          'Failed to load bookings:',
          err
        )

        if (err.response?.status === 401) {

          setError(
            'Your session has expired. Please login again.'
          )

        } else if (err.response?.status === 403) {

          setError(
            'You are not authorized to view your bookings.'
          )

        } else {

          setError(
            'Unable to load your bookings. Please try again later.'
          )

        }

      } finally {

        setLoading(false)

      }

    }

    loadBookings()

  }, [])


  const formatDate = (date) => {

    if (!date) {
      return '-'
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  }


const formatTime = (time) => {
  if (!time) return '-'

  const [hours, minutes] = time
    .split(':')
    .map(Number)

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}


  const formatAmount = (amount) => {

    if (amount === null || amount === undefined) {
      return '-'
    }

    return `₹${Number(amount).toLocaleString('en-IN')}`
  }


  return (
    <>
      <Navbar />

      <main className="my-bookings-page">

        <section className="my-bookings-header">

          <div className="container">

            <span className="section-eyebrow">
              Your Travel History
            </span>

            <h1>
              My Bookings
            </h1>

            <p>
              View and manage your travel bookings in one place.
            </p>

          </div>

        </section>


        <section className="my-bookings-section">

          <div className="container">

            {loading && (
              <Loading message="Loading your bookings..." />
            )}


            {!loading && error && (
              <ErrorMessage message={error} />
            )}


            {!loading &&
              !error &&
              bookings.length === 0 && (

                <div className="my-bookings-empty">

                  <CalendarDays size={42} />

                  <h2>
                    No Bookings Yet
                  </h2>

                  <p>
                    You have not booked any travel packages yet.
                  </p>

                  <Link
                    to="/packages"
                    className="my-bookings-browse-button"
                  >
                    Explore Packages
                  </Link>

                </div>

              )
            }


            {!loading &&
              !error &&
              bookings.length > 0 && (

                <div className="my-bookings-list">

                  {bookings.map((booking) => {

                    const payment = booking.payment

                    return (

                      <article
                        key={booking.id}
                        className="my-booking-card"
                      >

                        <div className="my-booking-main">

                          <div className="my-booking-info">

                            <div className="my-booking-location">

                              <MapPin size={16} />

                              <span>
                                {booking.destination}
                              </span>

                            </div>


                            <h2>
                              {booking.packageName}
                            </h2>


                            <div className="my-booking-meta">

                              <span>

                                <CalendarDays size={15} />

                                Travel Date:
                                {' '}
                                {formatDate(
                                  booking.travelDate
                                )}

                              </span>


                              <span>

                                <Clock3 size={15} />

                                Booked:
                                {' '}
                                {formatDate(
                                  booking.bookingDate
                                )}
                                {' '}
                                {formatTime(
                                  booking.bookingTime
                                )}

                              </span>

                            </div>


                            <div className="my-booking-payment">

                              <CreditCard size={15} />

                              <span>
                                Payment:
                                {' '}
                                {payment
                                  ? payment.status
                                  : 'Not Created'}
                              </span>

                            </div>

                          </div>


                          <div className="my-booking-side">

                            <span
                              className={`my-booking-status status-${booking.status?.toLowerCase()}`}
                            >
                              {booking.status}
                            </span>


                            <strong>
                              {formatAmount(
                                booking.price
                              )}
                            </strong>


                            {payment && (
                              <span
                                className={`my-booking-payment-status payment-${payment.status?.toLowerCase()}`}
                              >
                                Payment {payment.status}
                              </span>
                            )}


                            <Link
                              to="/booking-confirmation"
                              state={{
                                booking,
                                payment
                              }}
                              className="my-booking-view-button"
                            >

                              <Eye size={16} />

                              View Details

                            </Link>

                          </div>

                        </div>


                        {payment && (

                          <div className="my-booking-payment-details">

                            <div>

                              <span>
                                Payment Method
                              </span>

                              <strong>
                                {payment.paymentMethod || '-'}
                              </strong>

                            </div>


                            <div>

                              <span>
                                Transaction ID
                              </span>

                              <strong>
                                {payment.transactionId || 'Pending'}
                              </strong>

                            </div>


                            <div>

                              <span>
                                Payment Amount
                              </span>

                              <strong>
                                {formatAmount(
                                  payment.amount
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

export default MyBookings