package it.akademija.cart;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.akademija.canteen.CanteenController;
import it.akademija.dish.Dish;
import it.akademija.menu.Menu;
import it.akademija.menu.MenuDAO;
import it.akademija.role.Role;
import it.akademija.user.User;
import it.akademija.user.UserService;

@Service
public class CartService {
	
	private static final Logger LOG = LoggerFactory.getLogger(CanteenController.class);
	@Autowired
	private UserService userService;
	
	@Autowired
	private CartItemDAO cartRepo;
	
	@Autowired
	private MenuDAO menuDao;
	
	@Transactional(readOnly = true)
	public ResponseEntity<List<CartItemsResponseDTO>> listCartItems (String username){
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		List<CartItem> items = null;
		
		if(user == null) {
            LOG.error("Unauthorised request. No user found.");
            
            List<CartItemsResponseDTO> bodyList2 = new ArrayList<>();
            
            CartItemsResponseDTO responseItem2 = new CartItemsResponseDTO(null, null, null,
            		null, null, null, "Unauthorised request. No user found.");
			bodyList2.add(responseItem2);
			
			return new ResponseEntity<List<CartItemsResponseDTO>> (bodyList2, HttpStatus.UNAUTHORIZED);
		}
		else
		if(role == Role.ADMIN && user != null) {
			LOG.warn("[{}]: Unauthorised request. Only a registered user can request the list of cart items.", username);
			
            List<CartItemsResponseDTO> bodyList3 = new ArrayList<>();
            
            CartItemsResponseDTO responseItem3 = new CartItemsResponseDTO(null, null, null,
            		null, null, user.getUsername(), "Unauthorised request. Only a registered user can request the list of cart items.");
			bodyList3.add(responseItem3);
			
			return new ResponseEntity<List<CartItemsResponseDTO>> (bodyList3, HttpStatus.UNAUTHORIZED);
		}

		items = cartRepo.findByUser (user);

		if(items.size() > 0) {
			String log_strItems = "";
			
			List<CartItemsResponseDTO> bodyList1 = new ArrayList<>();
			
			for(CartItem item : items) {
				log_strItems = log_strItems + item.getId().toString() + " - " +
						   item.getDish().getName() + " - " + item.getQuantity().toString() + "\n";

				CartItemsResponseDTO responseItem1 = new CartItemsResponseDTO(item.getId(), item.getDish().getId() ,item.getDish().getName(),
						item.getDish().getDescription(), item.getQuantity(), item.getUser().getUsername(), "An item in your cart.");
				bodyList1.add(responseItem1);
			}
			
			System.out.println();
			LOG.info("[{}]: Sending the list of cart items: \n[{}]", username, log_strItems);
			System.out.println();
			
			return new ResponseEntity<List<CartItemsResponseDTO>> (bodyList1, HttpStatus.OK);
		}else {
			LOG.warn("[{}]: You don't have any dishes in your cart.", username);
			
            List<CartItemsResponseDTO> bodyList4 = new ArrayList<>();
            
            CartItemsResponseDTO responseItem4 = new CartItemsResponseDTO(null, null, null,
            		null, null, user.getUsername(), "You don't have any dishes in your account.");
			bodyList4.add(responseItem4);
			
			return new ResponseEntity<List<CartItemsResponseDTO>> (bodyList4, HttpStatus.NOT_FOUND);
		}
	}
	
	@Transactional(readOnly = true)
	public Page<CartItemsResponseDTO> getAPageOfCartItems(Pageable pageable, String username){
		User user = userService.findByUsername(username);
		
		Page<CartItem> cartItems = cartRepo.findAllCartItemUser(user, pageable);
		
		Page<CartItemsResponseDTO> dtoPage = cartItems.map(new Function<CartItem, CartItemsResponseDTO>() {

			@Override
			public CartItemsResponseDTO apply(CartItem t) {
				CartItemsResponseDTO dto = new CartItemsResponseDTO(); 
				
				dto.setCartItemId(t.getId());
				dto.setDishId(t.getDish().getId());
				dto.setDishName(t.getDish().getName());
				dto.setDishDescription(t.getDish().getDescription());
				dto.setQuantityInCart(t.getQuantity());
				dto.setServiceResponse("An item in your cart.");
				dto.setUsername(t.getUser().getUsername());
				
				return dto;
			}
		});	
		return dtoPage;
	}
	
