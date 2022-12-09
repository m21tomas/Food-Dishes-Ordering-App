package it.akademija.order;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Item {
	
	@Id
	private Integer id;
	
	@Column(name="`NAME`")
	private String dishName;
	
	@Column(name = "`DESCRIPTION`", length = 2000)
	private String dishDescription;
	
	@Column(name = "`QUANTITY`")
	private Integer quantityInCart;
	
	@Column(name = "`USER`")
	private String username;

	public Item () {}
	
	public Item(Integer id, String dishName, String dishDescription, Integer quantityInCart, String username) {
		super();
		this.id = id;
		this.dishName = dishName;
		this.dishDescription = dishDescription;
		this.quantityInCart = quantityInCart;
		this.username = username;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getDishName() {
		return dishName;
	}

	public void setDishName(String dishName) {
		this.dishName = dishName;
	}

	public String getDishDescription() {
		return dishDescription;
	}

	public void setDishDescription(String dishDescription) {
		this.dishDescription = dishDescription;
	}

	public Integer getQuantityInCart() {
		return quantityInCart;
	}

	public void setQuantityInCart(Integer quantityInCart) {
		this.quantityInCart = quantityInCart;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Override
	public String toString() {
		return "Item [id=" + id + ", dishName=" + dishName + ", dishDescription=" + dishDescription
				+ ", quantityInCart=" + quantityInCart + ", username=" + username + "]";
	} 
	
	
}
