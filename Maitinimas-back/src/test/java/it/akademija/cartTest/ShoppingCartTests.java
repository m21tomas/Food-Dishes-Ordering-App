package it.akademija.cartTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.annotation.Rollback;

import it.akademija.cart.CartItem;
import it.akademija.cart.CartItemDAO;
import it.akademija.dish.Dish;
import it.akademija.user.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Rollback(false)
public class ShoppingCartTests {
	
	@Autowired
	private CartItemDAO cartRepo;
	
	@Autowired
	private TestEntityManager entityManager;
	
	@Disabled
	public void testAddOneCartItem() {
		//4239, 4245, 4249, 4252
		Dish dish = entityManager.find(Dish.class, 4249L);
		User user = entityManager.find(User.class, 2L);
		
		CartItem newItem = new CartItem();
		newItem.setUser(user);
		newItem.setDish(dish);
		newItem.setQuantity(2);
		
		CartItem savedCartItem = cartRepo.save(newItem);
		assertTrue(savedCartItem.getId() > 0);
	}
	@Disabled
	public void testGetCartItemsByUser() {
		User user = new User();
		user.setUserId(2L);
		user.setUsername("user@user.lt");
		//user.setUsername("TestUsername");
		
		List<CartItem> cartItems = cartRepo.findByUser(user);

		assertEquals(1, cartItems.size());
	}
}
