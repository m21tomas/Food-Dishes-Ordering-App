package it.akademija.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.akademija.cart.CartItemsResponseDTO;
import it.akademija.cart.CartService;
import it.akademija.user.UserDTO;
import it.akademija.user.UserService;

@SpringBootTest
@TestMethodOrder(OrderAnnotation.class)
public class OrderServiceTest {
	
	@Autowired
	private OrderService orderService;
	
	@Autowired
	private CartService cartService;
	
	@Autowired
	private UserService userService;
	
	@Test
	@Order(1)
	void testSeveralUsersCreateAndAddDishesToCart() {
		
		UserDTO user1DTO = new UserDTO("USER", "userMolesto01@gmail.com", "Molesto", "testMolesto223");
		UserDTO user2DTO = new UserDTO("USER", "userMuerte21@gmail.com", "Muerte", "testMuerte221");
		UserDTO user3DTO = new UserDTO("USER", "userHernandez12@gmail.com", "Hernandez", "testHernandez541");
		UserDTO user4DTO = new UserDTO("USER", "userGarcia82@gmail.com", "Garcia", "testGarcia522");
		UserDTO user5DTO = new UserDTO("USER", "userGefesto87@gmail.com", "Gefesto", "testGefesto336");
		UserDTO user6DTO = new UserDTO("USER", "userEsmeralda17@gmail.com", "Esmeralda", "testEsmeralda776");
		
		userService.createUser(user1DTO);
		userService.createUser(user2DTO);
		userService.createUser(user3DTO);
		userService.createUser(user4DTO);
		userService.createUser(user5DTO);
		userService.createUser(user6DTO);
		
		var response = userService.findByUsername("Garcia");
		
		assertEquals("userGarcia82@gmail.com", response.getEmail());
		
		var response2 = cartService.addDishToCart(3188L, 4241L, 2, "Molesto");
		    response2 = cartService.addDishToCart(3188L, 4239L, 1, "Molesto");
		    response2 = cartService.addDishToCart(3188L, 4240L, 3, "Molesto");
		    
		assertEquals("3 new dishes were added to your cart.", response2.getBody().getServiceResponse());
		    
		var getItems1 = cartService.listCartItems("Molesto");
		
		List<CartItemsResponseDTO> cartItems = getItems1.getBody();
		int quantity = 0;
		for(CartItemsResponseDTO items : cartItems) {
			quantity += items.getQuantityInCart();
		}
		    
		assertEquals(6, quantity);
		cartItems.removeAll(cartItems);
		quantity = 0;
		
		var response3 = cartService.addDishToCart(3188L, 4242L, 1, "Muerte");
			response3 = cartService.addDishToCart(3189L, 4243L, 2, "Muerte");
			
		assertEquals("2 new dishes were added to your cart.", response3.getBody().getServiceResponse());
		
		var getItems2 = cartService.listCartItems("Muerte");
		
		cartItems = getItems2.getBody();
		
		for(CartItemsResponseDTO items : cartItems) {
			quantity += items.getQuantityInCart();
		}
		
		assertEquals(3, quantity);
		cartItems.removeAll(cartItems);
		quantity = 0;
			
		var response4 = cartService.addDishToCart(3189L, 4244L, 1, "Hernandez");
			response4 = cartService.addDishToCart(3189L, 4245L, 4, "Hernandez");
			response4 = cartService.addDishToCart(3189L, 4246L, 2, "Hernandez");
		
			assertEquals("2 new dishes were added to your cart.", response4.getBody().getServiceResponse());
			
			var getItems3 = cartService.listCartItems("Hernandez");
			
			cartItems = getItems3.getBody();
			
			for(CartItemsResponseDTO items : cartItems) {
				quantity += items.getQuantityInCart();
			}
			
			assertEquals(7, quantity);
			cartItems.removeAll(cartItems);
			quantity = 0;
			
		var response5 = cartService.addDishToCart(4176L, 4247L, 3, "Garcia");
			response5 = cartService.addDishToCart(4176L, 4248L, 1, "Garcia");
		
			assertEquals("1 new dish was added to your cart.", response5.getBody().getServiceResponse());
			
			var getItems4 = cartService.listCartItems("Garcia");
			
			cartItems = getItems4.getBody();
			
			for(CartItemsResponseDTO items : cartItems) {
				quantity += items.getQuantityInCart();
			}
			
			assertEquals(4, quantity);
			cartItems.removeAll(cartItems);
			quantity = 0;
			
		var response6 = cartService.addDishToCart(4176L, 4249L, 1, "Gefesto");
			response6 = cartService.addDishToCart(4176L, 4250L, 1, "Gefesto");
			response6 = cartService.addDishToCart(4251L, 4252L, 1, "Gefesto");
		
			assertEquals("1 new dish was added to your cart.", response6.getBody().getServiceResponse());
			
			var getItems5 = cartService.listCartItems("Gefesto");
			
			cartItems = getItems5.getBody();
			
			for(CartItemsResponseDTO items : cartItems) {
				quantity += items.getQuantityInCart();
			}
			
			assertEquals(3, quantity);
			cartItems.removeAll(cartItems);
			quantity = 0;
			
		var response7 = cartService.addDishToCart(4251L, 4253L, 1, "Esmeralda");
			response7 = cartService.addDishToCart(4251L, 4254L, 4, "Esmeralda");
		
			assertEquals("4 new dishes were added to your cart.", response7.getBody().getServiceResponse());
			
			var getItems6 = cartService.listCartItems("Esmeralda");
			
			cartItems = getItems6.getBody();
			
			for(CartItemsResponseDTO items : cartItems) {
				quantity += items.getQuantityInCart();
			}
			
			assertEquals(5, quantity);
			cartItems.removeAll(cartItems);
			quantity = 0;
	}
	
