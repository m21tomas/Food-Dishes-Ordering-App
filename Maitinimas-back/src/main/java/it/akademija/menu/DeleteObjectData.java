package it.akademija.menu;

import java.util.Objects;

public class DeleteObjectData {
	private boolean deleted;
	private String canteenName;
	private String menuName;
	
	public DeleteObjectData() {}
	
	public DeleteObjectData(boolean status, String canteenName, String menuName) {
		super();
		this.deleted = status;
		this.canteenName = canteenName;
		this.menuName = menuName;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public String getCanteenName() {
		return canteenName;
	}

	public void setCanteenName(String canteenName) {
		this.canteenName = canteenName;
	}

	public String getMenuName() {
		return menuName;
	}

	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}

	@Override
	public int hashCode() {
		return Objects.hash(canteenName, menuName, deleted);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		DeleteObjectData other = (DeleteObjectData) obj;
		return Objects.equals(canteenName, other.canteenName) && Objects.equals(menuName, other.menuName)
				&& deleted == other.deleted;
	}
	
}
