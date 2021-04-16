package ir.ac.sbu.evaluation.bootstrap;

import ir.ac.sbu.evaluation.dto.UserDto;
import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.model.Problem;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.repository.MasterRepository;
import ir.ac.sbu.evaluation.repository.ProblemRepository;
import ir.ac.sbu.evaluation.service.UserService;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserService userService;
    private final MasterRepository masterRepository;
    private final ProblemRepository problemRepository;

    public DataLoader(UserService userService, MasterRepository masterRepository,
            ProblemRepository problemRepository) {
        this.userService = userService;
        this.masterRepository = masterRepository;
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) {
        UserDto user1 = UserDto.builder().username("user1").password("pass1").build();
        UserDto user2 = UserDto.builder().username("user2").password("pass2").build();

        userService.save(user1);
        userService.save(user2);

        Problem problem1 = Problem.builder()
                .education(Education.BACHELOR)
                .title("title1")
                .englishTitle("english title1")
                .keywords(new HashSet<>(Arrays.asList("keyword1", "keyword2")))
                .definition("definition1")
                .history("history1")
                .considerations("consideration1")
                .build();
        Problem savedProblem1 = problemRepository.save(problem1);

        Master master1 = Master.masterBuilder()
                .username("master1")
                .password("pass")
                .build();
        master1.setProblemsSupervisor(Collections.singleton(savedProblem1));
        Master savedMaster1 = masterRepository.save(master1);

        savedProblem1.setSupervisor(savedMaster1);
        problemRepository.save(savedProblem1);
    }
}