	@Test
	@Order(2)
	void testCreateOrder() {
		var response = orderService.createOrder("Molesto");
		response = orderService.createOrder("Muerte");
		response = orderService.createOrder("Hernandez");
		response = orderService.createOrder("Garcia");
		response = orderService.createOrder("Gefesto");
		response = orderService.createOrder("Esmeralda");
		
		assertEquals("A new order is created successfully.", response.getBody());
	}
	
	@Test
	@Order(3)
	void testGetUserOrders() {
		var response = orderService.getUserOrders("Molesto");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders = (List<Orders>) response.getBody();
		String dishName = "";
		
		Set<Item> setItems = orders.get(0).getItems();
		
		Iterator<Item> items = setItems.iterator();
		
		while(items.hasNext()) {
			Item item = items.next();
			dishName = item.getDishName();
			if(dishName.equals("Cepelinai su mėsa"))
			break;
		}
		assertEquals("Cepelinai su mėsa", dishName);
		
		response = orderService.getUserOrders("Muerte");
			@SuppressWarnings("unchecked")
			List<Orders> orders2 = (List<Orders>) response.getBody();
			Set<Item> setItems2 = orders2.get(0).getItems();
			Iterator<Item> items2 = setItems2.iterator();
			int itemsCount2 = 0;
			while(items2.hasNext()) {
				Item item = items2.next();
				itemsCount2 += item.getQuantityInCart();
			}
			assertEquals(3, itemsCount2);
		
		response = orderService.getUserOrders("Hernandez");
			@SuppressWarnings("unchecked")
			List<Orders> orders3 = (List<Orders>) response.getBody();
			Set<Item> setItems3 = orders3.get(0).getItems();
			Iterator<Item> items3 = setItems3.iterator();
			int itemsCount3 = 0;
			while(items3.hasNext()) {
				Item item = items3.next();
				itemsCount3 += item.getQuantityInCart();
			}
			assertEquals(7, itemsCount3);
		
		response = orderService.getUserOrders("Garcia");
			@SuppressWarnings("unchecked")
			List<Orders> orders4 = (List<Orders>) response.getBody();
			Set<Item> setItems4 = orders4.get(0).getItems();
			Iterator<Item> items4 = setItems4.iterator();
			int itemsCount4 = 0;
			while(items4.hasNext()) {
				Item item = items4.next();
				itemsCount4 += item.getQuantityInCart();
			}
			assertEquals(4, itemsCount4);
		
		response = orderService.getUserOrders("Gefesto");
			@SuppressWarnings("unchecked")
			List<Orders> orders5 = (List<Orders>) response.getBody();
			Set<Item> setItems5 = orders5.get(0).getItems();
			Iterator<Item> items5 = setItems5.iterator();
			int itemsCount5 = 0;
			while(items5.hasNext()) {
				Item item = items5.next();
				itemsCount5 += item.getQuantityInCart();
			}
			assertEquals(3, itemsCount5);
		
		response = orderService.getUserOrders("Esmeralda");
			@SuppressWarnings("unchecked")
			List<Orders> orders6 = (List<Orders>) response.getBody();
			Set<Item> setItems6 = orders6.get(0).getItems();
			Iterator<Item> items6 = setItems6.iterator();
			int itemsCount6 = 0;
			while(items6.hasNext()) {
				Item item = items6.next();
				itemsCount6 += item.getQuantityInCart();
			}
			assertEquals(5, itemsCount6);
	}
	
