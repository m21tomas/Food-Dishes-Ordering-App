package it.akademija.cart;

public class CartItemsResponseDTO {
	
	 private Integer cartItemId;
	 
	 private Long dishId;
	 
	 private String dishName;
	 
	 private String dishDescription;
	 
	 private Integer quantityInCart;
	 
	 private String username;
	 
	 private String serviceResponse;
	 
	 public CartItemsResponseDTO() {}

	 public CartItemsResponseDTO(Integer cartItemId, Long dishId ,String dishName, String dishDescription, Integer quantityInCart,
			String username, String serviceResponse) {
		super();
		this.cartItemId = cartItemId;
		this.dishId = dishId;
		this.dishName = dishName;
		this.dishDescription = dishDescription;
		this.quantityInCart = quantityInCart;
		this.username = username;
		this.serviceResponse = serviceResponse;
	 }

	public Integer getCartItemId() {
		return cartItemId;
	}

	public void setCartItemId(Integer cartItemId) {
		this.cartItemId = cartItemId;
	}	

	public Long getDishId() {
		return dishId;
	}

	public void setDishId(Long dishId) {
		this.dishId = dishId;
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

	public String getServiceResponse() {
		return serviceResponse;
	}

	public void setServiceResponse(String serviceResponse) {
		this.serviceResponse = serviceResponse;
	}
	
}
