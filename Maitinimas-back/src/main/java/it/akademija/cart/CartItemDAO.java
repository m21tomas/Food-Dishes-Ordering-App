package it.akademija.cart;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import it.akademija.dish.Dish;
import it.akademija.user.User;

public interface CartItemDAO extends JpaRepository<CartItem, Integer> {
	
	public List<CartItem> findByUser(User user);
	
	public CartItem findByUserAndDish(User user, Dish dish);
	
	@Modifying
	@Query("UPDATE CartItem c SET c.quantity = ?1 WHERE c.dish.id = ?2 "+
	       "AND c.user.id = ?3")
	public void updateQuantity(Integer quantity, Long dishId, Long userId);
}
