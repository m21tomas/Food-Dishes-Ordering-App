package it.akademija.order;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.akademija.canteen.CanteenController;
import it.akademija.cart.CartItem;
import it.akademija.cart.CartItemDAO;
import it.akademija.cart.CartService;
import it.akademija.role.Role;
import it.akademija.user.User;
import it.akademija.user.UserService;

@Service
public class OrderService {
	
	private static final Logger LOG = LoggerFactory.getLogger(CanteenController.class);
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private OrderDAO orderDao;
	
	@Autowired
	private CartItemDAO cartRepo;
	
	@Autowired
	private CartService cartService;
	
	@Transactional(readOnly = true)
	public ResponseEntity<?> getUserOrders(String username){
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		if(user == null) {
			LOG.error("Unauthorised request. No user found.");
			
			return new ResponseEntity<String>("Unauthorised request. No user found.", HttpStatus.UNAUTHORIZED);
		}
		else if(role == Role.ADMIN && user != null) {
			LOG.error("[{}]: Unauthorised request. Only a registered user can request the list of cart items.", username);
		
			return new ResponseEntity<String>("Unauthorised request. Only a registered user can request the list of cart items.", HttpStatus.UNAUTHORIZED);
		}
		
		List<Orders> orders = orderDao.findByUsername(username);
		
		if(orders.size() > 0) {
			LOG.info("[{}]: Getting your order",username);
			
			return new ResponseEntity<List<Orders>>(orders, HttpStatus.OK);
		}
		else {
			LOG.warn("[{}]: You do not have any orders.",username);
			
			return new ResponseEntity<String>("You do not have any orders.", HttpStatus.NOT_FOUND);
		}
	}
	
	@Transactional(readOnly = true)
	public ResponseEntity<?> getAllOrders (String username){
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		if(user == null) {
			LOG.error("Unauthorised request. No user found.");
			
			return new ResponseEntity<String>("Unauthorised request. No user found.", HttpStatus.UNAUTHORIZED);
		}
		else if(role == Role.USER && user != null) {
			LOG.error("[{}]: Unauthorised request. Only a registered user can request the list of cart items.", username);
		
			return new ResponseEntity<String>("Unauthorised request. Only a registered user can request the list of cart items.", HttpStatus.UNAUTHORIZED);
		}
		
		List<Orders> orders = orderDao.findAll();
		
		if(orders.size() > 0) {
			LOG.info("[{}]: Taking all orders",username);
			
			return new ResponseEntity<List<Orders>>(orders, HttpStatus.OK);
		}
		else {
			LOG.warn("[{}]: There are no orders at all.",username);
			
			return new ResponseEntity<String>("There are no orders at all.", HttpStatus.NOT_FOUND);
		}
	}
	
	public Page<Orders> getAPageOfAllOrders (String username, int page, int size){
		User user = userService.findByUsername(username);
		
		LOG.info("[{}], Taking a page of orders.", user.getUsername());
		
		Sort.Order order = new Sort.Order(Sort.Direction.ASC, "id");

		Pageable pageable = PageRequest.of(page, size, Sort.by(order));
		
		Page<Orders> orders = orderDao.findAll(pageable);
		
		return orders;
	}
	
