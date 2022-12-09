package it.akademija.menu;

public class CanteenMenuDTO {
	private long canteenId; // restorano ar maitinimo įstaigos ID, pagal kūrį tikrina ar tas restoranas jau turi Meniu.
	private String name; // Šio Meniu pavadinimas
	
	public CanteenMenuDTO() {}
	
	public CanteenMenuDTO(String name) {
		super();
		this.name = name;
	}
	
	public CanteenMenuDTO(Long canteenId, String name) {
		super();
		this.canteenId = canteenId;
		this.name = name;
	}
	
	public long getCanteenId() {
		return canteenId;
	}

	public void setCanteenId(long canteenId) {
		this.canteenId = canteenId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
}
