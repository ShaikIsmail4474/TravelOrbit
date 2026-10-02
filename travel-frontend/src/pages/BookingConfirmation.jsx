import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  CalendarDays,
  Clock3,
  MapPin,
  User,
  Mail,
  ArrowLeft,
  Download,
  CreditCard,
  Receipt
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { generateBookingPDF } from '../services/pdfService'

import '../styles/bookingConfirmation.css'

function BookingConfirmation() {

  const location = useLocation()
  const navigate = useNavigate()

  const booking = location.state?.booking
  const payment = location.state?.payment

  if (!booking) {

    return (
      <>
        <Navbar />

        <main className="booking-confirmation-page">

          <div className="container">

            <div className="booking-missing">

              <h1>
                Booking Not Found
              </h1>

              <p>
                We could not find the booking information for this page.
              </p>

              <Link
                to="/packages"
                className="booking-back-link"
              >
                <ArrowLeft size={17} />
                Back to Packages
              </Link>

            </div>

          </div>

        </main>

        <Footer />
      </>
    )
  }


  const formattedTravelDate =
    booking.travelDate
      ? new Date(
          `${booking.travelDate}T00:00:00`
        ).toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }
        )
      : '-'


  const formattedBookingDate =
    booking.bookingDate
      ? new Date(
          `${booking.bookingDate}T00:00:00`
        ).toLocaleDateString(
          'en-IN',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }
        )
      : '-'


const formattedBookingTime = (() => {
  if (!booking.bookingTime) return '-'

  const [hours, minutes, seconds] = booking.bookingTime
    .substring(0, 8)
    .split(':')
    .map(Number)

  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12

  return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`
})()


  const paymentSuccessful =
    payment?.status?.toUpperCase() === 'SUCCESS'


  const handleDownloadPDF = () => {

    try {

      generateBookingPDF(
        booking,
        payment
      )

    } catch (error) {

      console.error(
        'Failed to generate booking PDF:',
        error
      )

      alert(
        'Unable to generate the PDF. Please try again.'
      )

    }

  }


  return (
    <>
      <Navbar />

      <main className="booking-confirmation-page">

        <div className="container">

          <div className="booking-confirmation-card">

            {/* Success Header */}

            <div className="booking-success-header">

              <div className="booking-success-icon">

                <CheckCircle size={42} />

              </div>


              <span className="booking-success-label">

                {paymentSuccessful
                  ? 'Booking Confirmed'
                  : 'Booking Details'}

              </span>


              <h1>

                {paymentSuccessful
                  ? 'Your trip is booked!'
                  : 'Your booking is ready'}

              </h1>


              <p>

                {paymentSuccessful
                  ? 'Thank you for choosing us. Your travel booking has been successfully created and payment has been received.'
                  : 'Your booking details are shown below. Complete the payment if your payment is still pending.'}

              </p>


              <div className="booking-id-badge">

                Booking ID: #{booking.id}

              </div>

            </div>


            {/* Booking Details */}

            <div className="booking-confirmation-content">

              <div className="booking-section">

                <h2>
                  Booking Details
                </h2>


                <div className="booking-info-grid">

                  <div className="booking-info-item">

                    <CalendarDays size={19} />

                    <div>

                      <small>
                        Travel Date
                      </small>

                      <strong>
                        {formattedTravelDate}
                      </strong>

                    </div>

                  </div>


                  <div className="booking-info-item">

                    <Clock3 size={19} />

                    <div>

                      <small>
                        Booking Time
                      </small>

                      <strong>
                        {formattedBookingTime}
                      </strong>

                    </div>

                  </div>


                  <div className="booking-info-item">

                    <MapPin size={19} />

                    <div>

                      <small>
                        Destination
                      </small>

                      <strong>
                        {booking.destination}
                      </strong>

                    </div>

                  </div>


                  <div className="booking-info-item">

                    <CalendarDays size={19} />

                    <div>

                      <small>
                        Duration
                      </small>

                      <strong>
                        {booking.durationDays} days
                      </strong>

                    </div>

                  </div>

                </div>

              </div>


              {/* Package */}

              <div className="booking-section">

                <h2>
                  Package
                </h2>


                <div className="booking-package-box">

                  <div>

                    <span>
                      Travel Package
                    </span>

                    <h3>
                      {booking.packageName}
                    </h3>

                    <p>
                      {booking.destination}
                    </p>

                  </div>


                  <div className="booking-package-price">

                    <small>
                      Total Amount
                    </small>

                    <strong>
                      ₹{Number(
                        booking.price || 0
                      ).toLocaleString('en-IN')}
                    </strong>

                  </div>

                </div>

              </div>


              {/* Customer */}

              <div className="booking-section">

                <h2>
                  Customer Information
                </h2>


                <div className="booking-customer-box">

                  <div className="booking-customer-item">

                    <User size={18} />

                    <div>

                      <small>
                        Name
                      </small>

                      <strong>
                        {booking.userName || '-'}
                      </strong>

                    </div>

                  </div>


                  <div className="booking-customer-item">

                    <Mail size={18} />

                    <div>

                      <small>
                        Email
                      </small>

                      <strong>
                        {booking.userEmail || '-'}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>


              {/* Booking Date */}

              <div className="booking-section">

                <h2>
                  Booking Created
                </h2>


                <div className="booking-info-grid">

                  <div className="booking-info-item">

                    <CalendarDays size={19} />

                    <div>

                      <small>
                        Booking Date
                      </small>

                      <strong>
                        {formattedBookingDate}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>


              {/* Payment */}

              {payment && (

                <div className="booking-section">

                  <h2>
                    Payment Details
                  </h2>


                  <div className="booking-customer-box">

                    <div className="booking-customer-item">

                      <CreditCard size={18} />

                      <div>

                        <small>
                          Payment Method
                        </small>

                        <strong>
                          {payment.paymentMethod || '-'}
                        </strong>

                      </div>

                    </div>


                    <div className="booking-customer-item">

                      <Receipt size={18} />

                      <div>

                        <small>
                          Transaction ID
                        </small>

                        <strong>
                          {payment.transactionId || 'Pending'}
                        </strong>

                      </div>

                    </div>


                    <div className="booking-customer-item">

                      <CheckCircle size={18} />

                      <div>

                        <small>
                          Payment Status
                        </small>

                        <strong>
                          {payment.status || '-'}
                        </strong>

                      </div>

                    </div>


                    <div className="booking-customer-item">

                      <Receipt size={18} />

                      <div>

                        <small>
                          Amount
                        </small>

                        <strong>
                          ₹{Number(
                            payment.amount ||
                            booking.price ||
                            0
                          ).toLocaleString('en-IN')}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              )}


              {/* Status */}

              <div className="booking-status-row">

                <span>
                  Booking Status
                </span>


                <strong className="booking-status">

                  {booking.status}

                </strong>

              </div>


              {/* Actions */}

              <div className="booking-confirmation-actions">

                <button
                  type="button"
                  className="booking-download-button"
                  onClick={handleDownloadPDF}
                >

                  <Download size={18} />

                  Download Confirmation PDF

                </button>


                <button
                  type="button"
                  className="booking-packages-button"
                  onClick={() => navigate('/packages')}
                >

                  <ArrowLeft size={17} />

                  Explore More Packages

                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  )
}

export default BookingConfirmation