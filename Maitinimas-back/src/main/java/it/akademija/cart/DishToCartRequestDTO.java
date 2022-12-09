package it.akademija.cart;

public class DishToCartRequestDTO {
	
	private Long menuId;
    private Long dishId;
    private Integer quantity;
    
    public DishToCartRequestDTO() {}
    
	public DishToCartRequestDTO(Long menuId, Long dishId, Integer quantity) {
		super();
		this.menuId = menuId;
		this.dishId = dishId;
		this.quantity = quantity;
	}

	public Long getMenuId() {
		return menuId;
	}

	public void setMenuId(Long menuId) {
		this.menuId = menuId;
	}

	public Long getDishId() {
		return dishId;
	}

	public void setDishId(Long dishId) {
		this.dishId = dishId;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
    
    
}
