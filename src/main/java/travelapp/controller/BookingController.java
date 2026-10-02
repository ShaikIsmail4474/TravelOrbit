package travelapp.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import travelapp.dto.BookingResponse;
import travelapp.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            Authentication authentication,
            @RequestParam Long packageId,
            @RequestParam LocalDate travelDate
    ) {

        BookingResponse booking =
                bookingService.createBooking(
                        authentication,
                        packageId,
                        travelDate
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(booking);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingsByUser(authentication)
        );
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    @PutMapping("/{bookingId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam String status
    ) {

        BookingResponse updatedBooking =
                bookingService.updateBookingStatus(
                        bookingId,
                        status
                );

        return ResponseEntity.ok(updatedBooking);
    }
}