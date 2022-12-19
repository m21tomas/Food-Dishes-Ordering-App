package it.akademija.canteen;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CanteenDAO extends JpaRepository<Canteen, Long>{
	
	Canteen findByName(String name);
	
	@Query("SELECT u FROM Canteen u WHERE u.code =?1")
	Canteen findByCanteenCode(Long code);
	
//	@Query("SELECT new Canteen(c.code, c.name, c.address, c.imagename, c.menus) FROM Canteen c WHERE LOWER(c.name) LIKE LOWER(concat('%', ?1,'%'))")
//	Page<Canteen> findByNameContainingIgnoreCase(String name, Pageable pageable);
//	
//	@Query("SELECT new Canteen(c.code, c.name, c.address, c.imagename, c.menus) FROM Canteen c WHERE LOWER(c.address) LIKE LOWER(concat('%', ?1,'%'))")
//	Page<Canteen> findByAddressContainingIgnoreCase(String address, Pageable pageable);
//	
	@Query("SELECT c FROM Canteen c WHERE LOWER(c.name) LIKE LOWER(concat('%', ?1,'%'))")
	Page<Canteen> findByNameContainingIgnoreCase(String name, Pageable pageable);
	
	@Query("SELECT c FROM Canteen c WHERE LOWER(c.address) LIKE LOWER(concat('%', ?1,'%'))")
	Page<Canteen> findByAddressContainingIgnoreCase(String address, Pageable pageable);
	
	void deleteByName(String name);
	
	Page<Canteen> findAll(Pageable pageable);
}
