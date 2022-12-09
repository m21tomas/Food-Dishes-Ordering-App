package it.akademija.canteen;

import java.util.List;

import it.akademija.menu.Menu;

public class CanteenWithAnImageDTO {

    private Long id;
	
	private String name;
	
	private String address;
	
	private byte[] image;
	
	private List<Menu> menus;
	
	public CanteenWithAnImageDTO() {}

	public CanteenWithAnImageDTO(Long id, String name, String address, byte[] image) {
		super();
		this.id = id;
		this.name = name;
		this.address = address;
		this.image = image;
	}

	public CanteenWithAnImageDTO(Long id, String name, String address, byte[] image, List<Menu> menus) {
		super();
		this.id = id;
		this.name = name;
		this.address = address;
		this.image = image;
		this.menus = menus;
	}

	public List<Menu> getMenus() {
		return menus;
	}

	public void setMenus(List<Menu> list) {
		this.menus = list;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public byte[] getImage() {
		return image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}
	
}
