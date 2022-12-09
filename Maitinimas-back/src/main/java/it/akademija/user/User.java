package it.akademija.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

import it.akademija.role.Role;

@Entity
@Table(uniqueConstraints= {@UniqueConstraint(columnNames="username")}, name = "users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long userId;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	@Email
	@Column
	private String email;
	
	@NotEmpty
	@Column
	private String username;

	@NotEmpty
	@Column
	private String password;
	
	public User() {
	}

	public User(Long userId, Role role, @Email String email, @NotEmpty String username, @NotEmpty String password) {
		super();
		this.userId = userId;
		this.role = role;
		this.email = email;
		this.username = username;
		this.password = password;
	}
	
	public User(Role role, @Email String email, @NotEmpty String username, @NotEmpty String password) {
		super();
		this.role = role;
		this.email = email;
		this.username = username;
		this.password = password;
	}

	public User(Long userId, Role role, String username) {
		this.userId = userId;
		this.role = role;
		this.username = username;
	}
	
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((userId == null) ? 0 : userId.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		User other = (User) obj;
		if (userId == null) {
			if (other.userId != null)
				return false;
		} else if (!userId.equals(other.userId))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}
	
	
	
}
