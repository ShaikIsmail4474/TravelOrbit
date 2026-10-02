package travelapp.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import travelapp.dto.TravelPackageRequest;
import travelapp.entity.TravelPackage;
import travelapp.service.TravelPackageService;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class TravelPackageController {

    private final TravelPackageService service;

    @PostMapping
    public ResponseEntity<TravelPackage> createPackage(
            @Valid @RequestBody TravelPackageRequest request) {

        TravelPackage travelPackage = service.createPackage(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(travelPackage);
    }

    @GetMapping
    public ResponseEntity<List<TravelPackage>> getAllPackages() {
        return ResponseEntity.ok(service.getAllPackages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TravelPackage> getPackageById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.getPackageById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TravelPackage> updatePackage(
            @PathVariable Long id,
            @Valid @RequestBody TravelPackageRequest request) {

        return ResponseEntity.ok(
                service.updatePackage(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(
            @PathVariable Long id) {

        service.deletePackage(id);

        return ResponseEntity.noContent().build();
    }
}