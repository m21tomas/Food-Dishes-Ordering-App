package it.akademija.canteen;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


@Service
public class CanteenService {

	@Autowired
	private CanteenDAO canteenDao;
	
	@Transactional(readOnly = true)
	public CanteenWithAnImageDTO getCanteenById(Long id) throws FileNotFoundException, IOException {
		
		Canteen obj = canteenDao.findByCanteenCode(id);  // .findById(id).orElse(null);
		
		
		if(obj != null) {

			CanteenWithAnImageDTO canteen = new CanteenWithAnImageDTO();
			
			canteen.setId(obj.getCode());
			canteen.setName(obj.getName());
			canteen.setAddress(obj.getAddress());
			String imageName = obj.getImagename();
			
			if(obj.getImagename() != null){ //if(!imageName.isEmpty() || !imageName.isBlank()) {

				InputStream inputStream = new FileInputStream("canteen-images/" + imageName);
				
//				Path path = Paths.get("G:\\Java_programavimas\\Mokyklos-projektas\\Project\\Maitinimas-back\\canteen-images\\"
//			              +imageName);
//	            InputStream inputStream = new FileInputStream(path.toString());
				
				byte[] imageBytes = StreamUtils.copyToByteArray(inputStream);
				
				canteen.setImage(imageBytes);
				
				inputStream.close();
			}
			
			/*
			List<Menu> newMenu = new ArrayList<Menu>();
			for(Menu item: obj.getMenus()) {
				
				//yourList.stream().sorted(Comparator.comparing(YourClass:getId)).collect(Collectors.toList())
				List<Dish> sortedDishes =  item.getDishes().stream().sorted(Comparator.comparing(Dish::getId).reversed()).collect(Collectors.toList());
				for(Dish dish : sortedDishes) {
					System.out.println("List - " + dish.getId());
				}
				item.setDishes(sortedDishes);
				newMenu.add(item);
			}
			*/
			canteen.setMenus(obj.getMenus());
			//canteen.setMenus(newMenu);
			
			return canteen;	
		}
		else return null;
	}
	
	@Transactional(readOnly = true)
	public boolean existsById(Long id, String name) {
		
		Canteen canteen = canteenDao.findByCanteenCode(id);
		Canteen canteen_2 = canteenDao.findByName(name);
		
		if(canteen == null && canteen_2 == null) {
			return false;
		}
		else {
			return true;
		}
	}
	
	@Transactional
	public boolean createNewCanteenAndSaveImage(MultipartFile file, CanteenDTO data) throws IOException {
		Canteen savedEntity = null;
		Long numberOfSavedBytes = 0L;
		
		Canteen newEntity = new Canteen();
		
		newEntity.setCode(data.getId());
		newEntity.setName(data.getName());
		newEntity.setAddress(data.getAddress());
		
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        newEntity.setImagename(fileName);
        
        String uploadDir = "canteen-images/";
		
        Path uploadPath = Paths.get(uploadDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
         
//        try (InputStream inputStream = file.getInputStream()) {
//            Path filePath = uploadPath.resolve(fileName);
//            String fileType = file.getContentType();
//            System.out.println("File type: " + fileType);
//            numberOfSavedBytes = Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
//            inputStream.close();
//        } catch (IOException ioe) {        
//            throw new IOException("Could not save image file: " + fileName, ioe);
//        }      
        
        InputStream inputStream = file.getInputStream();
        try {
        	Path filePath = uploadPath.resolve(fileName);
        	String fileType = file.getContentType();
        	System.out.println("File type: " + fileType);
        	numberOfSavedBytes = Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);	    
        } catch (IOException ioe) {        
        	throw new IOException("Could not save image file: " + fileName, ioe);
        } 
        
        inputStream.close();
        
//        Path filePath = Paths.get(uploadDir).resolve(fileName);
//        System.out.println("DELETING RIGHT AFTER CREATION "+filePath);
//		Files.delete(filePath);
        
		savedEntity = canteenDao.saveAndFlush(newEntity);
		
		if(savedEntity != null && numberOfSavedBytes != 0) return true;
		
		return false;
	}
	
