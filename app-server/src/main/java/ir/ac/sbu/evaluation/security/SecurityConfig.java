package ir.ac.sbu.evaluation.security;

import ir.ac.sbu.evaluation.controller.AuthController;
import ir.ac.sbu.evaluation.controller.problem.ProblemAuthenticatedController;
import ir.ac.sbu.evaluation.controller.university.FacultyController;
import ir.ac.sbu.evaluation.controller.university.UniversityController;
import ir.ac.sbu.evaluation.controller.user.MasterController;
import ir.ac.sbu.evaluation.controller.user.StudentController;
import ir.ac.sbu.evaluation.controller.user.UserController;
import ir.ac.sbu.evaluation.service.user.UserService;
import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(PasswordEncoder passwordEncoder,
            UserService userService,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers(AuthController.permittedPaths()).permitAll()
                .antMatchers(UniversityController.permittedPaths()).permitAll()
                .antMatchers(FacultyController.permittedPaths()).permitAll()

                .antMatchers(UserController.permittedPaths()).permitAll()
                .antMatchers(StudentController.permittedPaths()).permitAll()
                .antMatchers(MasterController.permittedPaths()).permitAll()

                // Permitted paths related to download attachments
                .antMatchers(ProblemAuthenticatedController.permittedPaths()).permitAll()

                .antMatchers("/favicon.ico").permitAll()
                .antMatchers("/actuator/**").permitAll()
                .antMatchers("/h2-console/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint);
        // Disable creation of session cookie in browser
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.cors(); // Allow all Cross-Origin Resource for sharing
        http.csrf().disable(); // Disable Cross-site request forgery
        http.headers().frameOptions().disable(); // Disable X-Frame-Options in response headers

        // Add a filter to validate the JWT tokens with every request.
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
