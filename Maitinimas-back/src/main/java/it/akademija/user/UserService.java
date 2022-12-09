package it.akademija.user;

import java.util.List;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.akademija.role.Role;

@Service
public class UserService implements UserDetailsService {
	@Autowired
	private UserDAO userDao;
	
	@Autowired
	private PasswordEncoder encoder;
	
	@Autowired
	@Lazy
	private SessionRegistry sessionRegistry;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = findByUsername(username);

		if (user == null) {
			throw new UsernameNotFoundException(username + " not found.");
		} else {
			return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
					AuthorityUtils.createAuthorityList(new String[] { "ROLE_" + user.getRole().toString() }));
		}
	}
	
	/**
	 * Finds user with a specified username. Don't return User entity via REST.
	 * 
	 * @param username
	 * @return User entity (includes sensitive data)
	 */
	@Transactional(readOnly = true)
	public User findByUsername(String username) {

		return userDao.findByUsername(username);
	}
	
	/**
	 * Create new user with specified parameters. Deletes FirstUser "admin" which
	 * was initialized at start up if there are other users with ADMIN authorization
	 * in the user repository
	 * 
	 * @param userData data for new user
	 */
	@Transactional
	public void createUser(UserDTO userData) {
		User newUser = new User();

		newUser.setEmail(userData.getEmail());
		newUser.setRole(Role.valueOf(userData.getRole()));
		newUser.setUsername(userData.getUsername());
		newUser.setPassword(encoder.encode(userData.getPassword()));
		userDao.saveAndFlush(newUser);
	}
	
	/**
	 * create new account from login page, only USER role
	 * 
	 * @param userData
	 */
	@Transactional
	public void createUserFromLogin(UserDTO userData) {
		User newUser = new User();
		newUser.setUsername(userData.getUsername());
		newUser.setEmail(userData.getEmail());
		newUser.setPassword(encoder.encode(userData.getPassword()));
		newUser.setRole(Role.USER);
		userDao.saveAndFlush(newUser);
	}
	
	/**
	 * Returns a page of registered Users info with specified page number and page
	 * size
	 * 
	 * @return list of user details for ADMIN
	 */
	@Transactional(readOnly = true)
	public Page<UserInfo> getAllUsers(Pageable pageable) {
		Page<User> users = userDao.findAll(pageable);
		Page<UserInfo> dtoPage = users.map(new Function<User, UserInfo>() {
			@Override
			public UserInfo apply(User user) {
				UserInfo dto = new UserInfo(user.getUserId(), user.getRole().name(), user.getUsername());
				return dto;
			}

		});
		return dtoPage;
	}
	
	/**
	 * 
	 * Delete user with a specified username. If user role equals USER, deletes
	 * associated Application and ParentDetails entries in the database and
	 * increases number of available places in approved Kindergarten if applicable.
	 * 
	 * @param username
	 */
	@Transactional
	public void deleteUser(String username) {

		User user = findByUsername(username);

		if (user.getRole().equals(Role.ADMIN) && userDao.findByRole(Role.ADMIN).size() == 1) {

			userDao.save(new User(Role.ADMIN, "admin@admin.lt", "admin@admin.lt",
					encoder.encode("admin@admin.lt")));

		} else if (user.getRole().equals(Role.USER)) {

//			Set<Application> submittedApplications = user.getUserApplications();
//		//	List<Compensation> submittedCompensations = compensationService.getCompensationApplicationForUser(username);
//
//			for (Application application : submittedApplications) {
//
//				applicationService.detachAdditionalGuardian(application);
//				applicationService.updateAvailablePlacesInKindergarten(application);
//			}
//		 
//				compensationService.deleteCompensationsApplicationByUsername(username);
//	 
//
//			documentDao.deleteByUploaderId(user.getUserId());
		}

		expireSession(user);

		userDao.deleteByUsername(username);
	}
	
	/**
	 * 
	 * Expire session of logged in user if ADMIN deletes their account
	 * 
	 * @param user
	 */
	private void expireSession(User user) {

		List<Object> principals = sessionRegistry.getAllPrincipals();
		for (Object principal : principals) {
			UserDetails pUser = (UserDetails) principal;
			if (pUser.getUsername().equals(user.getUsername())) {
				for (SessionInformation activeSession : sessionRegistry.getAllSessions(principal, false)) {
					activeSession.expireNow();
				}
			}
		}
	}

	public UserDAO getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDAO userDao) {
		this.userDao = userDao;
	}

	public PasswordEncoder getEncoder() {
		return encoder;
	}

	public void setEncoder(PasswordEncoder encoder) {
		this.encoder = encoder;
	}

}
