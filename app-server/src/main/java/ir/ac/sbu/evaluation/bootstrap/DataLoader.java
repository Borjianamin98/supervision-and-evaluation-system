package ir.ac.sbu.evaluation.bootstrap;

import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.model.Problem;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.MasterRepository;
import ir.ac.sbu.evaluation.repository.ProblemRepository;
import ir.ac.sbu.evaluation.repository.StudentRepository;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final MasterRepository masterRepository;
    private final ProblemRepository problemRepository;

    private final PasswordEncoder passwordEncoder;

    public DataLoader(StudentRepository studentRepository,
            MasterRepository masterRepository,
            ProblemRepository problemRepository,
            PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.masterRepository = masterRepository;
        this.problemRepository = problemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
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

        Master master1 = Master.builder()
                .username("master1")
                .password(passwordEncoder.encode("pass"))
                .build();
        master1.setProblemsSupervisor(Collections.singleton(savedProblem1));
        Master savedMaster1 = masterRepository.save(master1);

        Student student1 = Student.builder()
                .username("student1")
                .password(passwordEncoder.encode("pass"))
                .build();
        student1.setProblems(Collections.singleton(savedProblem1));
        Student savedStudent1 = studentRepository.save(student1);

        savedProblem1.setSupervisor(savedMaster1);
        savedProblem1.setStudent(savedStudent1);
        problemRepository.save(savedProblem1);
    }
}
