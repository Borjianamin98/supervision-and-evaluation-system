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
                .title("سامانه ارزیابی و نظارت یکپارچه")
                .englishTitle("Integrated supervision and evaluation system")
                .keywords(new HashSet<>(Arrays.asList("مجتمع", "ارزیابی", "یکپارچه", "نظارت")))
                .definition("تعریف سامانه")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .build();
        Problem problem2 = Problem.builder()
                .education(Education.BACHELOR)
                .title("سامانه مدیریت خرید و فروش رستوران")
                .englishTitle("Restaurant sales management system")
                .keywords(new HashSet<>(Arrays.asList("رستوران", "فروش", "خرید", "سامانه")))
                .definition("تعریف سامانه")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .build();
        Problem savedProblem1 = problemRepository.save(problem1);
        Problem savedProblem2 = problemRepository.save(problem2);

        Master master1 = Master.builder()
                .firstName("صادق")
                .lastName("علی اکبری")
                .username("master")
                .password(passwordEncoder.encode("pass"))
                .build();
        master1.setProblemsSupervisor(Collections.singleton(savedProblem1));
        master1.setProblemsSupervisor(Collections.singleton(savedProblem2));
        Master savedMaster1 = masterRepository.save(master1);

        Student student1 = Student.builder()
                .firstName("امین")
                .lastName("برجیان")
                .username("student")
                .password(passwordEncoder.encode("pass"))
                .build();
        student1.setProblems(Collections.singleton(savedProblem1));
        student1.setProblems(Collections.singleton(savedProblem2));
        Student savedStudent1 = studentRepository.save(student1);

        savedProblem1.setSupervisor(savedMaster1);
        savedProblem1.setStudent(savedStudent1);
        problemRepository.save(savedProblem1);

        savedProblem2.setSupervisor(savedMaster1);
        savedProblem2.setStudent(savedStudent1);
        problemRepository.save(savedProblem2);
    }
}
