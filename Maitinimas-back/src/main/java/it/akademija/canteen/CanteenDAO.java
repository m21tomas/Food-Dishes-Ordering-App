package it.akademija.canteen;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CanteenDAO extends JpaRepository<Canteen, Long>{
	
	Canteen findByName(String name);
	
	@Query("SELECT u FROM Canteen u WHERE u.code =?1")
	Canteen findByCanteenCode(Long code);
	
	void deleteByName(String name);
	
	Page<Canteen> findAll(Pageable pageable);
}