	@Transactional
	public boolean createNewCanteen(CanteenDTO data) {
		
		Canteen newEntity = new Canteen();
		
		newEntity.setCode(data.getId());
		newEntity.setName(data.getName());
		newEntity.setAddress(data.getAddress());
		
		Canteen savedEntity = canteenDao.saveAndFlush(newEntity);
		
		if(savedEntity != null) {
			return true;
		}
		return false;
	}
	
	@Transactional
	public Boolean updateCanteen(CanteenDTO data, Long id) {
		
		System.out.println("Received for update object: ID: "+data.getId()+", Name: "+data.getName()+", Address: "+data.getAddress());
		
		boolean alreadyExists = existsById(data.getId(), data.getName());
		
		Canteen existingCanteen = canteenDao.findByCanteenCode(id);
		
		if(existingCanteen != null && !alreadyExists) {
			Long startingId = existingCanteen.getCode();
			String startingName = existingCanteen.getName();
			String startingAddress = existingCanteen.getAddress();
			
			System.out.println("Prior changing database entity data: ID: "+existingCanteen.getCode()+", Name: "+existingCanteen.getName()+", Address: "+existingCanteen.getAddress());
			
			Canteen newCanteen = existingCanteen;
			
			if(data.getId() != null) newCanteen.setCode(data.getId());
			
			if(data.getName() != null) newCanteen.setName(data.getName());
			
			if(data.getAddress() != null) newCanteen.setAddress(data.getAddress());
			
			Canteen savedEntity = canteenDao.save(newCanteen);
			
			System.out.println("Changed Entity from the database: ID: "+savedEntity.getCode()+", Name: "+savedEntity.getName()+", Address: "+savedEntity.getAddress());
			
			System.out.println(String.valueOf(startingId)+' '+String.valueOf(savedEntity.getCode())+' '+ String.valueOf(startingId.equals(savedEntity.getCode())));
			System.out.println(startingName+' '+savedEntity.getName()+' '+ String.valueOf(startingName.equals(savedEntity.getName())));
			System.out.println(startingAddress+' '+savedEntity.getAddress()+' '+ String.valueOf(startingAddress.equals(savedEntity.getAddress())));
			
			if(startingId.equals(savedEntity.getCode()) &&
			   startingName.equals(savedEntity.getName()) &&
			   startingAddress.equals(savedEntity.getAddress()) || alreadyExists
			  ) {
				return false;
			}else {
				return true;
			}
		} 
		return false;
	}
	
