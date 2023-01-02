package it.akademija.cart;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/cart")
public class CartController {
	
	@Autowired
	private CartService cartService;
		
	@Secured({ "ROLE_USER" }) 
	@GetMapping("/getCart")
	public ResponseEntity<List<CartItemsResponseDTO>> showCart(){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
	    return cartService.listCartItems(currentUsername);
	}
	
	/**
	 * Returns a page of all canteens.
	 * 
	 * @return page of all canteens
	 */
	@Secured({ "ROLE_USER", "ROLE_ADMIN" })
	@GetMapping(path = "/allCartItemsPage")
	public Page<CartItemsResponseDTO> getAPageOfAllCanteens(@RequestParam("page") int page, @RequestParam("size") int size) {
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		Sort.Order order = new Sort.Order(Sort.Direction.ASC, "id");

		Pageable pageable = PageRequest.of(page, size, Sort.by(order));

		return cartService.getAPageOfCartItems(pageable, currentUsername);
	}
	
	@Secured({ "ROLE_USER" }) 
	@PostMapping("/add")
	public ResponseEntity<CartItemsResponseDTO> addProductToCart(@RequestBody DishToCartRequestDTO data){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
	    return cartService.addDishToCart(data.getMenuId(), data.getDishId(), data.getQuantity(), currentUsername);
	}
	
	@Secured({ "ROLE_USER" })
	@PutMapping("/update")
	public ResponseEntity<CartItemsResponseDTO> updateProductQuantity(@RequestBody DishToCartRequestDTO data){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		return cartService.updateQuantity(data.getMenuId(), data.getDishId(), data.getQuantity(), currentUsername);
	}
	
	@Secured({ "ROLE_USER" })
	@DeleteMapping("/remove/{cartItemId}")
	public ResponseEntity<String> removeProductFromCart(@PathVariable Integer cartItemId){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		return cartService.removeDishFromCart(cartItemId, currentUsername);
	}
	
	@Secured({ "ROLE_USER", "ROLE_ADMIN" })
	@DeleteMapping("/remove/all")
	public ResponseEntity<String> removeAllProductsFromCart(){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		return cartService.removeAllUserProducts(currentUsername);
	}
}
