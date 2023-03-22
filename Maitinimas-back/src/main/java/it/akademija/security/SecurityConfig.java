package it.akademija.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UserDetailsPasswordService;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import it.akademija.user.UserDAO;

@SuppressWarnings("deprecation")
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private static final Logger LOG = LoggerFactory.getLogger(SecurityConfig.class);

	@Autowired
	private SecurityEntryPoint securityEntryPoint;

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private UserDetailsPasswordService userDetailsPasswordService;

	@Autowired
	private UserDAO userDao;

	@Bean
	public PasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {

		auth.userDetailsService(userDetailsService).passwordEncoder(getPasswordEncoder())
				.userDetailsPasswordManager(userDetailsPasswordService);
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().authorizeRequests()

				.antMatchers("/", "/swagger-ui/").permitAll()
				.antMatchers("/createAccount", "/login", "/api/users/createAccount", "/api/verify").permitAll()
                .antMatchers("/api/**").authenticated()
				
				.and().formLogin()

				.successHandler(new AuthenticationSuccessHandler() {

					@Override
					public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
							Authentication authentication) throws IOException, ServletException {

						Authentication user = SecurityContextHolder.getContext().getAuthentication();

						String username = user.getName();
						Object[] roles = user.getAuthorities().toArray();
						String role = roles[0].toString().substring(5);

						LOG.info("Naudotojas [{}] prisijunge prie sistemos", username);

						response.setHeader("Access-Control-Allow-Credentials", "true");
						response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
						response.setHeader("Content-Type", "application/json;charset=UTF-8");
						response.getWriter().print("{\"username\": \"" + username + "\", \"role\":\"" + role + "\"}");
					}
				})

				.failureHandler(new AuthenticationFailureHandler() {

					@Override
					public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
							AuthenticationException exception) throws IOException, ServletException {
						String username = request.getParameter("username");

						LOG.info("Nesėkmingas prisijungimas prie sistemos. Naudotojo vardas: [{}]", username);

						response.sendError(401, "Neteisingas prisijungimo vardas ir/arba slaptažodis");
					}
				}).loginPage("/login").permitAll()

				.and().logout().logoutUrl("/logout")

				.logoutSuccessHandler(new LogoutSuccessHandler() {

					@Override
					public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
							Authentication authentication) throws IOException, ServletException {

						String username = authentication.getName();
						Long userID = userDao.findByUsername(username).getUserId();

						LOG.info("** SecurityConfig: Naudotojas {} ID: {} atsijunge nuo sistemos **", username, userID);

					}
				})

				.clearAuthentication(true).invalidateHttpSession(true).deleteCookies("JSESSIONID").logoutSuccessUrl("/")
				.permitAll()

				.and().csrf().disable()

				.exceptionHandling().authenticationEntryPoint(securityEntryPoint)
				.and()
				.headers().frameOptions().sameOrigin()
				.and()
				.sessionManagement().maximumSessions(1).maxSessionsPreventsLogin(false)
                .expiredUrl("/api/loggedUserName").sessionRegistry(sessionRegistry());

	}

	@Bean
	SessionRegistry sessionRegistry() {
		return new SessionRegistryImpl();
	}

}
