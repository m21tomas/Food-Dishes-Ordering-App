package it.akademija.userpasswordreset;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.akademija.user.User;
import it.akademija.user.UserDAO;

@Service
public class UserPasswordResetService {
	private static final Logger LOG = LoggerFactory.getLogger(UserPasswordResetService.class);
	
	@Autowired
	private UserDAO userDao;
	
	@Autowired
	private PasswordEncoder encoder;
	
	@Transactional(readOnly = true)
	public ResponseEntity<String> authenticateUser(String username, String email){
		
		User user = userDao.findByUsername(username);
		
		if(user != null) {
			if(!user.getEmail().equals(email)) {
				LOG.warn("Unauthenticated request. [{}] user email address is not [{}]", username, email);
				
				return new ResponseEntity<String>("Neatpažinta tapatybė. Vartotojo \""+username+"\" elektroninio pašto adresas nėra \""+email+"\"", HttpStatus.UNAUTHORIZED);
			}
			
			LOG.info("[{}] authenticated, returning true", username);
			
			return new ResponseEntity<String>("true", HttpStatus.OK);
		}
		else {
			LOG.error("Unauthorised request. No such \"[{}]\" user found.", username);
			
			return new ResponseEntity<String>("Neautorizuota. Nėra tokio vartotojo vardo kaip \""+username+"\"", HttpStatus.NOT_FOUND);
		}
	}
	
	@Transactional
	public ResponseEntity<String> changeUserPassword(String username, String password){
		
		User user = userDao.findByUsername(username);
		
		if(user != null) {
			if(password.length()<8) {
				LOG.error("[{}] - Password length is not enough or there is no password at all", username);
				
				return new ResponseEntity<String>(username+" - nepakankamas slaptažodžio ilgis arba jo nėra visai", HttpStatus.NOT_ACCEPTABLE);
			}
			
			user.setPassword(encoder.encode(password));
			
			userDao.save(user);
			
			return new ResponseEntity<String>("Slaptažodis pakeistas", HttpStatus.OK);
		}
		else {
			LOG.error("Unauthorised request. No such \"[{}]\" user found.", username);
			
			return new ResponseEntity<String>("Neautorizuota. Nėra tokio vartotojo vardo kaip \""+username+"\"", HttpStatus.NOT_FOUND);
		}
	}
}
