package it.akademija.menu;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuDAO extends JpaRepository<Menu, Long> {

	Optional<Menu> findByName(String name);

}