	@Test
	@Order(4)
	void testGetAllOrders() {
		var response = orderService.getAllOrders("admin@admin.lt");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders = (List<Orders>) response.getBody();
		
		assertEquals(6, orders.size());
	}
	
	@Disabled
	void testRemoveAllTestUsersCartProducts() {
		var response1a = cartService.removeAllUserProducts("Molesto");
		assertEquals("All products were removed from your cart.", response1a.getBody());
		var response1b = cartService.listCartItems("Molesto");
		assertEquals("You don't have any dishes in your account.", response1b.getBody().get(0).getServiceResponse());
		
		var response2a = cartService.removeAllUserProducts("Muerte");
		assertEquals("All products were removed from your cart.", response2a.getBody());
		var response2b = cartService.listCartItems("Muerte");
		assertEquals("You don't have any dishes in your account.", response2b.getBody().get(0).getServiceResponse());
		
		var response3a = cartService.removeAllUserProducts("Hernandez");
		assertEquals("All products were removed from your cart.", response3a.getBody());
		var response3b = cartService.listCartItems("Hernandez");
		assertEquals("You don't have any dishes in your account.", response3b.getBody().get(0).getServiceResponse());
		
		var response4a = cartService.removeAllUserProducts("Garcia");
		assertEquals("All products were removed from your cart.", response4a.getBody());
		var response4b = cartService.listCartItems("Garcia");
		assertEquals("You don't have any dishes in your account.", response4b.getBody().get(0).getServiceResponse());
		
		var response5a = cartService.removeAllUserProducts("Gefesto");
		assertEquals("All products were removed from your cart.", response5a.getBody());
		var response5b = cartService.listCartItems("Gefesto");
		assertEquals("You don't have any dishes in your account.", response5b.getBody().get(0).getServiceResponse());
		
		var response6a = cartService.removeAllUserProducts("Esmeralda");
		assertEquals("All products were removed from your cart.", response6a.getBody());
		var response6b = cartService.listCartItems("Esmeralda");
		assertEquals("You don't have any dishes in your account.", response6b.getBody().get(0).getServiceResponse());
	}
	
	@Test
	@Order(5)
	void testGetAPageOfAllOrders() {
		var response = orderService.getAPageOfAllOrders("admin@admin.lt", 0, 6);
		
		List<Orders> orders = response.getContent();
		int pageItemsNum = response.getContent().size();
		
		System.out.println("---- PAGE LIST OF ALL ORDERS ----\n"+ orders);
		
		assertEquals(6, pageItemsNum);
	}
	
