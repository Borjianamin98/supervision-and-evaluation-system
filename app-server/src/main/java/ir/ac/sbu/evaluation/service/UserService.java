package ir.ac.sbu.evaluation.service;

import ir.ac.sbu.evaluation.dto.UserDto;
import ir.ac.sbu.evaluation.dto.UserListDto;
import ir.ac.sbu.evaluation.model.user.User;
import ir.ac.sbu.evaluation.repository.UserRepository;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.utility.ByteUtility;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
    public AuthUserDetail loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .map(user -> AuthUserDetail.builder()
                        .userId(user.getId())
                        .username(user.getUsername())
                        .password(user.getPassword())
                        .roles(Collections.singletonList(new SimpleGrantedAuthority(user.getRole())))
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }

    @Transactional
    public UserDto save(UserDto userDto) {
        User user = userDto.toUser();
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return UserDto.from(userRepository.save(user));
    }

    @Transactional
    public UserDto setProfilePicture(String username, byte[] rawPictureBytes) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (!optionalUser.isPresent()) {
            throw new IllegalArgumentException("Username not found: " + username);
        }
        User user = optionalUser.get();
        user.setProfilePicture(ByteUtility.toWrapperBytes(rawPictureBytes));
        userRepository.save(user);
        return UserDto.from(user);
    }

    public Optional<byte[]> getProfilePicture(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (!optionalUser.isPresent()) {
            throw new IllegalArgumentException("Username not found: " + username);
        }
        Byte[] profilePicture = optionalUser.get().getProfilePicture();
        return profilePicture == null ? Optional.empty() : Optional.of(ByteUtility.toPrimitiveBytes(profilePicture));
    }

    public UserListDto getAllUsers() {
        return new UserListDto(userRepository.findAll().stream().map(UserDto::from).collect(Collectors.toList()));
    }
}
