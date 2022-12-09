package it.akademija.cart;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.akademija.user.UserDTO;
import it.akademija.user.UserService;

@SpringBootTest
@TestMethodOrder(OrderAnnotation.class)
public class CartServiceTest {
	
	@Autowired
	private CartService cartService;
	
	@Autowired
	private UserService userService;
	
	@Test
	@Order(1)
	void testAddDishToCart () {
		var response = cartService.addDishToCart(3188L, 4241L, 1, "manager@manager.lt");
		
		Integer quantity = response.getBody().getQuantityInCart();
		
		String serMesg = response.getBody().getServiceResponse();
		
		assertNull(response.getBody().getUsername());
		
		assertEquals("Unauthorised request. No user found.", serMesg);
		
		assertNotEquals(1, quantity);	
		
		response = cartService.addDishToCart(3188L, 4241L, 1, "admin@admin.lt");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertNotNull(response.getBody().getUsername());
		
		assertEquals("Unauthorised request. Only a registered user can request the list of cart items.", serMesg);
		
		assertNotEquals(1, quantity);	
		
		response = cartService.addDishToCart(31880L, 4241L, 1, "user@user.lt");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertNull(quantity);
		
		assertEquals("No such menu with id: 31880 that would have dish with id: 4241. Provide existing menu and dish IDs.", serMesg);
		
	    response = cartService.addDishToCart(3188L, 4241L, 1, "user@user.lt");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertEquals(1, quantity);
		
		assertEquals("1 new dish was added to your cart.", serMesg);
		
		response = cartService.addDishToCart(3188L, 4241L, 1, "user@user.lt");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertEquals(2, quantity);
		
		assertEquals("Now in the cart you have 2 units of this dish.", serMesg);
		
		response = cartService.addDishToCart(3189L, 4243L, 1, "user@user.lt");
		
		assertEquals("Ukrainietiški barščiai (klasikinis receptas)", response.getBody().getDishName());
		
		response = cartService.addDishToCart(4251L, 4252L, 1, "user@user.lt");
		
		assertEquals("Šokoladinis tinginys be pieno produktų", response.getBody().getDishName());
		
		response = cartService.addDishToCart(3188L, 4241L, -1, "user@user.lt");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertEquals(-1, quantity);
		
		assertEquals("You cannot add negative amount of product to your cart. Please provide positive number.", serMesg);
	}
	
	@Test
	@Order(2)
	void testListCartItems() {
		var response = cartService.listCartItems("manager@manager.lt");
		
		assertNull(response.getBody().get(0).getUsername());
		
		assertEquals("Unauthorised request. No user found.", response.getBody().get(0).getServiceResponse());
		
		assertNotEquals(1, response.getBody().get(0).getQuantityInCart());	
		
		response = cartService.listCartItems("admin@admin.lt");
		
		assertEquals("admin@admin.lt", response.getBody().get(0).getUsername());
		
		assertEquals("Unauthorised request. Only a registered user can request the list of cart items.", response.getBody().get(0).getServiceResponse());
		
		assertNull(response.getBody().get(0).getQuantityInCart());
		
		response = cartService.listCartItems("user@user.lt");
		
		assertTrue(response.getBody().size() == 3);
		
		assertEquals("An item in your cart.", response.getBody().get(0).getServiceResponse());
		
		assertEquals(2, response.getBody().get(0).getQuantityInCart());
		
		UserDTO userDTO = new UserDTO("USER", "userTestMail01@google.com", "testUserName", "testUserPass123");
		
		userService.createUser(userDTO);
		
		response = cartService.listCartItems("testUserName");
		
		assertNull(response.getBody().get(0).getDishId());
		
		assertEquals("You don't have any dishes in your account.", response.getBody().get(0).getServiceResponse());
		
		assertEquals("testUserName", response.getBody().get(0).getUsername());
		
		userService.deleteUser("testUserName");
	}
	
	@Test
	@Order(3)
	void testUpdateQuantity() {
		var response = cartService.updateQuantity(3188L, 4241L, 1, "manager@manager.lt");
		
		assertNull(response.getBody().getQuantityInCart());
		
		assertNull(response.getBody().getUsername());
		
		assertEquals("Unauthorised request. No user found.", response.getBody().getServiceResponse());
		
		response = cartService.updateQuantity(3188L, 4241L, 1, "admin@admin.lt");
		
		assertNull(response.getBody().getQuantityInCart());
		
		assertNotNull(response.getBody().getUsername());
		
		assertEquals("Unauthorised request. Only a registered user can request the list of cart items.", response.getBody().getServiceResponse());
		
		response = cartService.updateQuantity(3188L, 42410L, 1, "user@user.lt");
		
		assertNull(response.getBody().getQuantityInCart());
		
		assertEquals("user@user.lt", response.getBody().getUsername());
		
		assertEquals("No such menu with id: 3188 that would have dish with id: 42410. Provide existing menu and dish IDs.", 
				response.getBody().getServiceResponse());
		
		response = cartService.updateQuantity(3188L, 4241L, 0, "user@user.lt");
		
		assertEquals(0, response.getBody().getQuantityInCart());
		
		assertEquals("The dish quanity is NOT UPDATED. Quantity value should be positive integer number. Dish and menu ids should also be correct.", 
				response.getBody().getServiceResponse());
		
		response = cartService.updateQuantity(3188L, 4241L, 3, "user@user.lt");
		
		assertEquals(3, response.getBody().getQuantityInCart());
		
		assertEquals("The dish quanity is updated to 3", 
				response.getBody().getServiceResponse());
	}
	
	@Test
	@Order(4)
	void testRemoveDishFromCart () {
		var response = cartService.removeDishFromCart(661, "admin@admin.lt");
		
		assertEquals("Unauthorised request. Only a registered user can request the list of cart items.", response.getBody());
		
		response = cartService.removeDishFromCart(661, "testUser@user.lt");
		
		assertEquals("Unauthorised request. No user found.", response.getBody());
		
		response = cartService.removeDishFromCart(661, "user@user.lt");
		
		assertEquals("No such item in your cart. Provide appropriate existing cart item id.", response.getBody());
		
		var response2 = cartService.listCartItems("user@user.lt");
		
		int size = response2.getBody().size();
		
		int cartItemId = response2.getBody().get(0).getCartItemId();
		
		response = cartService.removeDishFromCart(cartItemId, "user@user.lt");
		
		assertEquals("Dish was removed from your cart succesfully.", response.getBody());
		
		response2 = cartService.listCartItems("user@user.lt");
		
		assertTrue(response2.getBody().size() < size);
	}
	
	//@Ignore
	@Test
	@Order(5)
	void testRemoveAllUserProductsAtEndOfTest() {
		
		var response = cartService.listCartItems("user@user.lt");
		
		int size0 = response.getBody().size();
		
		if(size0 > 0) {
			String serverResponse = cartService.removeAllUserProducts("user@user.lt").getBody();
			
			assertEquals("All products were removed from your cart.", serverResponse);
		}
		else {
			assertEquals(0, size0);
		}
	}
}
