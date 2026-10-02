package travelapp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

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
public class BookingResponse {

    private Long id;

    private Long userId;
    private String userName;
    private String userEmail;

    private Long packageId;
    private String packageName;
    private String destination;
    private BigDecimal price;
    private Integer durationDays;

    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private LocalDate travelDate;
    private String status;
}