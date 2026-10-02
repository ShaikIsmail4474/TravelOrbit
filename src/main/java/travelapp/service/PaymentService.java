package travelapp.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import travelapp.dto.AdminPaymentResponse;
import travelapp.dto.PaymentResponse;
import travelapp.entity.Booking;
import travelapp.entity.Payment;
import travelapp.entity.User;
import travelapp.repository.BookingRepository;
import travelapp.repository.PaymentRepository;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    /*
     * CUSTOMER:
     * Create a new test payment for a booking.
     *
     * Payment is initially created with PENDING status.
     */
    @Transactional
    public PaymentResponse createTestPayment(
            Authentication authentication,
            Long bookingId,
            String paymentMethod
    ) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User must be logged in.");
        }

        /*
         * JwtAuthenticationFilter stores the complete User
         * object as the authentication principal.
         */
        User user = (User) authentication.getPrincipal();

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found.")
                );

        /*
         * Make sure the booking belongs to the logged-in customer.
         */
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to make payment for this booking."
            );
        }

        /*
         * Prevent duplicate payment creation.
         */
        if (paymentRepository.existsByBookingId(bookingId)) {
            throw new RuntimeException(
                    "A payment already exists for this booking."
            );
        }

        /*
         * Validate payment method.
         */
        if (paymentMethod == null ||
                paymentMethod.trim().isEmpty()) {

            throw new RuntimeException(
                    "Payment method is required."
            );
        }

        String method = paymentMethod
                .trim()
                .toUpperCase();

        if (!method.equals("UPI") &&
                !method.equals("CARD") &&
                !method.equals("WALLET")) {

            throw new RuntimeException(
                    "Invalid payment method. Use UPI, CARD or WALLET."
            );
        }

        /*
         * Create PENDING payment.
         */
        Payment payment = new Payment();

        payment.setBooking(booking);

        payment.setAmount(
                booking.getTravelPackage().getPrice()
        );

        payment.setCurrency("INR");

        payment.setPaymentMethod(method);

        payment.setStatus("PENDING");

        payment.setCreatedAt(
                LocalDateTime.now()
        );

        payment.setTransactionId(null);

        payment.setPaidAt(null);

        Payment savedPayment =
                paymentRepository.save(payment);

        return mapToPaymentResponse(savedPayment);
    }

    /*
     * CUSTOMER:
     * Process a pending test payment.
     *
     * Correct amount:
     *     Payment becomes SUCCESS
     *     Booking becomes CONFIRMED
     *
     * Incorrect amount:
     *     Payment remains PENDING
     *     Failure message is returned
     *     Customer can retry
     */
    @Transactional
    public PaymentResponse processTestPayment(
            Authentication authentication,
            Long paymentId,
            BigDecimal paidAmount
    ) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User must be logged in.");
        }

        /*
         * Get the logged-in User directly from JWT authentication.
         */
        User user = (User) authentication.getPrincipal();

        Payment payment = paymentRepository
                .findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found.")
                );

        Booking booking = payment.getBooking();

        /*
         * Make sure the payment belongs to the logged-in customer.
         */
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to process this payment."
            );
        }

        /*
         * Prevent processing an already successful payment.
         */
        if ("SUCCESS".equalsIgnoreCase(payment.getStatus())) {
            throw new RuntimeException(
                    "This payment has already been completed."
            );
        }

        /*
         * Only PENDING payments can be processed.
         */
        if (!"PENDING".equalsIgnoreCase(payment.getStatus())) {
            throw new RuntimeException(
                    "Only pending payments can be processed."
            );
        }

        /*
         * Amount is required.
         */
        if (paidAmount == null) {
            throw new RuntimeException(
                    "Payment amount is required."
            );
        }

        /*
         * Expected amount comes from the travel package.
         */
        BigDecimal expectedAmount =
                booking.getTravelPackage().getPrice();

        /*
         * WRONG AMOUNT:
         *
         * Do NOT save FAILED.
         *
         * Payment remains PENDING so the customer
         * can correct the amount and retry.
         */
        if (paidAmount.compareTo(expectedAmount) != 0) {

            throw new RuntimeException(
                    "Payment failed. Exact amount of ₹"
                            + expectedAmount
                            + " is required."
            );
        }

        /*
         * CORRECT AMOUNT:
         *
         * Complete the test payment.
         */
        payment.setStatus("SUCCESS");

        payment.setTransactionId(
                "TEST-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12)
                        .toUpperCase()
        );

        payment.setPaidAt(
                LocalDateTime.now()
        );

        /*
         * Successful payment confirms the booking.
         */
        booking.setStatus("CONFIRMED");

        bookingRepository.save(booking);

        Payment savedPayment =
                paymentRepository.save(payment);

        return mapToPaymentResponse(savedPayment);
    }

    /*
     * CUSTOMER:
     * Get payment details for a specific booking.
     */
    public PaymentResponse getPaymentByBooking(
            Authentication authentication,
            Long bookingId
    ) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User must be logged in.");
        }

        /*
         * Get logged-in User directly from JWT authentication.
         */
        User user = (User) authentication.getPrincipal();

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found.")
                );

        /*
         * Customer can only view their own booking payment.
         */
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to view this payment."
            );
        }

        Payment payment = paymentRepository
                .findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for this booking."
                        )
                );

        return mapToPaymentResponse(payment);
    }

    /*
     * ADMIN:
     * Get all payments.
     *
     * Admin can monitor payments but cannot process them.
     */
    public List<AdminPaymentResponse> getAllPaymentsForAdmin() {

        return paymentRepository
                .findAll()
                .stream()
                .map(this::mapToAdminPaymentResponse)
                .collect(Collectors.toList());
    }

    /*
     * Convert Payment entity to customer response.
     */
    private PaymentResponse mapToPaymentResponse(
            Payment payment
    ) {

        PaymentResponse response =
                new PaymentResponse();

        response.setId(
                payment.getId()
        );

        response.setBookingId(
                payment.getBooking().getId()
        );

        response.setAmount(
                payment.getAmount()
        );

        response.setCurrency(
                payment.getCurrency()
        );

        response.setPaymentMethod(
                payment.getPaymentMethod()
        );

        response.setTransactionId(
                payment.getTransactionId()
        );

        response.setStatus(
                payment.getStatus()
        );

        response.setCreatedAt(
                payment.getCreatedAt()
        );

        response.setPaidAt(
                payment.getPaidAt()
        );

        return response;
    }

    /*
     * Convert Payment entity to admin response.
     */
    private AdminPaymentResponse mapToAdminPaymentResponse(
            Payment payment
    ) {

        Booking booking =
                payment.getBooking();

        User user =
                booking.getUser();

        return AdminPaymentResponse.builder()
                .paymentId(payment.getId())
                .bookingId(booking.getId())
                .customerName(user.getName())
                .customerEmail(user.getEmail())
                .packageName(
                        booking.getTravelPackage().getName()
                )
                .destination(
                        booking.getTravelPackage().getDestination()
                )
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .paidAt(payment.getPaidAt())
                .build();
    }
}