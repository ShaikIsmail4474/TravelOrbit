import api from './api'

export const createBooking = async (packageId, travelDate) => {

  const response = await api.post(
    '/bookings',
    null,
    {
      params: {
        packageId,
        travelDate,
      },
    }
  )

  return response.data
}

export const getMyBookings = async () => {

  const response = await api.get('/bookings')

  return response.data
}

export const getPaymentByBooking = async (bookingId) => {

  const response = await api.get(
    `/payments/booking/${bookingId}`
  )

  return response.data
}