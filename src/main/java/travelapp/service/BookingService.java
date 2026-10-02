package travelapp.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import travelapp.dto.BookingResponse;
import travelapp.entity.Booking;
import travelapp.entity.TravelPackage;
import travelapp.entity.User;
import travelapp.repository.BookingRepository;
import travelapp.repository.TravelPackageRepository;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final ZoneId INDIA_ZONE =
            ZoneId.of("Asia/Kolkata");

    private final BookingRepository bookingRepository;
    private final TravelPackageRepository travelPackageRepository;

    public BookingResponse createBooking(
            Authentication authentication,
            Long packageId,
            LocalDate travelDate
    ) {

        User user = (User) authentication.getPrincipal();

        TravelPackage travelPackage =
                travelPackageRepository.findById(packageId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Travel package not found"
                                )
                        );

        LocalDate currentDate =
                LocalDate.now(INDIA_ZONE);

        LocalTime currentTime =
                LocalTime.now(INDIA_ZONE);

        Booking booking = Booking.builder()
                .user(user)
                .travelPackage(travelPackage)
                .bookingDate(currentDate)
                .bookingTime(currentTime)
                .travelDate(travelDate)
                .status("PENDING")
                .build();

        Booking savedBooking =
                bookingRepository.save(booking);

        return convertToResponse(savedBooking);
    }

    public List<BookingResponse> getBookingsByUser(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return bookingRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<BookingResponse> getAllBookings() {

        return bookingRepository
                .findAllByOrderByBookingDateDescBookingTimeDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public BookingResponse updateBookingStatus(
            Long bookingId,
            String status
    ) {

        Booking booking =
                bookingRepository
                        .findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );

        if (!status.equals("PENDING")
                && !status.equals("CONFIRMED")
                && !status.equals("CANCELLED")) {

            throw new IllegalArgumentException(
                    "Invalid booking status"
            );
        }

        booking.setStatus(status);

        Booking updatedBooking =
                bookingRepository.save(booking);

        return convertToResponse(updatedBooking);
    }

    private BookingResponse convertToResponse(
            Booking booking
    ) {

        User user = booking.getUser();

        TravelPackage travelPackage =
                booking.getTravelPackage();

        return BookingResponse.builder()
                .id(booking.getId())

                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())

                .packageId(travelPackage.getId())
                .packageName(travelPackage.getName())
                .destination(travelPackage.getDestination())
                .price(travelPackage.getPrice())
                .durationDays(travelPackage.getDurationDays())

                .bookingDate(booking.getBookingDate())
                .bookingTime(booking.getBookingTime())
                .travelDate(booking.getTravelDate())
                .status(booking.getStatus())

                .build();
    }
}