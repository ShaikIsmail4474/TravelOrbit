import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Wallet,
  ArrowLeft,
  CheckCircle,
  Clock,
} from "lucide-react";

import {
  createPayment,
  processPayment,
} from "../services/paymentService";

import "../styles/payment.css";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [paidAmount, setPaidAmount] = useState("");

  const [paymentId, setPaymentId] = useState(null);

  const [paymentStatus, setPaymentStatus] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);

  const [paymentError, setPaymentError] = useState("");

  const paymentMethods = [
    {
      id: "UPI",
      name: "UPI",
      icon: Smartphone,
      description:
        "Pay using Google Pay, PhonePe, Paytm, etc.",
    },
    {
      id: "CARD",
      name: "Card",
      icon: CreditCard,
      description:
        "Credit or debit card",
    },
    {
      id: "WALLET",
      name: "Wallet",
      icon: Wallet,
      description:
        "Digital wallet",
    },
  ];

  if (!booking) {
    return (
      <div className="payment-page">

        <div className="payment-container">

          <div className="payment-summary">

            <h2>
              Booking Not Found
            </h2>

            <p>
              We could not find the booking information
              required to continue with payment.
            </p>

            <button
              type="button"
              className="pay-now-button"
              onClick={() =>
                navigate("/packages")
              }
            >
              <ArrowLeft size={17} />
              Back to Packages
            </button>

          </div>

        </div>

      </div>
    );
  }

  const amount = Number(
    booking.price || 0
  );

  const formattedAmount =
    amount.toLocaleString("en-IN");

  const formattedTravelDate =
    booking.travelDate
      ? new Date(
          `${booking.travelDate}T00:00:00`
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : "-";

  /*
   * Step 1:
   * Create a pending payment.
   */
  const handleCreatePayment = async () => {

    setPaymentError("");

    try {

      setPaymentLoading(true);

      const payment =
        await createPayment(
          booking.id,
          paymentMethod
        );

      console.log(
        "Payment created:",
        payment
      );

      setPaymentId(
        payment.id
      );

      setPaymentStatus(
        "PENDING"
      );

      setPaidAmount(
        String(amount)
      );

    } catch (err) {

      console.error(
        "Payment creation failed:",
        err
      );

      if (
        err.response?.status === 401
      ) {

        setPaymentError(
          "Your session has expired. Please login again."
        );

      } else if (
        err.response?.status === 403
      ) {

        setPaymentError(
          "You are not authorized to create this payment."
        );

      } else if (
        err.response?.data?.message
      ) {

        setPaymentError(
          err.response.data.message
        );

      } else {

        setPaymentError(
          "Unable to create payment. Please try again."
        );

      }

    } finally {

      setPaymentLoading(false);

    }
  };

  /*
   * Step 2:
   * Process the existing pending payment.
   */
  const handleProcessPayment = async () => {

    setPaymentError("");

    if (!paymentId) {

      setPaymentError(
        "Please create the payment first."
      );

      return;
    }

    if (
      paidAmount === "" ||
      Number(paidAmount) <= 0
    ) {

      setPaymentError(
        "Please enter a valid payment amount."
      );

      return;
    }

    try {

      setPaymentLoading(true);

      const processedPayment =
        await processPayment(
          paymentId,
          Number(paidAmount)
        );

      console.log(
        "Payment processed:",
        processedPayment
      );

      setPaymentStatus(
        "SUCCESS"
      );

      const confirmedBooking = {
        ...booking,
        status: "CONFIRMED",
      };

      navigate(
        "/booking-confirmation",
        {
          state: {
            booking: confirmedBooking,
            payment: processedPayment,
          },
        }
      );

    } catch (err) {

      console.error(
        "Payment failed:",
        err
      );

      if (
        err.response?.status === 401
      ) {

        setPaymentError(
          "Your session has expired. Please login again."
        );

      } else if (
        err.response?.status === 403
      ) {

        setPaymentError(
          "You are not authorized to process this payment."
        );

      } else if (
        err.response?.data?.message
      ) {

        setPaymentError(
          err.response.data.message
        );

      } else {

        setPaymentError(
          "Payment failed. Please check the amount and try again."
        );

      }

    } finally {

      setPaymentLoading(false);

    }
  };

  return (
    <div className="payment-page">

      <div className="payment-container">

        <div className="payment-header">

          <h1>
            Complete Your Payment
          </h1>

          <p>
            Choose your preferred payment method
          </p>

        </div>

        <div className="payment-content">

          <div className="payment-methods">

            <h2>
              Payment Method
            </h2>

            {paymentMethods.map(
              (method) => {

                const Icon = method.icon;

                return (
                  <button
                    key={method.id}
                    type="button"
                    className={`payment-method ${
                      paymentMethod ===
                      method.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setPaymentMethod(
                        method.id
                      )
                    }
                    disabled={
                      paymentLoading ||
                      paymentId !== null
                    }
                  >

                    <div className="payment-method-icon">
                      <Icon size={22} />
                    </div>

                    <div className="payment-method-info">

                      <strong>
                        {method.name}
                      </strong>

                      <span>
                        {method.description}
                      </span>

                    </div>

                    <div className="payment-radio">

                      {paymentMethod ===
                        method.id && (
                        <div className="payment-radio-dot" />
                      )}

                    </div>

                  </button>
                );

              }
            )}

          </div>

          <div className="payment-summary">

            <h2>
              Booking Summary
            </h2>

            <div className="summary-row">

              <span>
                Package
              </span>

              <strong>
                {booking.packageName ||
                  "-"}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Destination
              </span>

              <strong>
                {booking.destination ||
                  "-"}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Travel Date
              </span>

              <strong>
                {formattedTravelDate}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Payment Method
              </span>

              <strong>
                {paymentMethod}
              </strong>

            </div>

            <div className="summary-divider" />

            <div className="summary-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹{formattedAmount}
              </strong>

            </div>

            {paymentId && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "12px 14px",
                  borderRadius: "9px",
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  color: "#9a3412",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontWeight: "600",
                  }}
                >
                  <Clock size={16} />

                  Payment Status: {paymentStatus}
                </div>

                <div
                  style={{
                    marginTop: "4px",
                  }}
                >
                  Your payment has been created and is
                  waiting for completion.
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: "10px",
                marginBottom: "8px",
              }}
            >

              <label
                htmlFor="paidAmount"
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#413850",
                }}
              >
                Test Payment Amount
              </label>

              <input
                id="paidAmount"
                type="number"
                min="1"
                step="0.01"
                value={paidAmount}
                onChange={(event) =>
                  setPaidAmount(
                    event.target.value
                  )
                }
                placeholder={`Enter ₹${formattedAmount}`}
                disabled={
                  paymentLoading ||
                  !paymentId
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px 14px",
                  border: "1px solid #dcd6e8",
                  borderRadius: "10px",
                  fontSize: "15px",
                  outline: "none",
                }}
              />

            </div>

            {paymentError && (
              <div
                style={{
                  marginTop: "14px",
                  marginBottom: "14px",
                  padding: "12px 14px",
                  borderRadius: "9px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                {paymentError}
              </div>
            )}

            {!paymentId ? (

              <button
                type="button"
                className="pay-now-button"
                onClick={handleCreatePayment}
                disabled={paymentLoading}
              >

                {paymentLoading ? (
                  "Creating Payment..."
                ) : (
                  <>
                    <Clock size={18} />
                    Create Payment
                  </>
                )}

              </button>

            ) : (

              <button
                type="button"
                className="pay-now-button"
                onClick={handleProcessPayment}
                disabled={paymentLoading}
              >

                {paymentLoading ? (
                  "Processing Payment..."
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Pay ₹{formattedAmount}
                  </>
                )}

              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default PaymentPage;