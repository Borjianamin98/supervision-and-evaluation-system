package ir.ac.sbu.evaluation.bootstrap;

import ir.ac.sbu.evaluation.model.User;
import ir.ac.sbu.evaluation.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private UserRepository userRepository;

    public DataLoader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        User user1 = User.builder().username("user1").password("pass1").build();
        User user2 = User.builder().username("user2").password("pass2").build();

        userRepository.save(user1);
        userRepository.save(user2);
    }
}
