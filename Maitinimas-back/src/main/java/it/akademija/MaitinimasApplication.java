package it.akademija;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;



@SpringBootApplication
public class MaitinimasApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(MaitinimasApplication.class, args);
	}
	
	/**
	 * Spring configuration
	 * 	
	 */
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(MaitinimasApplication.class);
	}
	
}
