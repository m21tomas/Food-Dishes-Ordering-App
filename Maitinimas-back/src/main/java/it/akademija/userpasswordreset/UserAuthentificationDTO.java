package it.akademija.userpasswordreset;

public class UserAuthentificationDTO {
	
	private String username;
	
	private String email;
	
	public UserAuthentificationDTO() {}

	public UserAuthentificationDTO(String username, String email) {
		super();
		this.username = username;
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "UserAuthentificationDTO [username=" + username + ", email=" + email + "]";
	}
	
}
