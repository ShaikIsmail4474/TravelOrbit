import api from "./api";

export const createPayment = async (
  bookingId,
  paymentMethod
) => {
  const response = await api.post(
    `/payments/create/${bookingId}`,
    null,
    {
      params: {
        paymentMethod,
      },
    }
  );

  return response.data;
};

export const processPayment = async (
  paymentId,
  paidAmount
) => {
  const response = await api.post(
    `/payments/${paymentId}/process`,
    null,
    {
      params: {
        paidAmount,
      },
    }
  );

  return response.data;
};

export const getPaymentByBooking = async (
  bookingId
) => {
  const response = await api.get(
    `/payments/booking/${bookingId}`
  );

  return response.data;
};