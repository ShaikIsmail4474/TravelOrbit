package travelapp.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import travelapp.dto.AdminPaymentResponse;
import travelapp.dto.PaymentResponse;
import travelapp.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /*
     * CUSTOMER:
     * Create a new pending payment for a booking.
     */
    @PostMapping("/create/{bookingId}")
    public ResponseEntity<PaymentResponse> createPayment(
            Authentication authentication,
            @PathVariable Long bookingId,
            @RequestParam String paymentMethod
    ) {

        PaymentResponse payment =
                paymentService.createTestPayment(
                        authentication,
                        bookingId,
                        paymentMethod
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(payment);
    }

    /*
     * CUSTOMER:
     * Process a pending payment.
     */
    @PostMapping("/{paymentId}/process")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentResponse> processPayment(
            Authentication authentication,
            @PathVariable Long paymentId,
            @RequestParam BigDecimal paidAmount
    ) {

        PaymentResponse payment =
                paymentService.processTestPayment(
                        authentication,
                        paymentId,
                        paidAmount
                );

        return ResponseEntity.ok(payment);
    }

    /*
     * CUSTOMER:
     * Get payment details for a specific booking.
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getPaymentByBooking(
            Authentication authentication,
            @PathVariable Long bookingId
    ) {

        return ResponseEntity.ok(
                paymentService.getPaymentByBooking(
                        authentication,
                        bookingId
                )
        );
    }

    /*
     * ADMIN:
     * Get all payment records.
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminPaymentResponse>> getAllPayments() {

        return ResponseEntity.ok(
                paymentService.getAllPaymentsForAdmin()
        );
    }
}