	@Transactional
	public ResponseEntity<CartItemsResponseDTO> addDishToCart (Long menuId, Long dishId, Integer quantity, String username) {
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		if(user == null) {
            LOG.error("Unauthorised request. No user found.");
            
            CartItemsResponseDTO body1 = new CartItemsResponseDTO(null, null, null, null, null, null, "Unauthorised request. No user found.");
			
			return new ResponseEntity<CartItemsResponseDTO> (body1, HttpStatus.BAD_REQUEST);
		}
		else
		if(role == Role.ADMIN && user != null) {
			LOG.warn("[{}]: Unauthorised request. Only a registered user can request the list of cart items.", user.getUsername());
			
			CartItemsResponseDTO body2 = new CartItemsResponseDTO(null, null, null, null, null, user.getUsername(), 
					"Unauthorised request. Only a registered user can request the list of cart items.");
			
			return new ResponseEntity<CartItemsResponseDTO> (body2, HttpStatus.UNAUTHORIZED);
		}
		
		Dish dish = null;
		
		Menu menu = menuDao.findById(menuId).orElse(null);
		
		if(menu != null) {
			List<Dish> dishes = menu.getDishes();
			
			for(Dish item : dishes) {
				if(item.getId().equals(dishId)) {
					dish = item;
					break;
				}
			}
		}
		
		if(quantity < 1) {
			LOG.error("[{}] You cannot add negative amount of product to your cart. Please provide positive number.", user.getUsername());
			
			String serverResponse = "You cannot add negative amount of product to your cart. Please provide positive number.";
			
			CartItemsResponseDTO body6 = new CartItemsResponseDTO(null, null, null, null, quantity, user.getUsername(), serverResponse);
			
			return new ResponseEntity<CartItemsResponseDTO> (body6, HttpStatus.NOT_ACCEPTABLE);
		}
		
		Integer quantityInCart = quantity;
		
		if(menu == null || dish == null) {
			LOG.error("[{}]: No such menu with id: [{}] that would have dish with id: [{}]. Provide existing menu and dish IDs.", 
					   user.getUsername(), menuId, dishId);
			
			String serverResponse = "No such menu with id: " + menuId.toString() + " that would have dish with id: " +
					dishId.toString() + ". Provide existing menu and dish IDs.";
			
			CartItemsResponseDTO body3 = new CartItemsResponseDTO(null, null, null, null, null, user.getUsername(), serverResponse);
			
			return new ResponseEntity<CartItemsResponseDTO> (body3, HttpStatus.NOT_FOUND);
		}
		
		CartItem cartItem = cartRepo.findByUserAndDish(user, dish);
		
		CartItemsResponseDTO body4 = null;
		HttpStatus status;
		
		if (cartItem != null) {
			quantityInCart = cartItem.getQuantity() + quantity;
			
            String serverResponse = "Now in the cart you have "+quantityInCart.toString()+" units of this dish.";
			
			LOG.info("[{}]: "+serverResponse, user.getUsername());
			
			cartItem.setQuantity(quantityInCart);
			
			cartRepo.save(cartItem);
			
			body4 = new CartItemsResponseDTO(cartItem.getId(), cartItem.getDish().getId(), cartItem.getDish().getName(), cartItem.getDish().getDescription(),
					quantityInCart, cartItem.getUser().getUsername(), serverResponse);
			
			status = HttpStatus.OK;
		}
		else {
			String serverResponse ="";
			
			if(quantity == 1) {
				serverResponse = quantity.toString()+" new dish was added to your cart.";
			} else {
				serverResponse = quantity.toString()+" new dishes were added to your cart.";
			}
			
			LOG.info("[{}]: "+serverResponse, user.getUsername());
			
			cartItem = new CartItem(dish, user, quantity);
			
			CartItem newCartItem = cartRepo.save(cartItem);
			
			body4 = new CartItemsResponseDTO(newCartItem.getId(), dish.getId(), dish.getName(), dish.getDescription(),
					quantityInCart, user.getUsername(), serverResponse);
			
			status = HttpStatus.CREATED;
		}
		
		
		
		return new ResponseEntity<CartItemsResponseDTO> (body4, status);
	}
	
