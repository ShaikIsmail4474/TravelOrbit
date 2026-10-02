package travelapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import travelapp.dto.TravelPackageRequest;
import travelapp.entity.TravelPackage;
import travelapp.exception.ResourceNotFoundException;
import travelapp.repository.TravelPackageRepository;

@Service
@RequiredArgsConstructor
public class TravelPackageService {

    private final TravelPackageRepository repository;

    public TravelPackage createPackage(
            TravelPackageRequest request
    ) {

        TravelPackage travelPackage =
                TravelPackage.builder()
                        .name(request.getName())
                        .destination(request.getDestination())
                        .description(request.getDescription())
                        .price(request.getPrice())
                        .durationDays(request.getDurationDays())
                        .image(request.getImage())
                        .build();

        return repository.save(travelPackage);
    }

    public List<TravelPackage> getAllPackages() {
        return repository.findAll();
    }

    public TravelPackage getPackageById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Travel package not found with id: "
                                        + id
                        )
                );
    }

    public TravelPackage updatePackage(
            Long id,
            TravelPackageRequest request
    ) {

        TravelPackage travelPackage =
                getPackageById(id);

        travelPackage.setName(request.getName());
        travelPackage.setDestination(request.getDestination());
        travelPackage.setDescription(request.getDescription());
        travelPackage.setPrice(request.getPrice());
        travelPackage.setDurationDays(request.getDurationDays());
        travelPackage.setImage(request.getImage());

        return repository.save(travelPackage);
    }

    public void deletePackage(Long id) {

        TravelPackage travelPackage =
                getPackageById(id);

        repository.delete(travelPackage);
    }
}