package ir.ac.sbu.evaluation.bootstrap;

import ir.ac.sbu.evaluation.dto.UserDto;
import ir.ac.sbu.evaluation.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserService userService;

    public DataLoader(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        UserDto user1 = UserDto.builder().username("user1").password("pass1").build();
        UserDto user2 = UserDto.builder().username("user2").password("pass2").build();

        userService.save(user1);
        userService.save(user2);
    }
}
