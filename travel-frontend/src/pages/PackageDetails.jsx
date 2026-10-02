import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  X
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

import { getPackageById } from '../services/packageService'
import { createBooking } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'

import '../styles/packages.css'

function PackageDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const { user, isAuthenticated } = useAuth()

  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showBookingForm, setShowBookingForm] = useState(false)
  const [travelDate, setTravelDate] = useState('')

  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {

    const loadPackage = async () => {

      try {

        setLoading(true)
        setError('')

        const data = await getPackageById(id)

        setPackageData(data)

      } catch (err) {

        console.error('Failed to load package:', err)

        setError(
          'Unable to load this travel package.'
        )

      } finally {

        setLoading(false)

      }

    }

    loadPackage()

  }, [id])

  const getTodayDate = () => {

    const today = new Date()

    const year = today.getFullYear()

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0')

    const day = String(
      today.getDate()
    ).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const handleBookClick = () => {

    if (!isAuthenticated) {
      alert('Please login to book this package.')
      return
    }

    if (user?.role !== 'CUSTOMER') {
      alert('Only customers can book travel packages.')
      return
    }

    setBookingError('')
    setShowBookingForm(true)
  }

  const handleCancelBooking = () => {

    if (bookingLoading) {
      return
    }

    setShowBookingForm(false)
    setTravelDate('')
    setBookingError('')

  }

  const handleBookingSubmit = async (event) => {

    event.preventDefault()

    if (!travelDate) {
      setBookingError('Please select a travel date.')
      return
    }

    try {

      setBookingLoading(true)
      setBookingError('')

      const booking = await createBooking(
        id,
        travelDate
      )

      console.log(
        'Booking created successfully:',
        booking
      )

      navigate(
        '/payment',
        {
          state: {
            booking
          }
        }
      )

    } catch (err) {

      console.error(
        'Failed to create booking:',
        err
      )

      if (err.response?.status === 401) {

        setBookingError(
          'Your session has expired. Please login again.'
        )

      } else if (err.response?.status === 403) {

        setBookingError(
          'You are not authorized to create this booking.'
        )

      } else if (err.response?.data?.message) {

        setBookingError(
          err.response.data.message
        )

      } else {

        setBookingError(
          'Unable to create the booking. Please try again.'
        )

      }

    } finally {

      setBookingLoading(false)

    }

  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main>
          <div className="container">
            <Loading message="Loading package details..." />
          </div>
        </main>

        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main>
          <div className="container">

            <ErrorMessage message={error} />

            <Link to="/packages">
              <ArrowLeft size={17} />
              Back to packages
            </Link>

          </div>
        </main>

        <Footer />
      </>
    )
  }

  if (!packageData) {
    return null
  }

  return (
    <>
      <Navbar />

      <main>

        <section className="package-details">

          <div className="container">

            <Link
              to="/packages"
              className="package-back-link"
            >
              <ArrowLeft size={17} />
              Back to packages
            </Link>

            <div className="package-details-card">

              <div className="package-details-image-wrapper">

                <img
                  src={
                    packageData.image ||
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85'
                  }
                  alt={packageData.name}
                  className="package-details-image"
                />

              </div>

              <div className="package-details-content">

                <div className="package-location">

                  <MapPin size={17} />

                  <span>
                    {packageData.destination}
                  </span>

                </div>

                <h1>
                  {packageData.name}
                </h1>

                <p className="package-details-description">
                  {packageData.description}
                </p>

                <div className="package-details-meta">

                  <div>
                    <CalendarDays size={20} />

                    <span>
                      {packageData.durationDays} days
                    </span>

                  </div>

                </div>

                <div className="package-details-price">

                  <small>
                    Starting from
                  </small>

                  <strong>
                    ₹{Number(
                      packageData.price
                    ).toLocaleString('en-IN')}
                  </strong>

                </div>

                {!showBookingForm && (
                  <button
                    className="package-book-button"
                    onClick={handleBookClick}
                  >
                    Book This Package
                  </button>
                )}

                {showBookingForm && (
                  <div className="booking-form">

                    <div className="booking-form-header">

                      <h3>
                        Book This Package
                      </h3>

                      <button
                        type="button"
                        className="booking-close-button"
                        onClick={handleCancelBooking}
                        aria-label="Close booking form"
                        disabled={bookingLoading}
                      >
                        <X size={20} />
                      </button>

                    </div>

                    <form onSubmit={handleBookingSubmit}>

                      <div className="booking-form-group">

                        <label htmlFor="travelDate">
                          Travel Date
                        </label>

                        <input
                          id="travelDate"
                          type="date"
                          value={travelDate}
                          min={getTodayDate()}
                          onChange={(event) =>
                            setTravelDate(event.target.value)
                          }
                          disabled={bookingLoading}
                          required
                        />

                      </div>

                      {bookingError && (
                        <div
                          style={{
                            marginBottom: '15px',
                            padding: '12px 14px',
                            borderRadius: '9px',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#b91c1c',
                            fontSize: '13px',
                            lineHeight: '1.5'
                          }}
                        >
                          {bookingError}
                        </div>
                      )}

                      <div className="booking-form-actions">

                        <button
                          type="submit"
                          className="package-book-button"
                          disabled={bookingLoading}
                        >
                          {bookingLoading
                            ? 'Creating Booking...'
                            : 'Confirm Booking'}
                        </button>

                        <button
                          type="button"
                          className="booking-cancel-button"
                          onClick={handleCancelBooking}
                          disabled={bookingLoading}
                        >
                          Cancel
                        </button>

                      </div>

                    </form>

                  </div>
                )}

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default PackageDetails