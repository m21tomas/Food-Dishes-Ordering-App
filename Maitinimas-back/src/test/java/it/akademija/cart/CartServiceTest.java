package it.akademija.cart;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.akademija.canteen.CanteenDTO;
import it.akademija.canteen.CanteenService;
import it.akademija.canteen.CanteenWithAnImageDTO;
import it.akademija.dish.DishDTO;
import it.akademija.menu.CanteenMenuDTO;
import it.akademija.menu.Menu;
import it.akademija.menu.MenuService;
import it.akademija.user.UserDTO;
import it.akademija.user.UserService;

@SpringBootTest
@TestMethodOrder(OrderAnnotation.class)
public class CartServiceTest {
	
	@Autowired
	private CartService cartService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private MenuService menuService;
	
	@Autowired
	private CanteenService canteenService;
	
	@Test
	@Order(1)
	void testCreateTestCanteenUserMenuDishes () {
		CanteenDTO testCanteen = new CanteenDTO(111111112L, "testCanteen2", "testCanteenAddress2");
		
		boolean savedCanteen = canteenService.createNewCanteen(testCanteen);
		
		assertTrue(savedCanteen);
		
		boolean existCanteen = canteenService.existsById(111111112L, "testCanteen2");
		
		assertTrue(existCanteen);
		
		CanteenMenuDTO menu = new CanteenMenuDTO(111111112L, "testMenu2");
		
		boolean createdMenu = menuService.createNewMenu(menu);
		
		assertTrue(createdMenu);
		CanteenWithAnImageDTO canteen = null;
		try {
			canteen = canteenService.getCanteenById(111111112L);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		assertNotNull(canteen);
		
		long menuId = 0;
		for(Menu item : canteen.getMenus()) {
			if(item.getName().equals("testMenu2")) {
				menuId = item.getId();
			}
		}
		
		menuService.addNewDishToMenu(menuId, new DishDTO("testDish1", "testDescription1"));
		menuService.addNewDishToMenu(menuId, new DishDTO("testDish2", "testDescription2"));
		menuService.addNewDishToMenu(menuId, new DishDTO("testDish3", "testDescription3"));
		
		Menu thisMenu = menuService.getMenuById(menuId);
		
		assertEquals("testDish1", thisMenu.getDishes().get(0).getName());
		
		UserDTO user1DTO = new UserDTO("USER", "testUser02@gmail.com", "User2", "testUser221");
		
		userService.createUser(user1DTO);
		
		var response = userService.findByUsername("User2");
		
		assertEquals("testUser02@gmail.com", response.getEmail());
	}
	
	@Test
	@Order(2)
	void testAddDishToCart () {
		CanteenWithAnImageDTO canteen = null;
		try {
			canteen = canteenService.getCanteenById(111111112L);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		long menuId = 0;
		for(Menu item : canteen.getMenus()) {
			menuId = item.getId();
		}
		
		Menu thisMenu = menuService.getMenuById(menuId);
		
		long dishId1 = thisMenu.getDishes().get(0).getId();
		long dishId2 = thisMenu.getDishes().get(1).getId();
		long dishId3 = thisMenu.getDishes().get(2).getId();
		
		var response = cartService.addDishToCart(menuId, dishId1, 1, "manager@manager.lt");
		
		Integer quantity = response.getBody().getQuantityInCart();
		
		String serMesg = response.getBody().getServiceResponse();
		
		assertNull(response.getBody().getUsername());
		
		assertEquals("Unauthorised request. No user found.", serMesg);
		
		assertNotEquals(1, quantity);	
		
		response = cartService.addDishToCart(menuId, dishId2, 1, "admin@admin.lt");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertNotNull(response.getBody().getUsername());
		
		assertEquals("Unauthorised request. Only a registered user can request the list of cart items.", serMesg);
		
		assertNotEquals(1, quantity);	
		
		response = cartService.addDishToCart(menuId+1, dishId3, 1, "User2");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertNull(quantity);
		
		assertEquals("No such menu with id: "+(menuId+1)+" that would have dish with id: "+dishId3+". Provide existing menu and dish IDs.", serMesg);
		
	    response = cartService.addDishToCart(menuId, dishId2, 1, "User2");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertEquals(1, quantity);
		
		assertEquals("1 new dish was added to your cart.", serMesg);
		
		response = cartService.addDishToCart(menuId, dishId2, 1, "User2");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertEquals(2, quantity);
		
		assertEquals("Now in the cart you have 2 units of this dish.", serMesg);
		
		response = cartService.addDishToCart(menuId, dishId3, 1, "User2");
		
		assertEquals("testDish3", response.getBody().getDishName());
		
		response = cartService.addDishToCart(menuId, dishId1, 1, "User2");
		
		assertEquals("testDish1", response.getBody().getDishName());
		
		response = cartService.addDishToCart(menuId, dishId1, -1, "User2");
		
		quantity = response.getBody().getQuantityInCart();
		
		serMesg = response.getBody().getServiceResponse();
		
		assertEquals(-1, quantity);
		
		assertEquals("You cannot add negative amount of product to your cart. Please provide positive number.", serMesg);
	}
	
	@Test
	@Order(3)
	void testListCartItems() {
		var response = cartService.listCartItems("manager@manager.lt");
		
		assertNull(response.getBody().get(0).getUsername());
		
		assertEquals("Unauthorised request. No user found.", response.getBody().get(0).getServiceResponse());
		
		assertNotEquals(1, response.getBody().get(0).getQuantityInCart());	
		
		response = cartService.listCartItems("admin@admin.lt");
		
		assertEquals("admin@admin.lt", response.getBody().get(0).getUsername());
		
		assertEquals("Unauthorised request. Only a registered user can request the list of cart items.", response.getBody().get(0).getServiceResponse());
		
		assertNull(response.getBody().get(0).getQuantityInCart());
		
		response = cartService.listCartItems("User2");
		
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
	@Order(4)
	void testUpdateQuantity() {
		List<CartItemsResponseDTO> cartItemsList = cartService.listCartItems("User2").getBody();
		
		CanteenWithAnImageDTO canteen = null;
		try {
			canteen = canteenService.getCanteenById(111111112L);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		long menuId = 0;
		for(Menu item : canteen.getMenus()) {
			menuId = item.getId();
		}
		
		Menu thisMenu = menuService.getMenuById(menuId);
		
		long dishId1 = thisMenu.getDishes().get(0).getId();
		long dishId2 = thisMenu.getDishes().get(1).getId();
		long dishId3 = thisMenu.getDishes().get(2).getId();
		
		var response = cartService.updateQuantity(cartItemsList.get(0).getCartItemId(), dishId1, 1, "manager@manager.lt");
		
		assertNull(response.getBody().getQuantityInCart());
		
		assertNull(response.getBody().getUsername());
		
		assertEquals("Unauthorised request. No user found.", response.getBody().getServiceResponse());
		
		response = cartService.updateQuantity(cartItemsList.get(0).getCartItemId(), dishId2, 1, "admin@admin.lt");
		
		assertNull(response.getBody().getQuantityInCart());
		
		assertNotNull(response.getBody().getUsername());
		
		assertEquals("Unauthorised request. Only a registered user can request the list of cart items.", response.getBody().getServiceResponse());
		
		response = cartService.updateQuantity(cartItemsList.get(0).getCartItemId()+100, dishId3, 1, "User2");
		
		assertEquals("User2", response.getBody().getUsername());
		
		assertEquals("No such cart item with id: "+(cartItemsList.get(0).getCartItemId()+100)+" that would have dish with id: "+dishId3+". Provide existing cart and dish IDs.", 
				response.getBody().getServiceResponse());
		
		response = cartService.updateQuantity(cartItemsList.get(2).getCartItemId(), dishId1, 0, "User2");
		
		assertEquals(0, response.getBody().getQuantityInCart());
		
		assertEquals("The dish quantity is NOT UPDATED. Quantity value should be positive integer number. Dish and cart item ids should also be correct. \n"
				+ "Parameters - cartItemId:" + cartItemsList.get(2).getCartItemId()+ ", dishId:" + dishId1 + ", quantity:" + 0, 
				response.getBody().getServiceResponse());
		
		response = cartService.updateQuantity(cartItemsList.get(2).getCartItemId(), dishId1, 3, "User2");
		
		assertEquals(3, response.getBody().getQuantityInCart());
		
		assertEquals("The dish quanity is updated to 3", 
				response.getBody().getServiceResponse());
	}
	
	@Test
	@Order(5)
	void testRemoveDishFromCart () {
		List<CartItemsResponseDTO> cartItemsList = cartService.listCartItems("User2").getBody();
		
		var response = cartService.removeDishFromCart(cartItemsList.get(0).getCartItemId(), "admin@admin.lt");
		
		assertEquals("Unauthorised request. Only a registered user can request the list of cart items.", response.getBody());
		
		response = cartService.removeDishFromCart(cartItemsList.get(0).getCartItemId(), "testUser@user.lt");
		
		assertEquals("Unauthorised request. No user found.", response.getBody());
		
		response = cartService.removeDishFromCart(cartItemsList.get(0).getCartItemId()+3, "User2");
		
		assertEquals("No such item in your cart. Provide appropriate existing cart item id.", response.getBody());
		
		var response2 = cartService.listCartItems("User2");
		
		int size = response2.getBody().size();
		
		int cartItemId = response2.getBody().get(0).getCartItemId();
		
		response = cartService.removeDishFromCart(cartItemId, "User2");
		
		assertEquals("Dish was removed from your cart succesfully.", response.getBody());
		
		response2 = cartService.listCartItems("User2");
		
		assertTrue(response2.getBody().size() < size);
	}
	
	@Test
	@Order(6)
	void testRemoveAllUserProductsAtEndOfTest() {
		
		var response = cartService.listCartItems("User2");
		
		int size0 = response.getBody().size();
		
		if(size0 > 0) {
			String serverResponse = cartService.removeAllUserProducts("User2").getBody();
			
			assertEquals("All products were removed from your cart.", serverResponse);
		}
		else {
			assertEquals(0, size0);
		}
	}
	
	@Test
	@Order(7)
	void testRemoveTestCanteenUser() {
		canteenService.deleteCanteen(111111112L);
		userService.deleteUser("User2");
	}
}
