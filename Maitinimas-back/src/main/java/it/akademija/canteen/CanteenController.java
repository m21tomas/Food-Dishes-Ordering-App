package it.akademija.canteen;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping(path = "/api/istaigos")
public class CanteenController {
	
	private static final Logger LOG = LoggerFactory.getLogger(CanteenController.class);
	
	@Autowired
	private CanteenService canteenService;
	
	/**
	 * 
	 * Controller function strictly for an administrator to create new Catering
	 * 
	 * @param data
	 * @return message
	 */
	@Secured({ "ROLE_ADMIN" })
	@PostMapping("/canteen/new")
	public ResponseEntity<String> createNewCanteen(@RequestBody CanteenDTO data) {

		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

		Long canteenID = data.getId(); String canteenName = data.getName();
		
		if(canteenService.existsById(canteenID, canteenName)) {
			
			String alreadyExists = "Administratorius " + currentUsername + " bandė sukurti jau esančią maitinimo įstaigą";
			
			LOG.warn(alreadyExists);
			
			return new ResponseEntity<String>(alreadyExists, HttpStatus.CONFLICT);
		}
		else if(canteenService.createNewCanteen(data)) {
			LOG.info("Administratorius [{}] sukūrė naują maitinimo įstaigą - [{}]", currentUsername, data.getName());
			
			return new ResponseEntity<String>("Maitinmo įstaiga išsaugota", HttpStatus.CREATED);
		}
		else {
			LOG.error("Maitinimo įstaigos sukurti nepavyko");
			
			return new ResponseEntity<String>("Maitinimo įstaigos sukurti nepavyko", HttpStatus.BAD_REQUEST);
		}
	}
	
