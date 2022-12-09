package it.akademija.menu;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotEmpty;

import it.akademija.dish.Dish;
@Entity
//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Menu {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotEmpty
	@Column
	private String name;
	
	@OneToMany(cascade = { CascadeType.ALL}, fetch = FetchType.EAGER, orphanRemoval = true)
	@JoinColumn(name="MENU_ID")
	private List<Dish> dishes;
	
	public Menu() {}

	public Menu(Long id, String name, List<Dish> dishes) {
		super();
		this.id = id;
		this.name = name;
		this.dishes = dishes;
	}
	
	public Menu(String name, List<Dish> dishes) {
		super();
		this.name = name;
		this.dishes = dishes;
	}

	public Menu(String name) {
		super();
		this.name = name;
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

	public List<Dish> getDishes() {
		return dishes;
	}

	public void setDishes(List<Dish> dishes) {
		this.dishes = dishes;
	}

}
