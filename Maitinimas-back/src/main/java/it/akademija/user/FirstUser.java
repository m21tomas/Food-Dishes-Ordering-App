package it.akademija.user;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import it.akademija.role.Role;

@Component
public class FirstUser {

	@Autowired
	UserDAO userDao;

	@Autowired
	UserService userService;

	/**
	 * Add first users (ADMIN, MANAGER, USER) to the User repository for testing
	 * purposes
	 * 
	 * @throws Exception
	 * 
	 */
	@PostConstruct
	public void addFirstUser() throws Exception {

		if (userDao.findByRole(Role.ADMIN).size() == 0) {

			//UserDTO(String role, String email, String username, String password)
			UserDTO firstAdmin = new UserDTO("ADMIN", "admin@admin.lt", "admin@admin.lt",
					"admin@admin.lt");

			UserDTO firstUser = new UserDTO("USER", 
					"user@user.lt", "user@user.lt", "user@user.lt");

			userService.createUser(firstAdmin);
			userService.createUser(firstUser);

		}

	}
}
