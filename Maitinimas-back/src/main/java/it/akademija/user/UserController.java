package it.akademija.user;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping(path = "/api/users")
public class UserController {
	
	private static final Logger LOG = LoggerFactory.getLogger(UserController.class);
	
	@Autowired
	private UserService userService;
	
	@Autowired
	@Lazy
	private SessionRegistry sessionRegistry;
	
	/**
	 * Create new user. Method only accessible to ADMIN users
	 * 
	 * @param userInfo
	 */
	
	@Secured({ "ROLE_ADMIN" })
	@PostMapping(path = "/admin/createuser")
	public ResponseEntity<String> createUser(@Valid @RequestBody UserDTO userInfo) {

		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

		LOG.info("** Usercontroller: kuriamas naujas naudotojas **");

		if (userService.findByUsername(userInfo.getUsername()) != null) {

			LOG.warn("Naudotojas [{}] band?? sukurti nauj?? naudotoj?? su jau egzistuojan??iu vardu [{}]", currentUsername,
					userInfo.getUsername());

			return new ResponseEntity<String>("Toks naudotojas jau egzistuoja!", HttpStatus.BAD_REQUEST);

		} else {
			userService.createUser(userInfo);

			LOG.info("Naudotojas [{}] suk??r?? nauj?? naudotoj?? [{}]", currentUsername, userInfo.getUsername());

			return new ResponseEntity<String>("Naudotojas sukurtas s??kmingai!", HttpStatus.CREATED);
		}
	}
	
	/**
	 * Create new user from login screen
	 *  
	 */
 	@PostMapping("/createAccount")
	public ResponseEntity<String> createAccountLoginScreen(
			@RequestBody UserDTO userDTO) {
 		
 		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (userService.findByUsername(userDTO.getUsername()) != null) {

			LOG.warn("Bandymas sukurti vartotoj?? su jau egzistuojan??iu prisijungimo vardu [{}]", userDTO.getUsername());
			
			return new ResponseEntity<String>("Toks naudotojas jau egzistuoja!", HttpStatus.CONFLICT);
		}
		
		
 		if ((authentication instanceof AnonymousAuthenticationToken)) {
 			userService.createUserFromLogin(userDTO);
 		}
		if (userService.findByUsername(userDTO.getUsername()) != null) {
			LOG.info("Sukurtas naujas naudotojas [{}]", userDTO.getUsername());
			
			return new ResponseEntity<String>("Naujas naudotojas sukurtas s??kmingai", HttpStatus.CREATED);
		}

		LOG.error("Naudotojui [{}] nepavyko susikurti paskyros", userDTO.getUsername());
		
		return new ResponseEntity<String>("Nepavyko sukurti naudotojo", HttpStatus.INTERNAL_SERVER_ERROR);
	}
 	
 	/**
	 * Returns a page of all users. Method only accessible to ADMIN users
	 * 
	 * @return page of all users
	 */
	@Secured({ "ROLE_ADMIN" })
	@GetMapping(path = "/admin/allusers")
	public Page<UserInfo> getAllUsers(@RequestParam("page") int page, @RequestParam("size") int size) {

		Sort.Order order = new Sort.Order(Sort.Direction.DESC, "userId");

		Pageable pageable = PageRequest.of(page, size, Sort.by(order));

		return userService.getAllUsers(pageable);
	}
	
	/**
	 * 
	 * Deletes user with specified username. Method only accessible to ADMIN users
	 * 
	 * @param username
	 */
	@Secured({ "ROLE_ADMIN" })
	@DeleteMapping(path = "/admin/delete/{username}")
	public ResponseEntity<String> deleteUser(@PathVariable final String username) {
		
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String role = "";
		if (auth != null) {
		   role = auth.getAuthorities().stream().map(t -> t.getAuthority()).toString();
		}

		if (userService.findByUsername(username) != null) {

			LOG.info("** [{}] [{}] trinama naudotoj?? vardu [{}] **", role, currentUsername , username);

//			journalService.newJournalEntry(OperationType.USER_DELETED, userService.findByUsername(username).getUserId(), ObjectType.USER, "I??trintas naudotojas");
		
			userService.deleteUser(username);

			return new ResponseEntity<String>("Naudotojas i??trintas s??kmingai", HttpStatus.OK);
		}

//		journalService.newJournalEntry(OperationType.USER_DELETE_FAILED, ObjectType.KINDERGARTEN,
//				"Naudotojas su vardu " + username + " nerastas");
		
		LOG.warn("Naudotojas band?? i??trinti naudotoj?? neegzistuojan??iu vardu [{}]", username);

		return new ResponseEntity<String>("Naudotojo vardu " + username + " i??trinti nepavyko", HttpStatus.NOT_FOUND);

		
	}
	
	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}
}
