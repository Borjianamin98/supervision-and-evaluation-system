package ir.ac.sbu.evaluation.service;

import ir.ac.sbu.evaluation.dto.UserDto;
import ir.ac.sbu.evaluation.dto.UserListDto;
import ir.ac.sbu.evaluation.model.User;
import ir.ac.sbu.evaluation.repository.UserRepository;
import java.util.stream.Collectors;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .roles("USER")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }

    @Transactional(readOnly = true)
    public UserDto save(UserDto userDto) {
        User user = userDto.toUser();
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return UserDto.from(userRepository.save(user));
    }

    public UserListDto getAllUsers() {
        return new UserListDto(userRepository.findAll().stream().map(UserDto::from).collect(Collectors.toList()));
    }
}
