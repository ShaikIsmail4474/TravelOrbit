package travelapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminPaymentResponse {

    private Long paymentId;

    private Long bookingId;

    private String customerName;

    private String customerEmail;

    private String packageName;

    private String destination;

    private BigDecimal amount;

    private String currency;

    private String paymentMethod;

    private String transactionId;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime paidAt;
}