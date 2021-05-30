package ir.ac.sbu.evaluation.bootstrap;

import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.enumeration.Gender;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.model.university.University;
import ir.ac.sbu.evaluation.model.user.Admin;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.problem.ProblemEventRepository;
import ir.ac.sbu.evaluation.repository.problem.ProblemRepository;
import ir.ac.sbu.evaluation.repository.schedule.MeetScheduleRepository;
import ir.ac.sbu.evaluation.repository.schedule.ScheduleEventRepository;
import ir.ac.sbu.evaluation.repository.university.FacultyRepository;
import ir.ac.sbu.evaluation.repository.university.UniversityRepository;
import ir.ac.sbu.evaluation.repository.user.AdminRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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

    private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm");

    private static List<University> universities;
    private static Map<Long /* university ID */, List<Faculty>> faculties;

    private final UniversityRepository universityRepository;
    private final FacultyRepository facultyRepository;

    private final PersonalInfoRepository personalInfoRepository;
    private final MasterRepository masterRepository;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;

    private final MeetScheduleRepository meetScheduleRepository;
    private final ScheduleEventRepository scheduleEventRepository;

    private final ProblemRepository problemRepository;
    private final ProblemEventRepository problemEventRepository;

    private final PasswordEncoder passwordEncoder;

    public DataLoader(UniversityRepository universityRepository,
            FacultyRepository facultyRepository,
            PersonalInfoRepository personalInfoRepository,
            AdminRepository adminRepository, StudentRepository studentRepository,
            MasterRepository masterRepository,
            MeetScheduleRepository meetScheduleRepository,
            ScheduleEventRepository scheduleEventRepository,
            ProblemRepository problemRepository,
            ProblemEventRepository problemEventRepository,
            PasswordEncoder passwordEncoder) {
        this.universityRepository = universityRepository;
        this.facultyRepository = facultyRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.masterRepository = masterRepository;
        this.meetScheduleRepository = meetScheduleRepository;
        this.scheduleEventRepository = scheduleEventRepository;
        this.problemRepository = problemRepository;
        this.problemEventRepository = problemEventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws ParseException {
        prepareUniversities();

        Problem problem1 = problemRepository.save(Problem.builder()
                .education(Education.BACHELOR)
                .title("سامانه ارزیابی و نظارت یکپارچه")
                .englishTitle("Integrated supervision and evaluation system")
                .keywords(new HashSet<>(Arrays.asList("مجتمع", "ارزیابی", "یکپارچه", "نظارت")))
                .definition(
                        "در رویکرد قدیمی، برای انجام کارهای مربوط به ارائه‌ی پروژه‌ی پایانی، رساله، پروپوزال و انتقال اطلاعات آن، از روش‌های حضوری برای هماهنگی با استادها، مسئولین آموزش و ... استفاده می‌شد. همچنین برای به اشتراک‌گذاری اطلاعات، نتایج تحقیقات و پیشرفت‌ها و ... نیز از سامانه‌های متنوعی مثل ایمیل و موارد مشابه استفاده می‌شد که با توجه به تعداد زیاد دانشجویان و مشغله‌های افراد درگیر در این فرآیند، این پیام‌ها و اطلاعات متمرکز نبودند و دنبال‌کردن تاریخچه یا بررسی آن‌ها بسیار زمان‌بر بود. در سامانه‌های تحت وب، تمامی این کارها می‌توانند با صرفه جویی در زمان و منابع و بدون محدودیت مکانی و با دقت بالاتری به همراه مستند‌شدن ارتباط بین اساتید و دانشجو انجام بپذیرد.")
                .history("بیشینه مسئله")
                .considerations("برای پیاده‌سازی در محیط عملیاتی، نیازمند سرور و تجهیزات شبکه‌ای مربوطه می‌باشد.")
                .state(ProblemState.CREATED)
                .build());
        Problem problem2 = problemRepository.save(Problem.builder()
                .education(Education.BACHELOR)
                .title("سامانه مدیریت خرید و فروش رستوران")
                .englishTitle("Restaurant sales management system")
                .keywords(new HashSet<>(Arrays.asList("رستوران", "فروش", "خرید", "سامانه")))
                .definition(
                        "سامانه‌ جامع و کامل که به منظورت مدیریت خرید و فروش رستوران‌های کل شهرهای کشور استفاده می‌شود.")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .state(ProblemState.CREATED)
                .build());
        Problem problem3 = problemRepository.save(Problem.builder()
                .education(Education.BACHELOR)
                .title("نقشه تعاملی سامانه‌های نرم‌افزاری یک شرکت")
                .englishTitle("Interactive map of a company's software systems")
                .keywords(new HashSet<>(Arrays.asList("شرکت", "تعاملی", "سامانه")))
                .definition("سامانه‌ به منظور نقشه تعاملی سامانه‌های نرم‌افزاری یک شرکت استفاده می‌شود.")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .state(ProblemState.IN_PROGRESS)
                .build());
        Problem problem4 = problemRepository.save(Problem.builder()
                .education(Education.BACHELOR)
                .title("طراحی و پیاده سازی بستر ارسال پیامک انبوه")
                .englishTitle("Design and implementation of bulk SMS platform")
                .keywords(new HashSet<>(Arrays.asList("انبوه", "پیامک کوتاه", "سامانه")))
                .definition("سامانه‌ به منظور این که بتوان در حجم انبوه و زیاد، پیامک‌های موردنیاز را ارسال نمود.")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .state(ProblemState.IN_PROGRESS)
                .build());

        ProblemEvent problemEvent1 = problemEventRepository.save(ProblemEvent.builder()
                .createdBy("امین برجیان")
                .message("پیشنهاد من برای این مسئله این است که تا حد امکان ویژگی‌های خیلی خوب را مستند کنیم.")
                .problem(problem1)
                .build());
        ProblemEvent problemEvent2 = problemEventRepository.save(ProblemEvent.builder()
                .createdBy("صادق علی‌اکبری")
                .message(
                        "من با پیشنهاد شما موافق هستم ولی خیلی می‌تواند بهتر باشد اگر جوانب مختلف این تصمیم را پیش از رفتن به سمت آن بسنجیم تا از درستی آن تا حد خوبی اطمینان پیدا کنیم.")
                .problem(problem1)
                .build());
        problem1.setEvents(new HashSet<>(Arrays.asList(problemEvent1, problemEvent2)));
        problem1 = problemRepository.save(problem1);

        PersonalInfo master1PersonalInfo = personalInfoRepository.save(PersonalInfo.builder()
                .gender(Gender.MALE)
                .telephoneNumber("9131234567")
                .email("sadegh.aliakbari@gmail.com")
                .build());
        PersonalInfo master2PersonalInfo = personalInfoRepository.save(PersonalInfo.builder()
                .gender(Gender.MALE)
                .telephoneNumber("9137654321")
                .email("mojtaba.vahidi@sbu.ac.ir")
                .build());
        PersonalInfo master3PersonalInfo = personalInfoRepository.save(PersonalInfo.builder()
                .gender(Gender.MALE)
                .telephoneNumber("9137654123")
                .email("master3@sbu.ac.ir")
                .build());
        PersonalInfo master4PersonalInfo = personalInfoRepository.save(PersonalInfo.builder()
                .gender(Gender.MALE)
                .telephoneNumber("9137651234")
                .email("master4@sbu.ac.ir")
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
        Master master1 = masterRepository.save(Master.builder()
                .firstName("صادق")
                .lastName("علی اکبری")
                .degree("استاد")
                .username("master")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(master1PersonalInfo)
                .faculty(computerEngineeringFaculty)
                .problemsSupervisor(new HashSet<>(Arrays.asList(problem1, problem2)))
                .problemsReferee(Collections.singleton(problem3))
                .build());

        computerEngineeringFaculty.getMasters().add(master1);
        facultyRepository.save(computerEngineeringFaculty);

        problem1.setSupervisor(master1);
        problem1 = problemRepository.save(problem1);
        problem2.setSupervisor(master1);
        problem2 = problemRepository.save(problem2);
        problem3.getReferees().add(master1);
        problem3 = problemRepository.save(problem3);

        Master master2 = masterRepository.save(Master.builder()
                .firstName("مجتبی")
                .lastName("وحیدی")
                .degree("استاد")
                .username("mojtaba")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(master2PersonalInfo)
                .faculty(computerEngineeringFaculty)
                .problemsSupervisor(new HashSet<>(Arrays.asList(problem3, problem4)))
                .build());

        computerEngineeringFaculty.getMasters().add(master2);
        facultyRepository.save(computerEngineeringFaculty);

        problem3.setSupervisor(master2);
        problem3 = problemRepository.save(problem3);
        problem4.setSupervisor(master2);
        problem4 = problemRepository.save(problem4);

        Master master3 = masterRepository.save(Master.builder()
                .firstName("محمود")
                .lastName("نشاطی")
                .degree("استاد")
                .username("master3")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(master3PersonalInfo)
                .faculty(computerEngineeringFaculty)
                .problemsReferee(new HashSet<>(Arrays.asList(problem3, problem4)))
                .build());

        computerEngineeringFaculty.getMasters().add(master3);
        facultyRepository.save(computerEngineeringFaculty);

        problem3.getReferees().add(master3);
        problem3 = problemRepository.save(problem3);
        problem4.getReferees().add(master3);
        problem4 = problemRepository.save(problem4);

        Master master4 = masterRepository.save(Master.builder()
                .firstName("حسن")
                .lastName("حقیقی")
                .degree("استاد")
                .username("master4")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(master4PersonalInfo)
                .faculty(computerEngineeringFaculty)
                .build());

        computerEngineeringFaculty.getMasters().add(master4);
        facultyRepository.save(computerEngineeringFaculty);

        Student student1 = studentRepository.save(Student.builder()
                .firstName("امین")
                .lastName("برجیان")
                .studentNumber("96243012")
                .username("student")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(studentPersonalInfo)
                .faculty(computerEngineeringFaculty)
                .problems(new HashSet<>(Arrays.asList(problem1, problem2, problem3, problem4)))
                .build());

        computerEngineeringFaculty.getStudents().add(student1);
        facultyRepository.save(computerEngineeringFaculty);

        problem1.setStudent(student1);
        problem1 = problemRepository.save(problem1);
        problem2.setStudent(student1);
        problem2 = problemRepository.save(problem2);
        problem3.setStudent(student1);
        problem3 = problemRepository.save(problem3);
        problem4.setStudent(student1);
        problem4 = problemRepository.save(problem4);

        ScheduleEvent scheduleEvent1 = scheduleEventRepository.save(ScheduleEvent.builder()
                .subject("موضوع 1")
                .startDate(dateFormat.parse("2021-05-30 09:00").toInstant())
                .endDate(dateFormat.parse("2021-05-30 10:00").toInstant())
                .owner(problem3.getReferees().iterator().next())
                .isAllDay(false)
                .build());
        ScheduleEvent scheduleEvent2 = scheduleEventRepository.save(ScheduleEvent.builder()
                .subject("موضوع 2")
                .startDate(dateFormat.parse("2021-05-30 11:00").toInstant())
                .endDate(dateFormat.parse("2021-05-30 12:00").toInstant())
                .owner(problem3.getStudent())
                .isAllDay(false)
                .build());
        ScheduleEvent scheduleEvent3 = scheduleEventRepository.save(ScheduleEvent.builder()
                .subject("موضوع 3")
                .startDate(dateFormat.parse("2021-05-30 07:00").toInstant())
                .endDate(dateFormat.parse("2021-05-30 08:00").toInstant())
                .owner(problem3.getSupervisor())
                .isAllDay(false)
                .build());
        MeetSchedule meetSchedule1 = meetScheduleRepository.save(MeetSchedule.builder()
                .problem(problem3)
                .scheduleEvents(new HashSet<>(Arrays.asList(scheduleEvent1, scheduleEvent2, scheduleEvent3)))
                .build());
        scheduleEvent1.setSchedule(meetSchedule1);
        scheduleEvent1 = scheduleEventRepository.save(scheduleEvent1);
        scheduleEvent2.setSchedule(meetSchedule1);
        scheduleEvent2 = scheduleEventRepository.save(scheduleEvent2);
        scheduleEvent3.setSchedule(meetSchedule1);
        scheduleEvent3 = scheduleEventRepository.save(scheduleEvent3);
        problem3.setSchedule(meetSchedule1);
        problem3 = problemRepository.save(problem3);

        Admin admin1 = adminRepository.save(Admin.builder()
                .firstName("مدیر")
                .lastName("سامانه")
                .username("admin")
                .password(passwordEncoder.encode("pass"))
                .personalInfo(adminPersonalInfo)
                .build());
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
                .webAddress("https://www.sbu.ac.ir/en/web/cse")
                .university(shahidBeheshtiUniversity)
                .build());
        Faculty physicFaculty = facultyRepository.save(Faculty.builder()
                .name("فیزیک")
                .webAddress("https://www.sbu.ac.ir/en/web/physics")
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