	@Transactional
	public Boolean updateCanteenImage(MultipartFile file, Long id) throws IOException {
		
		Canteen existingCanteen = canteenDao.findByCanteenCode(id);
		
		if(existingCanteen != null) {
			
			String uploadDir = "canteen-images/";
            if(existingCanteen.getImagename() != null) {
				
		        Path filePath = Paths.get(uploadDir).resolve(existingCanteen.getImagename());
		        
		        try {
		        	System.out.println("DELETING "+filePath);
					Files.delete(filePath);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			Canteen newCanteen = existingCanteen;
			Long numberOfSavedBytes = 0L;
			Canteen savedEntity = null;
			
			String fileName = StringUtils.cleanPath(file.getOriginalFilename());
			newCanteen.setImagename(fileName);
	        
	        
			
	        Path uploadPath = Paths.get(uploadDir);
	        
	        if (!Files.exists(uploadPath)) {
	            Files.createDirectories(uploadPath);
	        }
	        
	        
			
	        InputStream inputStream = file.getInputStream();
	        try {
	        	Path filePath = uploadPath.resolve(fileName);
	        	String fileType = file.getContentType();
	        	System.out.println("File type: " + fileType);
	        	numberOfSavedBytes = Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);	    
	        } catch (IOException ioe) {        
	        	throw new IOException("Could not save image file: " + fileName, ioe);
	        } 
	        
	        inputStream.close();
	        
	        savedEntity = canteenDao.saveAndFlush(newCanteen);
			
			if(savedEntity != null && numberOfSavedBytes != 0) return true;
			
			return false;
		}
		
		return false;
	}
	
	@Transactional(readOnly = true)
	public List<CanteenWithAnImageDTO> getAllCanteens() throws FileNotFoundException, IOException {
		
		List<Canteen> canteens = canteenDao.findAll()
                                           .stream()
                                           .sorted(Comparator.comparing(Canteen::getCode))
                                           .collect(Collectors.toList()) ;

		List<CanteenWithAnImageDTO> theList = new ArrayList<CanteenWithAnImageDTO>();
		
		for(Canteen item : canteens) {
		
			CanteenWithAnImageDTO newItem = new CanteenWithAnImageDTO();
		
		    newItem.setId(item.getCode());
		
		    newItem.setName(item.getName());
		    
		    newItem.setAddress(item.getAddress());
		
			String imageName = item.getImagename();
			
			//if(!imageName.isEmpty() || !imageName.isBlank()) {
			if(imageName != null) {
				
				// G:\Java_programavimas\Mokyklos-projektas\Project\Maitinimas-back\canteen-images
				
//				Path path = Paths.get("G:\\Java_programavimas\\Mokyklos-projektas\\Project\\Maitinimas-back\\canteen-images\\"
//						              +imageName);
//				InputStream inputStream = new FileInputStream(path.toString());

				InputStream inputStream = new FileInputStream("canteen-images/" + imageName);
				
				byte[] imageBytes = StreamUtils.copyToByteArray(inputStream);
				
				newItem.setImage(imageBytes);
				
				inputStream.close();
			}
			
			
			newItem.setMenus(item.getMenus());

			theList.add(newItem);
		}
				
		return theList;
	}

	public CanteenDAO getCanteenDao() {
		return canteenDao;
	}

	public void setCanteenDao(CanteenDAO canteenDao) {
		this.canteenDao = canteenDao;
	}

	@Transactional(readOnly = true)
	public Page<CanteenWithAnImageDTO> getAPageOfAllCanteens(Pageable pageable){
		Page<Canteen> canteens = canteenDao.findAll(pageable);
		Page<CanteenWithAnImageDTO> dtoPage = canteens.map(new Function<Canteen, CanteenWithAnImageDTO>() {

			@Override
			public CanteenWithAnImageDTO apply(Canteen t) {
				CanteenWithAnImageDTO dto = new CanteenWithAnImageDTO();
				
				dto.setId(t.getCode());
				dto.setName(t.getName());
				dto.setAddress(t.getAddress());
				dto.setMenus(t.getMenus());
				
				/*System.out.print("Taking "+ t.getCode() +" menu arraylist: "); //+ t.getMenus().toString());
				for(Menu item : t.getMenus()) {
					System.out.print("menu id: " + item.getId() + ", menu name: " + item.getName());
				}
				System.out.println();*/
				
				InputStream inputStream = null;
				if(t.getImagename() != null) { //if(!imageName.isEmpty() || !imageName.isBlank()) {
					String imageName = t.getImagename();
					
					//InputStream inputStream = null;
					try {
						inputStream = new FileInputStream("canteen-images/" + imageName);
						
//						Path path = Paths.get("G:\\Java_programavimas\\Mokyklos-projektas\\Project\\Maitinimas-back\\canteen-images\\"
//					              +imageName);
//			            inputStream = new FileInputStream(path.toString());
					} catch (FileNotFoundException e) {
						e.printStackTrace();
					}
					
					byte[] imageBytes = null;
					
					try {
						imageBytes = StreamUtils.copyToByteArray(inputStream);
						//inputStream.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
					
					dto.setImage(imageBytes);
				}
				else {
					dto.setImage(null);
				}
				
				try {
					if(inputStream != null) {
	                   inputStream.close();
	                }
				} catch (IOException e) {
					e.printStackTrace();
				}
				
//				System.out.print("CanteenWithAnImageDTO:\n" + 
//				"id: " + dto.getId() + ", name: " + dto.getName() + ", address: " + dto.getAddress() + ", menu: ");
//				for(Menu item : dto.getMenus()) {
//					System.out.print("menu id: " + item.getId() + ", menu name: " + item.getName());
//				}
//				System.out.print(", menu size: " + dto.getMenus().size());
//				System.out.println();
				return dto;
			}		
		});
		return dtoPage;	
	}

	@Transactional
	public boolean deleteCanteen(Long id) {
		
		Canteen canteen = canteenDao.findByCanteenCode(id);
		
		if(canteen != null) {
			
			if(canteen.getImagename() != null) {
				String uploadDir = "canteen-images/";
				
		        Path filePath = Paths.get(uploadDir).resolve(canteen.getImagename());
		        
		        try {
		        	System.out.println("DELETING "+filePath);
					Files.delete(filePath);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			canteenDao.delete(canteen);
			
			return true;
		}
		
		return false;
	}
	
	@Transactional(readOnly = true)
	public Page<CanteenWithAnImageDTO> getCanteensPageFilteredByName(String name, Pageable pageable) {

		Page<Canteen> canteens = canteenDao.findByNameContainingIgnoreCase(name, pageable);
		
		Page<CanteenWithAnImageDTO> dtoPage = canteens.map(new Function<Canteen, CanteenWithAnImageDTO>() {

			@Override
			public CanteenWithAnImageDTO apply(Canteen t) {
				CanteenWithAnImageDTO dto = new CanteenWithAnImageDTO();
				
				dto.setId(t.getCode());
				dto.setName(t.getName());
				dto.setAddress(t.getAddress());
				dto.setMenus(t.getMenus());
				
				InputStream inputStream = null;
				if(t.getImagename() != null) { 
					String imageName = t.getImagename();
					
					try {
						inputStream = new FileInputStream("canteen-images/" + imageName);
					} catch (FileNotFoundException e) {
						e.printStackTrace();
					}
					
					byte[] imageBytes = null;
					
					try {
						imageBytes = StreamUtils.copyToByteArray(inputStream);
					} catch (IOException e) {
						e.printStackTrace();
					}
					
					dto.setImage(imageBytes);
				}
				else {
					dto.setImage(null);
				}
				
				try {
					if(inputStream != null) {
	                   inputStream.close();
	                }
				} catch (IOException e) {
					e.printStackTrace();
				}
				
				return dto;
			}		
		});
		return dtoPage;
	}
	
	@Transactional(readOnly = true)
	public Page<CanteenWithAnImageDTO> getCanteensPageFilteredByAddress(String address, Pageable pageable) {

		Page<Canteen> canteens = canteenDao.findByAddressContainingIgnoreCase(address, pageable);
		
		Page<CanteenWithAnImageDTO> dtoPage = canteens.map(new Function<Canteen, CanteenWithAnImageDTO>() {

			@Override
			public CanteenWithAnImageDTO apply(Canteen t) {
				CanteenWithAnImageDTO dto = new CanteenWithAnImageDTO();
				
				dto.setId(t.getCode());
				dto.setName(t.getName());
				dto.setAddress(t.getAddress());
				dto.setMenus(t.getMenus());
				
				InputStream inputStream = null;
				if(t.getImagename() != null) { 
					String imageName = t.getImagename();
					
					try {
						inputStream = new FileInputStream("canteen-images/" + imageName);
					} catch (FileNotFoundException e) {
						e.printStackTrace();
					}
					
					byte[] imageBytes = null;
					
					try {
						imageBytes = StreamUtils.copyToByteArray(inputStream);
					} catch (IOException e) {
						e.printStackTrace();
					}
					
					dto.setImage(imageBytes);
				}
				else {
					dto.setImage(null);
				}
				
				try {
					if(inputStream != null) {
	                   inputStream.close();
	                }
				} catch (IOException e) {
					e.printStackTrace();
				}
				
				return dto;
			}		
		});
		return dtoPage;
	}
	
}
