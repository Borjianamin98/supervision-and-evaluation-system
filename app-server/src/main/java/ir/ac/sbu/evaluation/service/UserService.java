package ir.ac.sbu.evaluation.service;

import ir.ac.sbu.evaluation.dto.UserDto;
import ir.ac.sbu.evaluation.dto.UserListDto;
import ir.ac.sbu.evaluation.repository.UserRepository;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserListDto getAllUsers() {
        return new UserListDto(userRepository.findAll().stream().map(UserDto::from).collect(Collectors.toList()));
    }
}