	/**
	 * 
	 * Controller function strictly for an administrator to create new Catering with an image
	 * 
	 * @param data
	 * @return message
	 */
	@Secured({ "ROLE_ADMIN" })
	@RequestMapping(value="/canteenwithimage/new", 
		            method = RequestMethod.POST,
		            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> createNewCanteen(
		    @RequestPart("jsonBodyData") CanteenDTO data,
		    @RequestPart("file") MultipartFile file) throws IOException {
		
			String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
	
			Long canteenID = data.getId(); String canteenName = data.getName();
			
			if(canteenService.existsById(canteenID, canteenName)) {
				
				String alreadyExists = "Administratorius " + currentUsername + " bandė sukurti jau esančią maitinimo įstaigą";
				
				LOG.warn(alreadyExists);
				
				return new ResponseEntity<String>(alreadyExists, HttpStatus.CONFLICT);
			}
			
			else if(canteenService.createNewCanteenAndSaveImage(file, data)) {
				LOG.info("Maitinmo įstaiga išsaugota - [{}]", canteenName);
				
				return new ResponseEntity<String>("Maitinmo įstaiga išsaugota", HttpStatus.CREATED); 
			}
			else {
				LOG.error("Maitinimo įstaigos sukurti nepavyko");
				
				return new ResponseEntity<String>("Maitinmo įstaiga neišsaugota", HttpStatus.BAD_REQUEST); 
			}	
		}
	
	/**
	 * 
	 * Function to return a list of all canteens in the database
	 * 
	 * @param data
	 * @return message
	 */
	@Secured({ "ROLE_USER", "ROLE_ADMIN" })
	@RequestMapping(value="/allCenteens", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<CanteenWithAnImageDTO>> getAllCanteens() throws FileNotFoundException, IOException {
		
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		List<CanteenWithAnImageDTO> listOfCanteens = canteenService.getAllCanteens();
		
		if(listOfCanteens.size() > 0) {
			LOG.info("Visos maitinimo įstaigos perduotos frontui. Naudotojas: [{}]", currentUsername);
		    return new ResponseEntity<List<CanteenWithAnImageDTO>>(listOfCanteens, HttpStatus.OK);
		}
		else {
			LOG.error("Nepavyko gauti ir grąžinti maitinimo įstaigų sąrašo");
			
		    return ResponseEntity.badRequest().body(null);
		}	
	}
	
	/**
	 * Retrieves a Canteen by its id
	 * 
	 * @return an canteen data
	 * @throws IOException 
	 * @throws FileNotFoundException 
	 */
	@SuppressWarnings("unused")
	@Secured({ "ROLE_USER", "ROLE_ADMIN" })
	@GetMapping("/canteen/{id}")
	public ResponseEntity<CanteenWithAnImageDTO> getCanteenWithImageById(@PathVariable @Valid Long id) throws FileNotFoundException, IOException {

		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		System.out.println();
		System.out.println("CANTEEN_CONTROLLER getCanteenWithImageById received path variable: "+ id);
		System.out.println();
			
		CanteenWithAnImageDTO entity = canteenService.getCanteenById(id);
		
		if(entity != null) {
			LOG.info("[{}] pasirinko maitinimo įstaigą: [{}]", currentUsername, entity.getName());
			
			return new ResponseEntity<CanteenWithAnImageDTO>(entity, HttpStatus.OK);
		}

		else if (entity == null) {
			LOG.warn("[{}] pasirinko maitinimo įstaigą, kurios nėra, id: [{}]", currentUsername, id);
			
			return ResponseEntity.notFound().build();
		}
		//return new ResponseEntity<CanteenWithAnImageDTO>(entity, HttpStatus.NOT_FOUND);
		return ResponseEntity.badRequest().build();
	}

	/**
	 * Returns a page of all canteens.
	 * 
	 * @return page of all canteens
	 */
	@Secured({ "ROLE_USER", "ROLE_ADMIN" })
	@GetMapping(path = "/allCenteensPage")
	public Page<CanteenWithAnImageDTO> getAPageOfAllCanteens(@RequestParam("page") int page, @RequestParam("size") int size) {

		Sort.Order order = new Sort.Order(Sort.Direction.ASC, "id");

		Pageable pageable = PageRequest.of(page, size, Sort.by(order));

		return canteenService.getAPageOfAllCanteens(pageable);
	}
	
	@Secured({ "ROLE_ADMIN" })
	@PutMapping(value="/canteen/updateImage/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> updateCanteenImage (@PathVariable Long id, @RequestPart("file") MultipartFile file) throws IOException{
		
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		CanteenWithAnImageDTO canteen = canteenService.getCanteenById(id);
		
        if(canteen == null) {
			
			LOG.info("[{}]: Matinimo įstaigos, kurios ID: [{}], - nėra", currentUsername, id);
			
			return new ResponseEntity<String>("Matinimo įstaigos, kurios ID="+id.toString()+", - nėra", HttpStatus.NOT_FOUND);
		}else if(canteenService.updateCanteenImage(file, id)) {
			
			LOG.info("[{}]: Matinimo įstaigos, kurios ID: [{}] paveiksliukas atnaujintas", currentUsername, id);
			
			return new ResponseEntity<String>("Matinimo įstaigos, kurios ID="+id.toString()+" paveiksliukas atnaujintas", HttpStatus.OK);
		}else {
			LOG.info("[{}]: Unknown Error, requested canteenId:[{}], menuId: [{}]", currentUsername, id);
			
			String uknownError = "Unknown Error, requested canteenId: "+id;
			
			return new ResponseEntity<String>(uknownError, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@Secured({ "ROLE_ADMIN" })
	@PutMapping("/canteen/update/{id}")
	public ResponseEntity<String> updateCanteenData (@RequestBody CanteenDTO updated, @PathVariable Long id) throws FileNotFoundException, IOException {
		
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		CanteenWithAnImageDTO canteen = canteenService.getCanteenById(id);
		
		if(canteen == null) {
			
			LOG.info("[{}]: Matinimo įstaigos, kurios ID: [{}], - nėra", currentUsername, id);
			
			return new ResponseEntity<String>("Matinimo įstaigos, kurios ID="+id.toString()+", - nėra", HttpStatus.NOT_FOUND);
		}
		else if(canteenService.updateCanteen(updated, id)) {
			
			LOG.info("[{}]: Matinimo įstaigos, kurios ID: [{}] duomenys atnaujinti", currentUsername, id);
			
			return new ResponseEntity<String>("Matinimo įstaigos, kurios ID="+id.toString()+" duomenys atnaujinti", HttpStatus.OK);
		} else {
			
			LOG.info("[{}]: Matinimo įstaigos, kurios ID: [{}] duomenų atnaujinti negalima, nes laukai sutampa", currentUsername, id);
			
			return new ResponseEntity<String>("Matinimo įstaigos, kurios ID="+id.toString()+" duomenų atnaujinti negalima, nes laukai sutampa", HttpStatus.CONFLICT);
		}

	}
	
	@Secured({ "ROLE_ADMIN" })
	@DeleteMapping("/canteen/delete/{id}")
	public ResponseEntity<String> deleteCanteen(@PathVariable(required = true, name = "id") Long id){
		
		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
		
		
		if(canteenService.deleteCanteen(id)) {
			LOG.info("[{}] ištrynė maitinimo įstaigą id: [{}]", currentUsername, id);
			
			return new ResponseEntity<String>("Maitinimo įstaiga id: " + id + " - ištrinta", HttpStatus.OK);
		}
		else {
			LOG.warn("Maitinimo įstaigos [{}] nėra. Ištrynimas neįvyko.", id);
			
			return new ResponseEntity<String>("Maitinimo įstaigos id: "+id+" nėra. Ištrynimas neįvyko.", HttpStatus.NOT_FOUND);
		}
		
	}
	
	@Secured({ "ROLE_USER" })
	@GetMapping("/canteen/name/page/{name}")
	public ResponseEntity<Page<CanteenWithAnImageDTO>> getCanteensPageFilteredByName(@PathVariable String name,
			@RequestParam("page") int page, @RequestParam("size") int size) {

		Sort.Order order = new Sort.Order(Sort.Direction.ASC, "name").ignoreCase();

		Pageable pageable = PageRequest.of(page, size, Sort.by(order));

		return new ResponseEntity<>(canteenService.getCanteensPageFilteredByName(name, pageable),
				HttpStatus.OK);
	}
	
	@Secured({ "ROLE_USER" })
	@GetMapping("/canteen/address/page/{address}")
	public ResponseEntity<Page<CanteenWithAnImageDTO>> getCanteensPageFilteredByAddress(@PathVariable String address,
			@RequestParam("page") int page, @RequestParam("size") int size) {

		Sort.Order order = new Sort.Order(Sort.Direction.ASC, "name").ignoreCase();

		Pageable pageable = PageRequest.of(page, size, Sort.by(order));

		return new ResponseEntity<>(canteenService.getCanteensPageFilteredByAddress(address, pageable),
				HttpStatus.OK);
	}
}
