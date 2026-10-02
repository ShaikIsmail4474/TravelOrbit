package travelapp.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import travelapp.entity.TravelPackage;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {
}
