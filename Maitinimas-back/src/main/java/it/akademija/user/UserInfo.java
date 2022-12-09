package it.akademija.user;

public class UserInfo {

	private Long userId;
	private String role;
	private String username;
	private String password;
	private String email;
	

	public UserInfo() {

	}

	public UserInfo(Long userId, String role, String username) {
		this.userId = userId;
		this.role = role;
		this.username = username;

	}

	public UserInfo(Long userId, String role, String username, String password, String email) {
		super();
		this.userId = userId;
		this.role = role;
		this.username = username;
		this.password = password;
		this.email = email;
	}

	public UserInfo(String role, String username, String password, String email) {
		super();
		this.role = role;
		this.username = username;
		this.password = password;
		this.email = email;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	
}