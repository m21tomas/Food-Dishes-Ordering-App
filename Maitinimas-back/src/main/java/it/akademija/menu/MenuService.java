package it.akademija.menu;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.akademija.canteen.Canteen;
import it.akademija.canteen.CanteenController;
import it.akademija.canteen.CanteenDAO;
import it.akademija.dish.Dish;
import it.akademija.dish.DishDTO;
import it.akademija.dish.DishWithIdDTO;

@Service
public class MenuService {
	@Autowired
	private MenuDAO menuDao;
	
	@Autowired
	private CanteenDAO canteenDao;
	
	private static final Logger LOG = LoggerFactory.getLogger(CanteenController.class);
	
	@Transactional(readOnly = true)
	public boolean CheckIfMenuAlreadyExistsByCanteenID(CanteenMenuDTO data) {
		
		//Menu menu = menuDao.findByName(data.getName()).orElse(null);
		System.out.println("MenuService CANTEENDTO Code: " + data.getCanteenId());
		System.out.println("MenuService CANTEENDTO Name: " + data.getName());
		Canteen canteen = canteenDao.findByCanteenCode(data.getCanteenId()); //findById(data.getCanteenId()).orElse(null);
		
		if(canteen != null) {
		
			if(canteen.getMenus().size() != 0) {
				
				for(Menu thisMenu : canteen.getMenus()) {
					
					if(thisMenu.getName().equals(data.getName())) {
						return true;
					}
				}
						
				return false;
			}
			else {
				return false;
			}
		}
		return false;
	}
	
	@Transactional(readOnly = true)
	public Menu getMenuById(Long id) {
		Menu menu = menuDao.findById(id).orElse(null);
		
		return menu;
	}

	@Transactional
	public boolean createNewMenu(CanteenMenuDTO data) {
		
		Canteen canteen = canteenDao.findByCanteenCode(data.getCanteenId()); //findById(data.getCanteenId()).orElse(null);
		
		List<Menu> menus = canteen.getMenus();
		
		if(menus == null) {
			menus = new ArrayList<Menu>();
		}
		Menu menu = new Menu();
		menu.setName(data.getName());
		menus.add(menuDao.save(menu));
		canteen.setMenus(menus);
		
		
		Canteen savedCanteen = null;
		savedCanteen = canteenDao.saveAndFlush(canteen);
		
		if(savedCanteen != null) {
			return true;
		}
		else return false;
	}
	
	@Transactional
	public boolean updateMenuName(Long id, CanteenMenuDTO update) {
		
		Canteen theCanteen = canteenDao.findByCanteenCode(update.getCanteenId()); //  findById(update.getCanteenId()).orElse(null);
		
		if(theCanteen != null) {
			
			boolean namesEqual = false;
			
			for(Menu item : theCanteen.getMenus()) {
				
				if(item.getName().equals(update.getName())) {
					namesEqual = true;
				}
			}
			
			Menu currentMenu = menuDao.findById(id).orElse(null);
			
			String earlierName = currentMenu.getName();
			
			currentMenu.setName(update.getName());
			
			menuDao.save(currentMenu);
			
			Menu updatedMenu = menuDao.findById(id).orElse(null);
			
			String newName = updatedMenu.getName();
			
			if(earlierName.equals(newName) || namesEqual) {
				return false;
			}
			else {
				return true;
			}
		}
		
		return false;
	}
	
	@Transactional
	public DeleteObjectData deleteMenuByCanteenId (Long canteenId, Long menuId){
		Canteen thisCanteen = canteenDao.findByCanteenCode(canteenId);  //findById(canteenId).orElse(null);

		if(thisCanteen != null) {
			List<Menu> menus = thisCanteen.getMenus();  //.getId();
//			System.out.println("Printing menu list:");
//			for (int i = 0; i < menus.size(); i++) {
//	            System.out.println("Id: "+menus.get(i).getId()+", name: "+menus.get(i).getName()+", dishes:"+menus.get(i).getDishes().toString()); 
//	        }
//			System.out.println();
			
			for(Menu menuItem : menus) {
//				System.out.println("Searching canteen menu ids: "+String.valueOf(menuItem.getId())+", need: "+String.valueOf(menuId));
//				System.out.println();
				if(menuItem.getId().equals(menuId)) {
					System.out.println("Deleting menu with ID: " + menuId);
					menus.remove(menuItem);
					thisCanteen.setMenus(menus);
					canteenDao.saveAndFlush(thisCanteen);
					menuDao.deleteById(menuId);
					return new DeleteObjectData(true, thisCanteen.getName(), menuItem.getName());
				}
			}
			return new DeleteObjectData(false, thisCanteen.getName(), null);
		}
		return new DeleteObjectData(false, null, null);
	}
	
