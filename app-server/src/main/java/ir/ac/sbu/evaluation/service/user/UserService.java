package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.user.UserCheckDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.User;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import ir.ac.sbu.evaluation.repository.user.UserRepository;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.utility.ByteUtility;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthUserDetail loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .map(user -> AuthUserDetail.builder()
                        .userId(user.getId())
                        .fullName(user.getFirstName() + " " + user.getLastName())
                        .username(user.getUsername())
                        .password(user.getPassword())
                        .role(user.getRole())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }

    public UserCheckDto isSignInNameAvailable(String username) {
        return UserCheckDto.builder()
                .username(username)
                .isAvailable(!userRepository.findByUsername(username).isPresent()).build();
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
        return UserDto.from(user, true);
    }

    public Optional<byte[]> getProfilePicture(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (!optionalUser.isPresent()) {
            throw new IllegalArgumentException("Username not found: " + username);
        }
        Byte[] profilePicture = optionalUser.get().getProfilePicture();
        return profilePicture == null ? Optional.empty() : Optional.of(ByteUtility.toPrimitiveBytes(profilePicture));
    }
}
