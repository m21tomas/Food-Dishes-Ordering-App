package it.akademija.canteen;

import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotEmpty;

import it.akademija.menu.Menu;

@Entity
@Table(uniqueConstraints=@UniqueConstraint(columnNames="code"))
//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Canteen {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@NotEmpty
	private Long code;
	
	@NotEmpty
	private String name;
	
	@NotEmpty
	private String address;
	
	@OneToMany(cascade = { CascadeType.ALL}, fetch = FetchType.EAGER) //, fetch = FetchType.LAZY)
	@JoinColumn(name="CANTEEN_ID")
	private List<Menu> menus;
	
	private String imagename;
		
	public Canteen() {}
	
	public Canteen(@NotEmpty Long code, @NotEmpty String name, @NotEmpty String address, String image, List<Menu> menu) {
		super();
		this.code = code;
		this.name = name;
		this.address = address;
		this.imagename = image;
		this.menus = menu;
	}
	
	public Canteen(@NotEmpty Long code, @NotEmpty String name, @NotEmpty String address) {
		super();
		this.code = code;
		this.name = name;
		this.address = address;

	}
	
	public Canteen(@NotEmpty Long code, @NotEmpty String name, @NotEmpty String address, String image) {
		super();
		this.code = code;
		this.name = name;
		this.address = address;
		this.imagename = image;
	}

	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getCode() {
		return code;
	}

	public void setCode(Long code) {
		this.code = code;
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

	public String getImagename() {
		return imagename;
	}

	public void setImagename(String image) {
		this.imagename = image;
	}

	public List<Menu> getMenus() {
		return menus;
	}

	public void setMenus(List<Menu> menu) {
		this.menus = menu;
    }

	@Override
	public int hashCode() {
		return Objects.hash(address, id, name);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Canteen other = (Canteen) obj;
		return Objects.equals(address, other.address) && Objects.equals(id, other.id)
				&& Objects.equals(name, other.name);
	}

}