	@Test
	@Order(6)
	void testConfirmOrder() {
		
		var response = orderService.getUserOrders("Molesto");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders = (List<Orders>) response.getBody();
		
		int molestoOrderId = orders.get(0).getId();
		
		var response2 = orderService.confirmOrder("admin@admin.lt", molestoOrderId, "APPROVED");
		
		assertEquals("Molesto's order is approved", response2.getBody());
		
		response = orderService.getUserOrders("Muerte");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders2 = (List<Orders>) response.getBody();
		
		int muertesOrderId = orders2.get(0).getId();
		
		var response3 = orderService.confirmOrder("admin@admin.lt", muertesOrderId, "WITHDRAWN");
		
		assertEquals("Muerte's order is withdrawn", response3.getBody());
		
		var responseAll = orderService.getAllOrders("admin@admin.lt");
		
		@SuppressWarnings("unchecked")
		List<Orders> allOrders = (List<Orders>) responseAll.getBody();
		
		int orderId = allOrders.get(0).getId();
		int randomId = orderId;
		
		while(randomId == orderId) {
			randomId = (int) (Math.random()*100000+1);
			
			for(Orders order : allOrders) {
				orderId = order.getId();
				if(orderId == randomId)
					break;
			}
		}
		
		var response4 = orderService.confirmOrder("admin@admin.lt", randomId, "APPROVED");
		
		assertEquals("No such order which id: "+randomId , response4.getBody());
		
		var response5 = orderService.confirmOrder("user@user.lt", randomId, "APPROVED");
		
		assertEquals("Unauthorised request. Only administrator can approve or withdrawn orders.", response5.getBody());
		
		var response6 = orderService.confirmOrder("No User", randomId, "APPROVED");
		
		assertEquals("Unauthorised request. No user found.", response6.getBody());
	}
	
	@Test
	@Order(7)
	void testDeleteOrder() {
		var response = orderService.getUserOrders("Molesto");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders = (List<Orders>) response.getBody();
		
		if(orders.size() > 0) {
			for(Orders orderItem : orders) {
				var response2 = orderService.deleteOrder("admin@admin.lt", orderItem.getId());
				
				assertEquals("The order was deleted.", response2.getBody());
			}
		}
		
		var response2a = orderService.getUserOrders("Muerte");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders2 = (List<Orders>) response2a.getBody();
		
		if(orders2.size() > 0) {
			for(Orders orderItem : orders2) {
				var response2b = orderService.deleteOrder("admin@admin.lt", orderItem.getId());
				
				assertEquals("The order was deleted.", response2b.getBody());
			}
		}
		
		var response3 = orderService.getUserOrders("Hernandez");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders3 = (List<Orders>) response3.getBody();
		
		if(orders3.size() > 0) {
			for(Orders orderItem : orders3) {
				var response3b = orderService.deleteOrder("admin@admin.lt", orderItem.getId());
				
				assertEquals("The order was deleted.", response3b.getBody());
			}
		}
		
		var response4 = orderService.getUserOrders("Garcia");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders4 = (List<Orders>) response4.getBody();
		
		if(orders4.size() > 0) {
			for(Orders orderItem : orders4) {
				var response4b = orderService.deleteOrder("admin@admin.lt", orderItem.getId());
				
				assertEquals("The order was deleted.", response4b.getBody());
			}
		}
		
		var response5 = orderService.getUserOrders("Gefesto");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders5 = (List<Orders>) response5.getBody();
		
		if(orders5.size() > 0) {
			for(Orders orderItem : orders5) {
				var response5b = orderService.deleteOrder("admin@admin.lt", orderItem.getId());
				
				assertEquals("The order was deleted.", response5b.getBody());
			}
		}
		
		var response6 = orderService.getUserOrders("Esmeralda");
		
		@SuppressWarnings("unchecked")
		List<Orders> orders6 = (List<Orders>) response6.getBody();
		
		if(orders6.size() > 0) {
			for(Orders orderItem : orders6) {
				var response6b = orderService.deleteOrder("admin@admin.lt", orderItem.getId());
				
				assertEquals("The order was deleted.", response6b.getBody());
			}
		}
		
	}
	

	@Test
	@Order(8)
	void testDeleteTestUsers() {
		userService.deleteUser("Molesto");
		userService.deleteUser("Muerte");
		userService.deleteUser("Hernandez");
		userService.deleteUser("Garcia");
		userService.deleteUser("Gefesto");
		userService.deleteUser("Esmeralda");
		
		assertNull(userService.findByUsername("Molesto"));
	}
}
