package it.akademija.userpasswordreset;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserPasswordResetController {
	private static final Logger LOG = LoggerFactory.getLogger(UserPasswordResetController.class);
	
	@Autowired
	private UserPasswordResetService passwordService;
	
	@PostMapping(path = "/userAuthentification")
	public ResponseEntity<String> authenticateUser(@RequestBody UserAuthentificationDTO user){
		LOG.info("** UserPasswordResetController: autentifikuojamas naudotojas **");
		return passwordService.authenticateUser(user.getUsername(), user.getEmail());
	}
	
	@PostMapping(path = "/userChangePassword")
	public ResponseEntity<String> changeUserPassword(@RequestBody NewPasswordDTO pass){
		LOG.info("** UserPasswordResetController: keičiamas slaptažodis **");
		return passwordService.changeUserPassword(pass.getUsername(), pass.getPassword());
	}
}
