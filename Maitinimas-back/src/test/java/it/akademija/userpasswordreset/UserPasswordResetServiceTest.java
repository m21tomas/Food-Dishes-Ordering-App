package it.akademija.userpasswordreset;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import it.akademija.user.UserDTO;
import it.akademija.user.UserService;

@SpringBootTest
@TestMethodOrder(OrderAnnotation.class)
public class UserPasswordResetServiceTest {
	
	@Autowired
	private UserPasswordResetService resetService;
	
	@Autowired
	private UserService userService;
	
	@Test
	@Order(1)
	void testCreateUser() {
		UserDTO user1DTO = new UserDTO("USER", "userMolesto01@gmail.com", "Molesto", "testMolesto223");
		
		userService.createUser(user1DTO);
		
		var response = userService.findByUsername("Molesto");
		
		assertEquals("Molesto", response.getUsername());
	}
	
	@Test
	@Order(2)
	void testAuthenticateUser() {
		UserAuthentificationDTO userAuthentificating = new UserAuthentificationDTO("Molesto", "userMolesto01@gmail.com");
		UserAuthentificationDTO fakeAuth = new UserAuthentificationDTO("Muerte", "userMuerte21@gmail.com");
		UserAuthentificationDTO fakeEmail = new UserAuthentificationDTO("Molesto", "userHernandez12@gmail.com");
		
		var response = resetService.authenticateUser(userAuthentificating.getUsername(), userAuthentificating.getEmail());
		var response2 = resetService.authenticateUser(fakeAuth.getUsername(), fakeAuth.getEmail());
		var response3 = resetService.authenticateUser(fakeEmail.getUsername(), fakeEmail.getEmail());
		
		assertEquals("true", response.getBody());
		assertEquals("Neautorizuota. Nėra tokio vartotojo vardo kaip \"Muerte\"", response2.getBody());
		assertEquals("Neatpažinta tapatybė. Vartotojo \"Molesto\" elektroninio pašto adresas nėra \"userHernandez12@gmail.com\"", response3.getBody());
		
	}
	
	@Test
	@Order(3)
	void testChangeUserPassword() {
		NewPasswordDTO fakeUser = new NewPasswordDTO("Garcia", "Garcia1Pass");
		NewPasswordDTO wrongPass = new NewPasswordDTO("Molesto", "Pass1");
		NewPasswordDTO goodTest = new NewPasswordDTO("Molesto", "test101Molesto45u87");
		
		var response = resetService.changeUserPassword(fakeUser.getUsername(), fakeUser.getPassword());
		var response2 = resetService.changeUserPassword(wrongPass.getUsername(), wrongPass.getPassword());
		var response3 = resetService.changeUserPassword(goodTest.getUsername(), goodTest.getPassword());
		
		assertEquals("Neautorizuota. Nėra tokio vartotojo vardo kaip \"Garcia\"", response.getBody());
		assertEquals("Molesto - nepakankamas slaptažodžio ilgis arba jo nėra visai", response2.getBody());
		assertEquals("Slaptažodis pakeistas", response3.getBody());
	}
	
	@Test
	@Order(4)
	void testDeleteTestUser() {
		userService.deleteUser("Molesto");
		
		assertNull(userService.findByUsername("Molesto"));
	}
	
}
