package it.akademija.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/order")
public class OrderController {
	
	@Autowired
	private OrderService orderService;
	
	@Secured({ "ROLE_USER" })
	@GetMapping("/getUserOrder")
	public ResponseEntity<?> showUserOrders(){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		return orderService.getUserOrders(currentUsername);
	}
	
	@Secured({ "ROLE_ADMIN" })
	@GetMapping("/getAllOrders")
	public ResponseEntity<?> getAllOrders(){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		return orderService.getAllOrders(currentUsername);
	}
	
	@Secured({ "ROLE_ADMIN" })
	@GetMapping("/getPageOfAllOrders")
	public Page<Orders> getPageOfAllOrders(@RequestParam("page") int page, @RequestParam("size") int size){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		return orderService.getAPageOfAllOrders(currentUsername, page, size);
	}
	
	@Secured({ "ROLE_USER" })
	@PostMapping("/newOrder")
	public ResponseEntity<String> createNewOrder (){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		return orderService.createOrder(currentUsername);
	}
	
	@Secured({ "ROLE_ADMIN" })
	@PostMapping("/confirmOrder/{id}/{status}")
	public ResponseEntity<String> confirmOrder(@PathVariable Integer id, @PathVariable String status){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		return orderService.confirmOrder(currentUsername, id, status);
	}
	
	@Secured({ "ROLE_ADMIN" })
	@DeleteMapping("/deleteOrder/{id}")
	public ResponseEntity<String> deleteOrder (@PathVariable Integer id){
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		return orderService.deleteOrder(currentUsername, id);
	}
}
