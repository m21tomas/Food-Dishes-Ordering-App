package it.akademija.user;

public class UserDTO {
	
	private String role;
	private String email;
	private String username;
	private String password;
	
	public UserDTO() {

	}

	public UserDTO(String role, String email, String username, String password) {
		super();
		this.role = role;
		this.email = email;
		this.username = username;
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
