package ir.ac.sbu.evaluation.bootstrap;

import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.Problem;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.model.university.University;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.FacultyRepository;
import ir.ac.sbu.evaluation.repository.MasterRepository;
import ir.ac.sbu.evaluation.repository.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.ProblemRepository;
import ir.ac.sbu.evaluation.repository.StudentRepository;
import ir.ac.sbu.evaluation.repository.UniversityRepository;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UniversityRepository universityRepository;
    private final FacultyRepository facultyRepository;

    private final PersonalInfoRepository personalInfoRepository;
    private final StudentRepository studentRepository;
    private final MasterRepository masterRepository;
    private final ProblemRepository problemRepository;

    private final PasswordEncoder passwordEncoder;

    public DataLoader(UniversityRepository universityRepository,
            FacultyRepository facultyRepository,
            PersonalInfoRepository personalInfoRepository,
            StudentRepository studentRepository, MasterRepository masterRepository,
            ProblemRepository problemRepository,
            PasswordEncoder passwordEncoder) {
        this.universityRepository = universityRepository;
        this.facultyRepository = facultyRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.studentRepository = studentRepository;
        this.masterRepository = masterRepository;
        this.problemRepository = problemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        University savedUniversity1 = universityRepository.save(University.builder()
                .name("دانشگاه شهیدبهشتی")
                .location("تهران").webAddress("https://www.sbu.ac.ir/")
                .build());
        Faculty savedFaculty1 = facultyRepository.save(Faculty.builder()
                .name("دانشکده‌ مهندسی کامپیوتر")
                .location("بخش شمالی دانشگاه")
                .university(savedUniversity1)
                .build());
        Faculty savedFaculty2 = facultyRepository.save(Faculty.builder()
                .name("دانشکده‌ فیزیک")
                .location("بخش شرقی دانشگاه")
                .university(savedUniversity1)
                .build());
        savedUniversity1.getFaculties().add(savedFaculty1);
        savedUniversity1.getFaculties().add(savedFaculty2);
        universityRepository.save(savedUniversity1);

        Problem problem1 = Problem.builder()
                .education(Education.BACHELOR)
                .title("سامانه ارزیابی و نظارت یکپارچه")
                .englishTitle("Integrated supervision and evaluation system")
                .keywords(new HashSet<>(Arrays.asList("مجتمع", "ارزیابی", "یکپارچه", "نظارت")))
                .definition(
                        "در رویکرد قدیمی، برای انجام کارهای مربوط به ارائه‌ی پروژه‌ی پایانی، رساله، پروپوزال و انتقال اطلاعات آن، از روش‌های حضوری برای هماهنگی با استادها، مسئولین آموزش و ... استفاده می‌شد. همچنین برای به اشتراک‌گذاری اطلاعات، نتایج تحقیقات و پیشرفت‌ها و ... نیز از سامانه‌های متنوعی مثل ایمیل و موارد مشابه استفاده می‌شد که با توجه به تعداد زیاد دانشجویان و مشغله‌های افراد درگیر در این فرآیند، این پیام‌ها و اطلاعات متمرکز نبودند و دنبال‌کردن تاریخچه یا بررسی آن‌ها بسیار زمان‌بر بود. در سامانه‌های تحت وب، تمامی این کارها می‌توانند با صرفه جویی در زمان و منابع و بدون محدودیت مکانی و با دقت بالاتری به همراه مستند‌شدن ارتباط بین اساتید و دانشجو انجام بپذیرد. این سامانه با ایجاد محیطی کاربرپسند، ارتباط بین دانشجو و اساتید را بهبود می‌بخشد و دسترسی و رسیدگی‌های مربوط به فرآیند پروژه‌ها را تسریع می‌بخشد. همچنین این سامانه به اساتید و سامانه آموزشی نیز برای کم‌شدن میزان ملاقات‌ها، هماهنگی بهتر در فرایند تقسیم و تعیین زمان ارائه و ... نیز کمک می‌کند.")
                .history("بیشینه مسئله")
                .considerations("برای پیاده‌سازی در محیط عملیاتی، نیازمند سرور و تجهیزات شبکه‌ای مربوطه می‌باشد.")
                .state(ProblemState.CREATED)
                .build();
        Problem problem2 = Problem.builder()
                .education(Education.BACHELOR)
                .title("سامانه مدیریت خرید و فروش رستوران")
                .englishTitle("Restaurant sales management system")
                .keywords(new HashSet<>(Arrays.asList("رستوران", "فروش", "خرید", "سامانه")))
                .definition("تعریف سامانه")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .state(ProblemState.CREATED)
                .build();
        Problem savedProblem1 = problemRepository.save(problem1);
        Problem savedProblem2 = problemRepository.save(problem2);

        PersonalInfo personalInfo1 = personalInfoRepository.save(PersonalInfo.builder()
                .telephoneNumber("09131234567")
                .email("sample@gmail.com")
                .build());
        PersonalInfo personalInfo2 = personalInfoRepository.save(PersonalInfo.builder()
                .telephoneNumber("09137654321")
                .email("sample1@gmail.com")
                .build());

        Master master1 = Master.builder()
                .firstName("صادق")
                .lastName("علی اکبری")
                .username("master")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(personalInfo1)
                .build();
        master1.setProblemsSupervisor(Collections.singleton(savedProblem1));
        master1.setProblemsSupervisor(Collections.singleton(savedProblem2));
        Master savedMaster1 = masterRepository.save(master1);

        Student student1 = Student.builder()
                .firstName("امین")
                .lastName("برجیان")
                .username("student")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(personalInfo2)
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