	@Transactional
	public ResponseEntity<String> createOrder (String username) {
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		if(user == null) {
			LOG.error("Unauthorised request. No user found.");
			
			return new ResponseEntity<String>("Unauthorised request. No user found.", HttpStatus.UNAUTHORIZED);
		}
		else if(role == Role.ADMIN && user != null) {
			LOG.error("[{}]: Unauthorised request. Only a registered user can request the list of cart items.", username);
		
			return new ResponseEntity<String>("Unauthorised request. Only a registered user can request the list of cart items.", HttpStatus.UNAUTHORIZED);
		}
		
		List<CartItem> items = cartRepo.findByUser(user);
		
		if(items.size() > 0) {
			Orders newOrder = new Orders();
			Set<Item> orderItems = new LinkedHashSet<>();
			
			for(CartItem item : items) {
				// Item(Integer id, String dishName, String dishDescription, Integer quantityInCart, String username)
				Item orderItem = new Item(item.getId(), item.getDish().getName(), item.getDish().getDescription(),
						                  item.getQuantity(), item.getUser().getUsername());
				
				orderItems.add(orderItem);
			}
			newOrder.setItems(orderItems);
			newOrder.setOrderName(user.getUsername()+"'s order");
			newOrder.setStatus(OrderStatus.SUBMIT);
			newOrder.setSubmitedAt();
			newOrder.setUsername(username);
			
			orderDao.save(newOrder);
			
			cartService.removeAllUserProducts(username);
			
			LOG.info("[{}]: A new order is created successfully.", username);
			
			return new ResponseEntity<String>("A new order is created successfully.", HttpStatus.CREATED);
		}
		else {
			LOG.warn("[{}]: You don't have any dishes in your cart. A new order cannot be created.", username);
			
			return new ResponseEntity<String>("You don't have any dishes in your cart. A new order cannot be created.", HttpStatus.NOT_FOUND);
		}
	}
	
	@Transactional
	public ResponseEntity<String> confirmOrder (String username, Integer id , String status) {
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		if(user == null) {
			LOG.error("Unauthorised request. No user found.");
			
			return new ResponseEntity<String>("Unauthorised request. No user found.", HttpStatus.UNAUTHORIZED);
		}
		else if(role == Role.USER && user != null) {
			LOG.error("[{}]: Unauthorised request. Only administrator can approve or withdrawn orders.", username);
		
			return new ResponseEntity<String>("Unauthorised request. Only administrator can approve or withdrawn orders.", HttpStatus.UNAUTHORIZED);
		}
		
		Orders order = orderDao.findById(id).orElse(null);
		
		OrderStatus sta;
		
		try {
			sta = OrderStatus.valueOf(status);
		}
		catch(Exception e){
			e.printStackTrace();
			LOG.error("[{}]: No such status value to be set for order status. Status can only be \"APPROVED\" or \"WITHDRAWN\".", username);
			return new ResponseEntity<String>("No such status value to be set for order status. "
					+ "Status can only be \"APPROVED\" or \"WITHDRAWN\".", HttpStatus.BAD_REQUEST);
		}
		 
		if(order != null) {
			order.setStatus(sta);
			
			orderDao.save(order);
			
			String str = order.getOrderName() + " is " + sta.toString().toLowerCase();
			
			LOG.info("[{}]: "+str, username);
			
			return new ResponseEntity<String>(str, HttpStatus.OK);
		}
		else {
			LOG.error("[{}]: No such order which id: [{}]", username, id);
			return new ResponseEntity<String>("No such order which id: "+id.toString(), HttpStatus.NOT_FOUND);
		}
	}
	
	@Transactional
	public ResponseEntity<String> deleteOrder (String username, Integer id){
		User user = userService.findByUsername(username);
		
		Role role = null;
		
		if(user != null) role = user.getRole();
		
		if(user == null) {
			LOG.error("Unauthorised request. No user found.");
			
			return new ResponseEntity<String>("Unauthorised request. No user found.", HttpStatus.UNAUTHORIZED);
		}
		else if(role == Role.USER && user != null) {
			LOG.error("[{}]: Unauthorised request. Only administrator can delete orders.", username);
		
			return new ResponseEntity<String>("Unauthorised request. Only administrator can delete orders.", HttpStatus.UNAUTHORIZED);
		}
		
		Orders order = orderDao.findById(id).orElse(null);
		
		if(order != null) {
			orderDao.deleteById(id);
			
			LOG.info("[{}]: The order was deleted", username);
			
			return new ResponseEntity<String>("The order was deleted.", HttpStatus.OK);
		}
		else {
			LOG.error("[{}]: No such order with id: [{}] to be deleted.", username, id);
			
			return new ResponseEntity<String>("No such order with id: "+id.toString()+" tobe deleted.", HttpStatus.NOT_FOUND);
		}
	}
}