	@Transactional
	public ResponseEntity<CartItemsResponseDTO> updateQuantity(Integer cartItemId, Long dishId, Integer quantity, String username) {
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		if(user == null) {
            LOG.error("Unauthorised request. No user found.");
            
            CartItemsResponseDTO body1 = new CartItemsResponseDTO(null, null, null, null, null, null, "Unauthorised request. No user found.");
			
			return new ResponseEntity<CartItemsResponseDTO> (body1, HttpStatus.BAD_REQUEST);
		}
		else
		if(role == Role.ADMIN && user != null) {
			LOG.warn("[{}]: Unauthorised request. Only a registered user can request the list of cart items.", user.getUsername());
			
			CartItemsResponseDTO body2 = new CartItemsResponseDTO(null, null, null, null, null, user.getUsername(), 
					"Unauthorised request. Only a registered user can request the list of cart items.");
			
			return new ResponseEntity<CartItemsResponseDTO> (body2, HttpStatus.UNAUTHORIZED);
		}
		
		CartItem theItem = cartRepo.findById(cartItemId).orElse(null);
		
		if(theItem == null) {
			LOG.error("[{}]: No such cart item with id: [{}] that would have dish with id: [{}]. Provide existing cart and dish IDs.", 
					   user.getUsername(), cartItemId, dishId);
			
			String serverResponse = "No such cart item with id: " + cartItemId.toString() + " that would have dish with id: " +
					dishId.toString() + ". Provide existing cart and dish IDs.";
			
			CartItemsResponseDTO body3 = new CartItemsResponseDTO(null, null, null, null, null, user.getUsername(), serverResponse);
			
			return new ResponseEntity<CartItemsResponseDTO> (body3, HttpStatus.NOT_FOUND);
		}
		
		if(theItem != null && quantity > 0) {
			
			if(!theItem.getDish().getId().equals(dishId)) {
				String servResponse = "Cart item with id: "+cartItemId+" does not have dish id: "+dishId+". So the quantity of the dish in cart cannot be updated.";
				
				LOG.error("[{}]: "+servResponse, user.getUsername());
				
				CartItemsResponseDTO body6 = new CartItemsResponseDTO(null, null, null, null, null, user.getUsername(), servResponse);
				
				return new ResponseEntity<CartItemsResponseDTO> (body6, HttpStatus.CONFLICT);
			}
			else if(!theItem.getUser().getUsername().equals(username)) {
				String servResponse = "Cart item with id: "+cartItemId+" does not have registered user name: "+username+". So the quantity of the dish in cart cannot be updated.";
				
				LOG.error("[{}]: "+servResponse, user.getUsername());
				
				CartItemsResponseDTO body7 = new CartItemsResponseDTO(null, null, null, null, null, user.getUsername(), servResponse);
				
				return new ResponseEntity<CartItemsResponseDTO> (body7, HttpStatus.CONFLICT);
			}
			else {
				cartRepo.updateQuantity(quantity, dishId, user.getUserId());
				
				String serverResponse = "The dish quanity is updated to "+quantity.toString();
				
				LOG.info("[{}]: "+serverResponse, user.getUsername());
				
				CartItemsResponseDTO body4 = new CartItemsResponseDTO(theItem.getId(), theItem.getDish().getId(), theItem.getDish().getName(), 
						theItem.getDish().getDescription(), quantity, user.getUsername(), serverResponse);
				
				return new ResponseEntity<CartItemsResponseDTO> (body4, HttpStatus.OK);
			}
		}

		String serverResponse = "The dish quantity is NOT UPDATED. Quantity value should be positive integer number. Dish and cart item ids should also be correct. \n"
				+ "Parameters - cartItemId:" + cartItemId+ ", dishId:" + dishId + ", quantity:" + quantity  ;
		
		
		
		LOG.info("[{}]: "+serverResponse, user.getUsername());
		
		CartItemsResponseDTO body5 = new CartItemsResponseDTO(null, null, null, 
				null, quantity, user.getUsername(), serverResponse);
		
		return new ResponseEntity<CartItemsResponseDTO> (body5, HttpStatus.NOT_ACCEPTABLE);
	}
	
	@Transactional
	public ResponseEntity<String> removeDishFromCart (Integer cartItemId, String username) {
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		if(user == null) {
            LOG.error("Unauthorised request. No user found.");
			
			return new ResponseEntity<String> ("Unauthorised request. No user found.", HttpStatus.BAD_REQUEST);
		}
		else
		if(role == Role.ADMIN && user != null) {
			LOG.warn("[{}]: Unauthorised request. Only a registered user can request the list of cart items.", user.getUsername());
		
			return new ResponseEntity<String> ("Unauthorised request. Only a registered user can request the list of cart items.", HttpStatus.UNAUTHORIZED);
		}
		
		CartItem cartItem = cartRepo.findById(cartItemId).orElse(null);
		
		if(cartItem != null) {
			cartRepo.delete(cartItem);
			
			LOG.info("[{}]: Dish was removed from your cart succesfully.", user.getUsername());
			
			return new ResponseEntity<String>("Dish was removed from your cart succesfully.", HttpStatus.OK);
		}
		else {
			LOG.error("[{}]: No such item in your cart. Provide appropriate existing cart item id.", user.getUsername());
			
			return new ResponseEntity<String>("No such item in your cart. Provide appropriate existing cart item id.", HttpStatus.NOT_FOUND);
		}
	}
	
	@Transactional
	public ResponseEntity<String> removeAllUserProducts (String username){
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		if(user == null) {
            LOG.error("Unauthorised request. No user found.");
			
			return new ResponseEntity<String> ("Unauthorised request. No user found.", HttpStatus.BAD_REQUEST);
		}
		else
		if(role == Role.ADMIN && user != null) {
			LOG.warn("[{}]: Unauthorised request. Only a registered user can request the list of cart items.", user.getUsername());
		
			return new ResponseEntity<String> ("Unauthorised request. Only a registered user can request the list of cart items.", HttpStatus.UNAUTHORIZED);
		}
		
		List<CartItem> items = cartRepo.findByUser(user);
		
		if(items.size() > 0) {
			
			for(CartItem item : items) {
				cartRepo.delete(item);
			}
			LOG.info("[{}]: All products were removed from your cart.", user.getUsername());
			
			return new ResponseEntity<String>("All products were removed from your cart.", HttpStatus.OK);
		}
		else {
			LOG.error("[{}]: You don't have any products in your account to delete it.", user.getUsername());
			
			return new ResponseEntity<String>("You don't have any products in your account to delete it.", HttpStatus.NOT_FOUND);
		}
	}
}
