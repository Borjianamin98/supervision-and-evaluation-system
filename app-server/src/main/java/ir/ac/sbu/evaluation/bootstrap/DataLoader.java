package ir.ac.sbu.evaluation.bootstrap;

import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.enumeration.Gender;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.Problem;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.model.university.University;
import ir.ac.sbu.evaluation.model.user.Admin;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.ProblemRepository;
import ir.ac.sbu.evaluation.repository.university.FacultyRepository;
import ir.ac.sbu.evaluation.repository.university.UniversityRepository;
import ir.ac.sbu.evaluation.repository.user.AdminRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private static List<University> universities;
    private static Map<Long /* university ID */, List<Faculty>> faculties;

    private final UniversityRepository universityRepository;
    private final FacultyRepository facultyRepository;

    private final PersonalInfoRepository personalInfoRepository;
    private final MasterRepository masterRepository;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final ProblemRepository problemRepository;

    private final PasswordEncoder passwordEncoder;

    public DataLoader(UniversityRepository universityRepository,
            FacultyRepository facultyRepository,
            PersonalInfoRepository personalInfoRepository,
            AdminRepository adminRepository, StudentRepository studentRepository,
            MasterRepository masterRepository,
            ProblemRepository problemRepository,
            PasswordEncoder passwordEncoder) {
        this.universityRepository = universityRepository;
        this.facultyRepository = facultyRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.masterRepository = masterRepository;
        this.problemRepository = problemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        prepareUniversities();

        Problem problem1 = Problem.builder()
                .education(Education.BACHELOR)
                .title("سامانه ارزیابی و نظارت یکپارچه")
                .englishTitle("Integrated supervision and evaluation system")
                .keywords(new HashSet<>(Arrays.asList("مجتمع", "ارزیابی", "یکپارچه", "نظارت")))
                .definition(
                        "در رویکرد قدیمی، برای انجام کارهای مربوط به ارائه‌ی پروژه‌ی پایانی، رساله، پروپوزال و انتقال اطلاعات آن، از روش‌های حضوری برای هماهنگی با استادها، مسئولین آموزش و ... استفاده می‌شد. همچنین برای به اشتراک‌گذاری اطلاعات، نتایج تحقیقات و پیشرفت‌ها و ... نیز از سامانه‌های متنوعی مثل ایمیل و موارد مشابه استفاده می‌شد که با توجه به تعداد زیاد دانشجویان و مشغله‌های افراد درگیر در این فرآیند، این پیام‌ها و اطلاعات متمرکز نبودند و دنبال‌کردن تاریخچه یا بررسی آن‌ها بسیار زمان‌بر بود. در سامانه‌های تحت وب، تمامی این کارها می‌توانند با صرفه جویی در زمان و منابع و بدون محدودیت مکانی و با دقت بالاتری به همراه مستند‌شدن ارتباط بین اساتید و دانشجو انجام بپذیرد.")
                .history("بیشینه مسئله")
                .considerations("برای پیاده‌سازی در محیط عملیاتی، نیازمند سرور و تجهیزات شبکه‌ای مربوطه می‌باشد.")
                .state(ProblemState.CREATED)
                .build();
        Problem problem2 = Problem.builder()
                .education(Education.BACHELOR)
                .title("سامانه مدیریت خرید و فروش رستوران")
                .englishTitle("Restaurant sales management system")
                .keywords(new HashSet<>(Arrays.asList("رستوران", "فروش", "خرید", "سامانه")))
                .definition("سامانه‌ جامع و کامل که به منظورت مدیریت خرید و فروش رستوران‌های کل شهرهای کشور استفاده می‌شود.")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .state(ProblemState.CREATED)
                .build();
        Problem savedProblem1 = problemRepository.save(problem1);
        Problem savedProblem2 = problemRepository.save(problem2);

        PersonalInfo masterPersonalInfo = personalInfoRepository.save(PersonalInfo.builder()
                .gender(Gender.MALE)
                .telephoneNumber("9131234567")
                .email("sadeg.aliakbari@gmail.com")
                .build());
        PersonalInfo studentPersonalInfo = personalInfoRepository.save(PersonalInfo.builder()
                .gender(Gender.MALE)
                .telephoneNumber("9137654321")
                .email("student@gmail.com")
                .build());
        PersonalInfo adminPersonalInfo = personalInfoRepository.save(PersonalInfo.builder()
                .gender(Gender.MALE)
                .telephoneNumber("9137654321")
                .email("admin@gmail.com")
                .build());

        Faculty computerEngineeringFaculty = faculties.get(universities.get(0).getId()).get(0);
        Master master1 = Master.builder()
                .firstName("صادق")
                .lastName("علی اکبری")
                .degree("استاد")
                .username("master")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(masterPersonalInfo)
                .faculty(computerEngineeringFaculty)
                .build();
        master1.setProblemsSupervisor(Collections.singleton(savedProblem1));
        master1.setProblemsSupervisor(Collections.singleton(savedProblem2));
        Master savedMaster1 = masterRepository.save(master1);

        computerEngineeringFaculty.getMasters().add(master1);
        facultyRepository.save(computerEngineeringFaculty);

        Student student1 = Student.builder()
                .firstName("امین")
                .lastName("برجیان")
                .studentNumber("96243012")
                .username("student")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(studentPersonalInfo)
                .faculty(computerEngineeringFaculty)
                .build();
        student1.setProblems(Collections.singleton(savedProblem1));
        student1.setProblems(Collections.singleton(savedProblem2));
        Student savedStudent1 = studentRepository.save(student1);

        computerEngineeringFaculty.getStudents().add(student1);
        facultyRepository.save(computerEngineeringFaculty);

        savedProblem1.setSupervisor(savedMaster1);
        savedProblem1.setStudent(savedStudent1);
        problemRepository.save(savedProblem1);

        savedProblem2.setSupervisor(savedMaster1);
        savedProblem2.setStudent(savedStudent1);
        problemRepository.save(savedProblem2);

        Admin admin1 = Admin.builder()
                .firstName("مدیر")
                .lastName("سامانه")
                .username("admin")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(adminPersonalInfo)
                .build();
        Admin savedAdmin1 = adminRepository.save(admin1);
    }

    private void prepareUniversities() {
        universities = new ArrayList<>();
        faculties = new HashMap<>();

        University shahidBeheshtiUniversity = universityRepository.save(University.builder()
                .name("شهیدبهشتی")
                .location("تهران").webAddress("https://www.sbu.ac.ir/")
                .build());
        Faculty computerEngineeringFaculty = facultyRepository.save(Faculty.builder()
                .name("مهندسی کامپیوتر")
                .university(shahidBeheshtiUniversity)
                .build());
        Faculty physicFaculty = facultyRepository.save(Faculty.builder()
                .name("فیزیک")
                .university(shahidBeheshtiUniversity)
                .build());
        shahidBeheshtiUniversity.getFaculties().add(computerEngineeringFaculty);
        shahidBeheshtiUniversity.getFaculties().add(physicFaculty);
        universityRepository.save(shahidBeheshtiUniversity);
        universities.add(shahidBeheshtiUniversity);
        faculties.put(shahidBeheshtiUniversity.getId(), new ArrayList<>());
        faculties.get(shahidBeheshtiUniversity.getId()).add(computerEngineeringFaculty);
        faculties.get(shahidBeheshtiUniversity.getId()).add(physicFaculty);

        University tehranUniversity = universityRepository.save(University.builder()
                .name("تهران")
                .location("تهران").webAddress("https://ut.ac.ir/fa")
                .build());
        computerEngineeringFaculty = facultyRepository.save(Faculty.builder()
                .name("مهندسی کامپیوتر")
                .university(tehranUniversity)
                .build());
        Faculty mathematicsFaculty = facultyRepository.save(Faculty.builder()
                .name("ریاضی")
                .university(tehranUniversity)
                .build());
        tehranUniversity.getFaculties().add(computerEngineeringFaculty);
        tehranUniversity.getFaculties().add(mathematicsFaculty);
        universityRepository.save(tehranUniversity);
        universities.add(tehranUniversity);
        faculties.put(tehranUniversity.getId(), new ArrayList<>());
        faculties.get(tehranUniversity.getId()).add(computerEngineeringFaculty);
        faculties.get(tehranUniversity.getId()).add(mathematicsFaculty);

        University amirKabirUniversity = universityRepository.save(University.builder()
                .name("امیرکبیر")
                .location("تهران").webAddress("https://aut.ac.ir/")
                .build());
        Faculty literatureFaculty = facultyRepository.save(Faculty.builder()
                .name("ادبیات")
                .university(amirKabirUniversity)
                .build());
        amirKabirUniversity.getFaculties().add(literatureFaculty);
        universityRepository.save(amirKabirUniversity);
        universities.add(amirKabirUniversity);
        faculties.put(amirKabirUniversity.getId(), Collections.singletonList(literatureFaculty));

        University sharifUniversity = universityRepository.save(University.builder()
                .name("صنعتی شریف")
                .location("تهران").webAddress("http://www.sharif.ir/")
                .build());
        literatureFaculty = facultyRepository.save(Faculty.builder()
                .name("ادبیات")
                .university(sharifUniversity)
                .build());
        sharifUniversity.getFaculties().add(literatureFaculty);
        universityRepository.save(sharifUniversity);
        universities.add(sharifUniversity);
        faculties.put(sharifUniversity.getId(), Collections.singletonList(literatureFaculty));

        University iustUniversity = universityRepository.save(University.builder()
                .name("علم و صنعت ایران")
                .location("تهران").webAddress("http://iust.ac.ir")
                .build());
        Faculty chemistryFaculty = facultyRepository.save(Faculty.builder()
                .name("شیمی")
                .university(iustUniversity)
                .build());
        iustUniversity.getFaculties().add(chemistryFaculty);
        universityRepository.save(iustUniversity);
        universities.add(iustUniversity);
        faculties.put(iustUniversity.getId(), Collections.singletonList(chemistryFaculty));

        University atuUniversity = universityRepository.save(University.builder()
                .name("علامه طباطبایی")
                .location("تهران").webAddress("http://atu.ac.ir")
                .build());
        chemistryFaculty = facultyRepository.save(Faculty.builder()
                .name("شیمی")
                .university(atuUniversity)
                .build());
        atuUniversity.getFaculties().add(chemistryFaculty);
        universityRepository.save(atuUniversity);
        universities.add(atuUniversity);
        faculties.put(atuUniversity.getId(), Collections.singletonList(chemistryFaculty));
    }
}
