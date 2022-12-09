package it.akademija.order;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderDAO extends JpaRepository<Orders, Integer> {
	
	@Query("SELECT e FROM Orders e WHERE e.username = ?1")
	public List<Orders> findByUsername (String username);
	
	Page<Orders> findAll(Pageable pageable);
}