	@Transactional(readOnly = true)
	public boolean checkProvidedDishInTheMenu(Long id, DishDTO newDish) {
		
		Menu menu = menuDao.findById(id).orElse(null);
        if (menu == null) {
            return false;
        }
        else {
        	for(Dish dish : menu.getDishes()) {
        		if(dish.getName().equals(newDish.getName())) {
        			return true;
        		}
        	}
        }
		return false;
	}
	
	@Transactional
	public boolean addNewDishToMenu(Long menuId, DishDTO dish) {
		
		Menu menu = menuDao.findById(menuId).orElse(null);
        if (menu == null) {
            return false;
        }
        else {
        	Dish newDish = new Dish();
        	newDish.setName(dish.getName());
        	newDish.setDescription(dish.getDescription());
        	
            menu.getDishes().add(newDish);
            menuDao.save(menu);
            return true;
        }
	}
	
	@Transactional
	public ResponseEntity<String> changeDishInTheMenu(Long menuId, DishWithIdDTO dishDto){
		
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		Menu menu = menuDao.findById(menuId).orElse(null);
		
		if(menu != null) {
			List<Dish> dishes = menu.getDishes();
			
			Dish dish = null;
			
			for(int i = 0; i < dishes.size() ; i++ ){
				if(dishes.get(i).getId().equals(dishDto.getId())) {
					
					if(dishes.get(i).getName().equals(dishDto.getName()) &&
					   dishes.get(i).getDescription().equals(dishDto.getDescription())) {
						
						String SameDishNameWarning = currentUsername+": Toks pavadinimas jau yra. Patiekalo pavadinimas nepakeistas.";
						
						LOG.warn(SameDishNameWarning);
						
						return new ResponseEntity<String>(SameDishNameWarning, HttpStatus.CONFLICT);
					}
					
					String oldName = dishes.get(i).getName();
					String oldDescription = dishes.get(i).getDescription();
										
					dish = new Dish(dishDto.getId(), dishDto.getName(), dishDto.getDescription());
					
					dishes.set(i, dish);
					
					menu.setDishes(dishes);
					
					menuDao.save(menu);
					
					String dishUpdateSuccess = currentUsername+"- Meniu: " +menu.getName()+", patiekalas: \n\""+
						   oldName+" - "+oldDescription+"\" \npakeistas į: \n\""+dishDto.getName()+" - "+dishDto.getDescription()+"\"";
					
					LOG.info(dishUpdateSuccess);
					
					return new ResponseEntity<String>(dishUpdateSuccess, HttpStatus.OK);
				}
			}
			String noSuchDish = currentUsername+": Patiekalo, kurio ID: "+dishDto.getId()+", o pavadinimas: "+dishDto.getName()+" - nėra";
			
			LOG.warn(noSuchDish);
			
			return new ResponseEntity<String>(noSuchDish, HttpStatus.NOT_FOUND);
		}
		else {
			String noSuchMenu = currentUsername+": Meniu, kurio ID: "+menuId+" nėra";
			
			LOG.warn(noSuchMenu);
			
			return new ResponseEntity<String>(noSuchMenu, HttpStatus.NOT_FOUND);
		}
		
	}
	
	@Transactional
	public boolean removeDishFromTheMenu(Long menuId, Long dishId) {
		
		Menu menu = menuDao.findById(menuId).orElse(null);
		
		if(menu != null) {
			List<Dish> dishes = menu.getDishes();
			Dish dish = null;
			for(Dish item : dishes) {
				if(item.getId().equals(dishId)) {
					dish = item;
					break;
				}
			}
			dishes.remove(dish);
			menu.setDishes(dishes);		
			menuDao.save(menu);
			return true;
		}
		else return false;	
	}
}
