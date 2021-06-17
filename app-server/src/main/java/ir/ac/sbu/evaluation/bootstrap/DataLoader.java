package ir.ac.sbu.evaluation.bootstrap;

import ir.ac.sbu.evaluation.dto.problem.event.ProblemEventSaveDto;
import ir.ac.sbu.evaluation.dto.schedule.event.DateRangeDto;
import ir.ac.sbu.evaluation.dto.schedule.event.ScheduleEventDto;
import ir.ac.sbu.evaluation.dto.university.UniversityDto;
import ir.ac.sbu.evaluation.dto.university.UniversitySaveDto;
import ir.ac.sbu.evaluation.dto.university.faculty.FacultyDto;
import ir.ac.sbu.evaluation.dto.university.faculty.FacultySaveDto;
import ir.ac.sbu.evaluation.dto.user.PersonalInfoSaveDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.dto.user.admin.AdminDto;
import ir.ac.sbu.evaluation.dto.user.admin.AdminSaveDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterSaveDto;
import ir.ac.sbu.evaluation.dto.user.student.StudentDto;
import ir.ac.sbu.evaluation.dto.user.student.StudentSaveDto;
import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.enumeration.Gender;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemState;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.schedule.ScheduleState;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.problem.ProblemRepository;
import ir.ac.sbu.evaluation.repository.schedule.MeetScheduleRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.problem.ProblemService;
import ir.ac.sbu.evaluation.service.schedule.ScheduleService;
import ir.ac.sbu.evaluation.service.university.FacultyService;
import ir.ac.sbu.evaluation.service.university.UniversityService;
import ir.ac.sbu.evaluation.service.user.AdminService;
import ir.ac.sbu.evaluation.service.user.MasterService;
import ir.ac.sbu.evaluation.service.user.StudentService;
import ir.ac.sbu.evaluation.utility.DateUtility;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    private static List<UniversityDto> universities;
    private static Map<Long /* university ID */, List<FacultyDto>> faculties;

    private final UniversityService universityService;
    private final FacultyService facultyService;

    private final AdminService adminService;
    private final MasterService masterService;
    private final StudentService studentService;

    private final MasterRepository masterRepository;
    private final StudentRepository studentRepository;

    private final MeetScheduleRepository meetScheduleRepository;
    private final ScheduleService scheduleService;

    private final ProblemService problemService;
    private final ProblemRepository problemRepository;

    private MasterDto sadeghMaster;
    private MasterDto mojtabaMaster;
    private MasterDto mahmoudMaster;
    private MasterDto hasanMaster;
    private StudentDto aminStudent;

    public DataLoader(UniversityService universityService,
            FacultyService facultyService,
            AdminService adminService, MasterService masterService,
            StudentService studentService,
            ProblemService problemService,
            StudentRepository studentRepository,
            MasterRepository masterRepository,
            MeetScheduleRepository meetScheduleRepository,
            ScheduleService scheduleService,
            ProblemRepository problemRepository) {
        this.universityService = universityService;
        this.facultyService = facultyService;
        this.adminService = adminService;
        this.masterService = masterService;
        this.studentService = studentService;
        this.problemService = problemService;
        this.studentRepository = studentRepository;
        this.masterRepository = masterRepository;
        this.meetScheduleRepository = meetScheduleRepository;
        this.scheduleService = scheduleService;
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) throws ParseException {
        prepareUniversities();
        prepareUsers();

        Instant yesterday = DateUtility.getStartOfDay(Instant.now().minus(2, ChronoUnit.DAYS));
        Instant tomorrow = DateUtility.getStartOfDay(Instant.now().plus(2, ChronoUnit.DAYS));

        MeetSchedule meetSchedule1 = meetScheduleRepository.save(MeetSchedule.builder()
                .durationMinutes(30L)
                .minimumDate(yesterday)
                .maximumDate(tomorrow)
                .scheduleState(ScheduleState.CREATED)
                .build());
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
                .meetSchedule(meetSchedule1)
                .build());
        meetSchedule1.setProblem(problem1);
        problem1 = problemRepository.save(problem1);

        MeetSchedule meetSchedule2 = meetScheduleRepository.save(MeetSchedule.builder()
                .durationMinutes(30L)
                .minimumDate(yesterday)
                .maximumDate(tomorrow)
                .scheduleState(ScheduleState.CREATED)
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
                .meetSchedule(meetSchedule2)
                .build());
        meetSchedule2.setProblem(problem2);
        problem2 = problemRepository.save(problem2);

        MeetSchedule meetSchedule3 = meetScheduleRepository.save(MeetSchedule.builder()
                .durationMinutes(30L)
                .minimumDate(yesterday)
                .maximumDate(tomorrow)
                .scheduleState(ScheduleState.STARTED)
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
                .meetSchedule(meetSchedule3)
                .build());
        meetSchedule3.setProblem(problem3);
        problem3 = problemRepository.save(problem3);

        MeetSchedule meetSchedule4 = meetScheduleRepository.save(MeetSchedule.builder()
                .durationMinutes(30L)
                .minimumDate(yesterday)
                .maximumDate(tomorrow)
                .scheduleState(ScheduleState.CREATED)
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
                .meetSchedule(meetSchedule4)
                .build());
        meetSchedule4.setProblem(problem4);
        problem4 = problemRepository.save(problem4);

        Master master = masterRepository.findById(sadeghMaster.getId()).get();
        problem1.setSupervisor(master);
        problem1 = problemRepository.save(problem1);
        problem2.setSupervisor(master);
        problem2 = problemRepository.save(problem2);

        master = masterRepository.findById(mojtabaMaster.getId()).get();
        problem3.setSupervisor(master);
        problem3 = problemRepository.save(problem3);
        problem4.setSupervisor(master);
        problem4 = problemRepository.save(problem4);

        Student student = studentRepository.findById(aminStudent.getId()).get();
        problem1.setStudent(student);
        problem1 = problemRepository.save(problem1);
        problem2.setStudent(student);
        problem2 = problemRepository.save(problem2);
        problem3.setStudent(student);
        problem3 = problemRepository.save(problem3);
        problem4.setStudent(student);
        problem4 = problemRepository.save(problem4);

        setSpringSecurityAuthentication(mojtabaMaster);
        problemService.addReferee(mojtabaMaster.getId(), problem3.getId(), sadeghMaster.getId());
        problemService.addReferee(mojtabaMaster.getId(), problem3.getId(), mahmoudMaster.getId());
        problemService.addReferee(mojtabaMaster.getId(), problem4.getId(), mahmoudMaster.getId());

        setSpringSecurityAuthentication(aminStudent);
        problemService.addProblemEvent(aminStudent.getId(), problem1.getId(), ProblemEventSaveDto.builder()
                .message("پیشنهاد من برای این مسئله این است که تا حد امکان ویژگی‌های خیلی خوب را مستند کنیم.")
                .build());
        setSpringSecurityAuthentication(sadeghMaster);
        problemService.addProblemEvent(sadeghMaster.getId(), problem1.getId(), ProblemEventSaveDto.builder()
                .message(
                        "من با پیشنهاد شما موافق هستم ولی خیلی می‌تواند بهتر باشد اگر جوانب مختلف این تصمیم را پیش از رفتن به سمت آن بسنجیم تا از درستی آن تا حد خوبی اطمینان پیدا کنیم.")
                .build());

        Calendar calendar = Calendar.getInstance();
        String todayDate = String.format("%04d-%02d-%02d",
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH) + 1,
                calendar.get(Calendar.DAY_OF_MONTH));
        ScheduleEventDto scheduleEvent1 = scheduleService
                .addScheduleEvent(sadeghMaster.getId(), meetSchedule3.getId(), DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 09:00", todayDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 10:00", todayDate)).toInstant())
                        .build());
        ScheduleEventDto scheduleEvent2 = scheduleService
                .addScheduleEvent(aminStudent.getId(), meetSchedule3.getId(), DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 11:00", todayDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 12:00", todayDate)).toInstant())
                        .build());
        ScheduleEventDto scheduleEvent3 = scheduleService
                .addScheduleEvent(mojtabaMaster.getId(), meetSchedule3.getId(), DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 13:00", todayDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 15:00", todayDate)).toInstant())
                        .build());
    }

    private void prepareUsers() {
        FacultyDto computerEngineeringFaculty = faculties.get(universities.get(0).getId()).get(0);
        sadeghMaster = masterService.save(MasterSaveDto.builder()
                .firstName("صادق")
                .lastName("علی اکبری")
                .degree("استاد")
                .username("master")
                .password("pass")
                .personalInfo(PersonalInfoSaveDto.builder()
                        .gender(Gender.MALE)
                        .telephoneNumber("9131234567")
                        .email("sadegh.aliakbari@gmail.com")
                        .build())
                .facultyId(computerEngineeringFaculty.getId())
                .build());

        mojtabaMaster = masterService.save(MasterSaveDto.builder()
                .firstName("مجتبی")
                .lastName("وحیدی")
                .degree("استاد")
                .username("mojtaba")
                .password("pass")
                .personalInfo(PersonalInfoSaveDto.builder()
                        .gender(Gender.MALE)
                        .telephoneNumber("9137654321")
                        .email("mojtaba.vahidi@sbu.ac.ir")
                        .build())
                .facultyId(computerEngineeringFaculty.getId())
                .build());

        mahmoudMaster = masterService.save(MasterSaveDto.builder()
                .firstName("محمود")
                .lastName("نشاطی")
                .degree("استاد")
                .username("master3")
                .password("pass")
                .personalInfo(PersonalInfoSaveDto.builder()
                        .gender(Gender.MALE)
                        .telephoneNumber("9137654123")
                        .email("master3@sbu.ac.ir")
                        .build())
                .facultyId(computerEngineeringFaculty.getId())
                .build());

        hasanMaster = masterService.save(MasterSaveDto.builder()
                .firstName("حسن")
                .lastName("حقیقی")
                .degree("استاد")
                .username("master4")
                .password("pass")
                .personalInfo(PersonalInfoSaveDto.builder()
                        .gender(Gender.MALE)
                        .telephoneNumber("9137651234")
                        .email("master4@sbu.ac.ir")
                        .build())
                .facultyId(computerEngineeringFaculty.getId())
                .build());

        aminStudent = studentService.save(StudentSaveDto.builder()
                .firstName("امین")
                .lastName("برجیان")
                .studentNumber("96243012")
                .username("student")
                .password("pass")
                .personalInfo(PersonalInfoSaveDto.builder()
                        .gender(Gender.MALE)
                        .telephoneNumber("9137654321")
                        .email("student@gmail.com")
                        .build())
                .facultyId(computerEngineeringFaculty.getId())
                .build());

        AdminDto admin = adminService.save(AdminSaveDto.builder()
                .firstName("مدیر")
                .lastName("سامانه")
                .username("admin")
                .password("pass")
                .personalInfo(PersonalInfoSaveDto.builder()
                        .gender(Gender.MALE)
                        .telephoneNumber("9137654321")
                        .email("admin@gmail.com")
                        .build())
                .build());
    }

    private void prepareUniversities() {
        universities = new ArrayList<>();
        faculties = new HashMap<>();

        UniversityDto shahidBeheshtiUniversity = universityService.add(UniversitySaveDto.builder()
                .name("شهیدبهشتی")
                .location("تهران").webAddress("https://www.sbu.ac.ir/")
                .build());
        FacultyDto computerEngineeringFaculty = facultyService
                .add(shahidBeheshtiUniversity.getId(), FacultySaveDto.builder()
                        .name("مهندسی کامپیوتر")
                        .webAddress("https://www.sbu.ac.ir/en/web/cse")
                        .build());
        FacultyDto physicFaculty = facultyService.add(shahidBeheshtiUniversity.getId(), FacultySaveDto.builder()
                .name("فیزیک")
                .webAddress("https://www.sbu.ac.ir/en/web/physics")
                .build());
        universities.add(shahidBeheshtiUniversity);
        faculties.put(shahidBeheshtiUniversity.getId(), new ArrayList<>());
        faculties.get(shahidBeheshtiUniversity.getId()).add(computerEngineeringFaculty);
        faculties.get(shahidBeheshtiUniversity.getId()).add(physicFaculty);

        UniversityDto tehranUniversity = universityService.add(UniversitySaveDto.builder()
                .name("تهران")
                .location("تهران").webAddress("https://ut.ac.ir/fa")
                .build());
        computerEngineeringFaculty = facultyService.add(tehranUniversity.getId(), FacultySaveDto.builder()
                .name("مهندسی کامپیوتر")
                .build());
        FacultyDto mathematicsFaculty = facultyService.add(tehranUniversity.getId(), FacultySaveDto.builder()
                .name("ریاضی")
                .build());
        universities.add(tehranUniversity);
        faculties.put(tehranUniversity.getId(), new ArrayList<>());
        faculties.get(tehranUniversity.getId()).add(computerEngineeringFaculty);
        faculties.get(tehranUniversity.getId()).add(mathematicsFaculty);

        UniversityDto amirKabirUniversity = universityService.add(UniversitySaveDto.builder()
                .name("امیرکبیر")
                .location("تهران").webAddress("https://aut.ac.ir/")
                .build());
        FacultyDto literatureFaculty = facultyService.add(amirKabirUniversity.getId(), FacultySaveDto.builder()
                .name("ادبیات")
                .build());
        universities.add(amirKabirUniversity);
        faculties.put(amirKabirUniversity.getId(), Collections.singletonList(literatureFaculty));

        UniversityDto sharifUniversity = universityService.add(UniversitySaveDto.builder()
                .name("صنعتی شریف")
                .location("تهران").webAddress("http://www.sharif.ir/")
                .build());
        literatureFaculty = facultyService.add(sharifUniversity.getId(), FacultySaveDto.builder()
                .name("ادبیات")
                .build());
        universities.add(sharifUniversity);
        faculties.put(sharifUniversity.getId(), Collections.singletonList(literatureFaculty));

        UniversityDto iustUniversity = universityService.add(UniversitySaveDto.builder()
                .name("علم و صنعت ایران")
                .location("تهران").webAddress("http://iust.ac.ir")
                .build());
        FacultyDto chemistryFaculty = facultyService.add(iustUniversity.getId(), FacultySaveDto.builder()
                .name("شیمی")
                .build());
        universities.add(iustUniversity);
        faculties.put(iustUniversity.getId(), Collections.singletonList(chemistryFaculty));

        UniversityDto atuUniversity = universityService.add(UniversitySaveDto.builder()
                .name("علامه طباطبایی")
                .location("تهران").webAddress("http://atu.ac.ir")
                .build());
        chemistryFaculty = facultyService.add(atuUniversity.getId(), FacultySaveDto.builder()
                .name("شیمی")
                .build());
        universities.add(atuUniversity);
        faculties.put(atuUniversity.getId(), Collections.singletonList(chemistryFaculty));
    }

    /**
     * Copy-pasted function from {@link ir.ac.sbu.evaluation.security.JwtAuthenticationFilter} to provide mock username
     * in preparing initial data.
     */
    private void setSpringSecurityAuthentication(UserDto user) {
        AuthUserDetail authUserDetail = AuthUserDetail.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
        // Manually provided authentication for Spring Security.
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(authUserDetail, null, authUserDetail.getAuthorities());
        // After setting the Authentication in the context, we specify that the current user is authenticated.
        // So it passes the Spring Security configurations successfully.
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
    }
}
