package it.akademija.userpasswordreset;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.logout;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.akademija.user.UserDTO;
import it.akademija.user.UserService;


//@WebMvcTest(UserPasswordResetController.class)
@TestInstance(Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class UserPasswordResetControllerTest {
	
	@Autowired
	private MockMvc mockMvc;
	
	@Autowired
    private WebApplicationContext context;

	@Autowired
	private ObjectMapper objectMapper;
	
	@Mock
	private UserService userService;
	
	@BeforeAll
    public void setup() throws Exception {
		mockMvc = MockMvcBuilders
		          .webAppContextSetup(context)
		          .apply(springSecurity())
		          .build();
    }
	
	@Test
	@Order(1)
	void testCreateNewUser() throws Exception {
		UserDTO newUser = new UserDTO("USER", "userMolesto01@gmail.com", "Molesto", "testMolesto223");
		
		mockMvc.perform(post("/api/users/createAccount").contentType(MediaType.APPLICATION_JSON)
	       .content(objectMapper.writeValueAsString(newUser)))
		   .andExpect(status().isCreated())
		   .andDo(print());
	}
	
	@Test
	@Order(2)
	void testAuthentificateUser() throws Exception {
		UserAuthentificationDTO userAuthentificating = new UserAuthentificationDTO("Molesto", "userMolesto01@gmail.com");
		
		mockMvc.perform(post("/userAuthentification").contentType(MediaType.APPLICATION_JSON)
	       .content(objectMapper.writeValueAsString(userAuthentificating)))
		   .andExpect(status().isOk())
		   .andDo(print());
	}
	
	@Test
	@Order(3)
	void testChangeUserPassword() throws Exception {
		NewPasswordDTO newPass = new NewPasswordDTO("Molesto", "testMolesto440");

        mockMvc.perform(MockMvcRequestBuilders.post("/userChangePassword", newPass)
        		                              .contentType(MediaType.APPLICATION_JSON)
        		                              .content(objectMapper.writeValueAsString(newPass)))
               .andExpect(status().isOk())
               .andDo(print());
	}
	
	@Test
	@Order(4)
	void testReplicateLoginWithNewPassword() throws Exception {
		RequestBuilder requestBuilder = formLogin().user("Molesto").password("testMolesto440");
		mockMvc.perform(requestBuilder)
			   .andDo(print())
		       .andExpect(status().isOk());
	}
	
	@Test
	@Order(5)
	@WithMockUser(username = "Molesto", roles = { "USER" })
	void testReplicateUserLogout() throws Exception {
		
		mockMvc.perform(logout())
				.andExpect(status().isOk())
				.andDo(print());
	}
	
	@Test
	@Order(6)
	@WithMockUser(username = "admin4@admin.lt", roles = { "ADMIN" })
	void testDeleteNewUser() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/admin/delete/{username}", "Molesto")) 
               .andExpect(status().isOk())
               .andDo(print());
	}
}
