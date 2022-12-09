package it.akademija.menu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.akademija.canteen.Canteen;
import it.akademija.canteen.CanteenController;
import it.akademija.canteen.CanteenDAO;
import it.akademija.dish.DishDTO;
import it.akademija.dish.DishWithIdDTO;

@RestController
@RequestMapping(path = "/api/menu")
public class MenuController {
	private static final Logger LOG = LoggerFactory.getLogger(CanteenController.class);

	@Autowired
	private MenuService menuService;
	
	@Autowired
	private CanteenDAO canteenDao;
	
	@Secured({ "ROLE_ADMIN" })
	@GetMapping("/{id}")
	public Menu getMenuById(@PathVariable  Long id){
		
		return menuService.getMenuById(id);
		
	}
	
	@Secured({ "ROLE_ADMIN" })
	@PostMapping(value = "/new", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> createNewMenu(@RequestBody CanteenMenuDTO data) {
		
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		System.out.println("CREATE NEW MENU CONTROLLER, CanteenMenuDTO data.getId(): " + data.getCanteenId());
		if(menuService.CheckIfMenuAlreadyExistsByCanteenID(data)) {
			String alreadyExists = currentUsername + " bandė sukurti jau esantį meniu";
			
			LOG.warn(alreadyExists);
			
			return new ResponseEntity<String>(alreadyExists, HttpStatus.CONFLICT);
		}
		else if(menuService.createNewMenu(data)){
			Canteen canteen = canteenDao.findById(data.getCanteenId()).orElse(null);
			String canteenName = null;
			if(canteen != null) {
				canteenName = canteen.getName();
			}
			String createdMenuMessage = currentUsername + " sukūrė meniu, pavadinimu: " 
			                            + data.getName() + ", maitinmo įstaigai pavadinimu: "
			                            + canteenName;
			LOG.info(createdMenuMessage);
			
			return new ResponseEntity<String>(createdMenuMessage, HttpStatus.CREATED);
		}
		LOG.error("Meniu sukurti nepavyko");
		
		return new ResponseEntity<String>("Meniu sukurti nepavyko", HttpStatus.BAD_REQUEST);
	}
	
	@Secured({ "ROLE_ADMIN" })
	@PutMapping("/update/{id}")
	public ResponseEntity<String> updateCanteenSomeMenu (@RequestBody CanteenMenuDTO updated, @PathVariable Long id){
		
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		if(menuService.getMenuById(id) == null) {
			
			LOG.info("[{}]: Meniu, kurio ID: [{}] nėra", currentUsername, id);
			
			return new ResponseEntity<String>("Meniu, kurio ID="+id.toString()+" nėra", HttpStatus.NOT_FOUND);
		} else if(menuService.updateMenuName(id, updated)){
			
			LOG.info("[{}]: Meniu pavadinimas atnaujintas", currentUsername);
			
			return new ResponseEntity<String>("Meniu pavadinimas atnaujintas", HttpStatus.OK);
		} else {
			LOG.info("[{}]: Meniu pavadinimu [{}] jau yra. "
					+ "Arba neįmanoma išsaugoti duombazėj dėl kitos priežasties", currentUsername, updated.getName());
			
			return new ResponseEntity<String>("Meniu pavadinimu "+updated.getName()+" jau yra. "
					+ "Arba neįmanoma išsaugoti duombazėj dėl kitos priežasties", HttpStatus.CONFLICT);
		}
	}
	
	@Secured({ "ROLE_ADMIN" })
	@DeleteMapping("/delete/{canteenId}/{menuId}")
	public ResponseEntity<String> deleteMenuById (@PathVariable(required = true, name = "canteenId") Long canteenId, 
												@PathVariable(required = true, name = "menuId") Long menuId) {
		
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		System.out.println("MENU CONTROLLER - deleteMenuById, canteenId: " + canteenId + ", menuId: " + menuId);
		DeleteObjectData deleteStatus = menuService.deleteMenuByCanteenId(canteenId, menuId);
		
			if(deleteStatus.isDeleted()) {
				LOG.info("[{}]: Įstaiga: [{}], meniu pavadinimu \"[{}]\" ištrintas", currentUsername, deleteStatus.getCanteenName(), deleteStatus.getMenuName());
				
				String okAnswer = "Įstaigoje \"" + deleteStatus.getCanteenName() + "\" ištrintas \"" + deleteStatus.getMenuName() + "\" meniu";
				
				return new ResponseEntity<String>(okAnswer, HttpStatus.OK);
			}
			else if (!deleteStatus.isDeleted() && deleteStatus.getMenuName() == null) {
				LOG.info("[{}]: Įstaigoje: [{}], tokio meniu, kurio ID:[{}] nėra", currentUsername, deleteStatus.getCanteenName(), menuId);
				
				String noSuchMenu = "Įstaiga \"" + deleteStatus.getCanteenName() + "\" tokio meniu neturi";
				
				return new ResponseEntity<String>(noSuchMenu, HttpStatus.NOT_ACCEPTABLE);
			}
			else if (!deleteStatus.isDeleted() && deleteStatus.getCanteenName() == null) {
				LOG.info("[{}]: Klientas pareikalavo įstaigos ID:[{}], kurios duombazėj nėra", currentUsername, canteenId);
				
				String noSuchCanteen = "Įstaigos pareikalautu ID: " + canteenId + " nėra";
				
				return new ResponseEntity<String>(noSuchCanteen, HttpStatus.NOT_FOUND);
			}
			else {
				LOG.info("[{}]: Unknown Error, requested canteenId:[{}], menuId:[{}]", currentUsername, canteenId, menuId);
				
				String uknownError = "Unknown Error, requested canteenId:"+canteenId+", menuId:"+ menuId;
				
				return new ResponseEntity<String>(uknownError, HttpStatus.INTERNAL_SERVER_ERROR);
			}
	}
	
	@Secured({ "ROLE_ADMIN" })
	@PutMapping(
            value="/addDishForMenu/{menuId}",
            consumes={"application/json"}
    )
    public ResponseEntity<Void> addNewDishToMenu(
            @PathVariable long menuId, 
            @RequestBody DishDTO dish) {
		
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		if(menuService.checkProvidedDishInTheMenu(menuId, dish)) {
			LOG.warn("[{}] - Patiekalas [{}] neįdėtas, nes toks jau yra šiame meniu", currentUsername, dish.getName());
			
			return new ResponseEntity<Void>(HttpStatus.CONFLICT);
		}
		else if(menuService.addNewDishToMenu(menuId, dish)) {
            
			String newDishAdded = currentUsername + " įdėjo naują patiekalą: " +
			dish.getName() + " į meniu";
			
			LOG.info(newDishAdded);
			
			return new ResponseEntity<Void>(HttpStatus.CREATED);
		}
		else {
			LOG.warn("[{}] patiekalas neįdėtas, nes meniu su id: [{}] nėra", currentUsername, menuId);
			
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
    }
	
	@Secured({ "ROLE_ADMIN" })
	@PutMapping(
            value="/changeDishInTheMenu/{menuId}",
            consumes={"application/json"}
    )
	public ResponseEntity<String> changeDishInTheMenu(@PathVariable long menuId, @RequestBody DishWithIdDTO dishWithIdDTO){
		return menuService.changeDishInTheMenu(menuId, dishWithIdDTO);
	}
	
	@Secured({ "ROLE_ADMIN" })
	@DeleteMapping("/removeDishFromMenu/{menuId}/{dishId}")
    public ResponseEntity<Void> removeDishFromTheMenu(
            @PathVariable long menuId, 
            @PathVariable long dishId) {
		
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		if(menuService.removeDishFromTheMenu(menuId, dishId)) {
            
			String newDishAdded = currentUsername + " pašalino patiekalą: " +
					dishId + " iš meniu";
			
			LOG.info(newDishAdded);
			
			return ResponseEntity.ok().build();
		}
		else {
			LOG.warn("[{}], patiekalas nepašalintas, nes meniu su id: [{}] nėra. Arba tokio patiekalo nėra", currentUsername, menuId);
			
			return ResponseEntity.notFound().build();
		}
        
    }
	
}
