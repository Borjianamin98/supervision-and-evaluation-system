package ir.ac.sbu.evaluation.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("admin").password(getPasswordEncoder().encode("admin")).roles("USER")
                .and()
                .passwordEncoder(getPasswordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers( "/favicon.ico").permitAll()
                .antMatchers("/h2-console/**").permitAll()
                .antMatchers("/**").hasRole("USER")
                .anyRequest().authenticated()
                .and()
                .httpBasic();
        // Disable creation of session cookie in browser
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.cors().disable(); // Allow all Cross-Origin Resource for sharing
        http.csrf().disable(); // Disable Cross-site request forgery
        http.headers().frameOptions().disable(); // Disable X-Frame-Options in response headers
    }
}
