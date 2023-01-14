package it.akademija.order;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotEmpty;

import org.springframework.format.annotation.DateTimeFormat;

@Entity
public class Orders {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@NotEmpty
	@DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
	private LocalDateTime submitedAt;
	
	@NotEmpty
	private String orderName;
	
	@NotEmpty
	@Column(name="`User`")
	private String username;
	
	@Enumerated(EnumType.STRING)
	@Column
	private OrderStatus status;
	
	@OneToMany(cascade = { CascadeType.ALL}, fetch = FetchType.LAZY, orphanRemoval = true)
	@JoinColumn(name="ORDERS_ID")
	private Set<Item> items;
	
	public Orders() {}

	public Orders(@NotEmpty LocalDateTime submitedAt, @NotEmpty String orderName, @NotEmpty String username,
			OrderStatus status) {
		super();
		this.submitedAt = submitedAt;
		this.orderName = orderName;
		this.username = username;
		this.status = status;
	}
	
	public Orders(@NotEmpty String orderName, @NotEmpty String username, OrderStatus status) {
		super();
		this.orderName = orderName;
		this.username = username;
		this.status = status;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDateTime getSubmitedAt() {
		return submitedAt;
	}

	public void setSubmitedAt() {
		ZoneId GMTplus2 = ZoneId.of("Europe/Vilnius");
		this.submitedAt = LocalDateTime.now(GMTplus2);
	}

	public String getOrderName() {
		return orderName;
	}

	public void setOrderName(String orderName) {
		this.orderName = orderName;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public Set<Item> getItems() {
		return items;
	}

	public void setItems(Set<Item> items) {
		this.items = items;
	}

	@Override
	public String toString() {
		return "Orders [id=" + id + ", submitedAt=" + submitedAt + ", orderName=" + orderName + ", username=" + username
				+ ", status=" + status + ", items=" + items + "]";
	}
	
	
}
