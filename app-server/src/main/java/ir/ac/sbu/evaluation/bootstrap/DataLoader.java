package ir.ac.sbu.evaluation.bootstrap;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.dto.problem.ProblemSaveDto;
import ir.ac.sbu.evaluation.dto.problem.event.ProblemEventSaveDto;
import ir.ac.sbu.evaluation.dto.review.PeerReviewSaveDto;
import ir.ac.sbu.evaluation.dto.review.ProblemReviewSaveDto;
import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleSaveDto;
import ir.ac.sbu.evaluation.dto.schedule.event.DateRangeDto;
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
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.problem.ProblemService;
import ir.ac.sbu.evaluation.service.review.ReviewService;
import ir.ac.sbu.evaluation.service.schedule.MeetScheduleService;
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

    private final MeetScheduleService meetScheduleService;
    private final ProblemService problemService;
    private final ReviewService reviewService;

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
            MeetScheduleService meetScheduleService,
            ReviewService reviewService) {
        this.universityService = universityService;
        this.facultyService = facultyService;
        this.adminService = adminService;
        this.masterService = masterService;
        this.studentService = studentService;
        this.problemService = problemService;
        this.meetScheduleService = meetScheduleService;
        this.reviewService = reviewService;
    }

    @Override
    public void run(String... args) throws ParseException {
        prepareUniversities();
        prepareUsers();

        Instant twoDayAgo = DateUtility.getStartOfDay(Instant.now().minus(2, ChronoUnit.DAYS));
        Instant threeDayTomorrow = DateUtility.getStartOfDay(Instant.now().plus(2, ChronoUnit.DAYS));

        ProblemDto problem1 = problemService.addProblem(aminStudent.getId(), ProblemSaveDto.builder()
                .education(Education.BACHELOR)
                .title("سامانه ارزیابی و نظارت یکپارچه")
                .englishTitle("Integrated supervision and evaluation system")
                .keywords(new HashSet<>(Arrays.asList("مجتمع", "ارزیابی", "یکپارچه", "نظارت")))
                .definition(
                        "در رویکرد قدیمی، برای انجام کارهای مربوط به ارائه‌ی پروژه‌ی پایانی، رساله، پروپوزال و انتقال"
                                + " اطلاعات آن، از روش‌های حضوری برای هماهنگی با استادها، مسئولین آموزش و ... استفاده"
                                + " می‌شد. همچنین برای به اشتراک‌گذاری اطلاعات، نتایج تحقیقات و پیشرفت‌ها و ... نیز "
                                + "از سامانه‌های متنوعی مثل ایمیل و موارد مشابه استفاده می‌شد که با توجه به تعداد "
                                + "زیاد دانشجویان و مشغله‌های افراد درگیر در این فرآیند، این پیام‌ها و اطلاعات متمرکز"
                                + " نبودند و دنبال‌کردن تاریخچه یا بررسی آن‌ها بسیار زمان‌بر بود. در سامانه‌های تحت "
                                + "وب، تمامی این کارها می‌توانند با صرفه جویی در زمان و منابع و بدون محدودیت مکانی و "
                                + "با دقت بالاتری به همراه مستند‌شدن ارتباط بین اساتید و دانشجو انجام بپذیرد.")
                .history("بیشینه مسئله")
                .considerations("برای پیاده‌سازی در محیط عملیاتی، نیازمند سرور و تجهیزات شبکه‌ای مربوطه می‌باشد.")
                .supervisorId(sadeghMaster.getId())
                .build());
        ProblemDto problem2 = problemService.addProblem(aminStudent.getId(), ProblemSaveDto.builder()
                .education(Education.BACHELOR)
                .title("سامانه مدیریت خرید و فروش رستوران")
                .englishTitle("Restaurant sales management system")
                .keywords(new HashSet<>(Arrays.asList("رستوران", "فروش", "خرید", "سامانه")))
                .definition(
                        "سامانه‌ جامع و کامل که به منظورت مدیریت خرید و فروش رستوران‌های کل شهرهای کشور استفاده "
                                + "می‌شود.")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .supervisorId(sadeghMaster.getId())
                .build());
        ProblemDto problem3 = problemService.addProblem(aminStudent.getId(), ProblemSaveDto.builder()
                .education(Education.BACHELOR)
                .title("نقشه تعاملی سامانه‌های نرم‌افزاری یک شرکت")
                .englishTitle("Interactive map of a company's software systems")
                .keywords(new HashSet<>(Arrays.asList("شرکت", "تعاملی", "سامانه")))
                .definition("سامانه‌ به منظور نقشه تعاملی سامانه‌های نرم‌افزاری یک شرکت استفاده می‌شود.")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .supervisorId(mojtabaMaster.getId())
                .build());
        ProblemDto problem4 = problemService.addProblem(aminStudent.getId(), ProblemSaveDto.builder()
                .education(Education.BACHELOR)
                .title("طراحی و پیاده سازی بستر ارسال پیامک انبوه")
                .englishTitle("Design and implementation of bulk SMS platform")
                .keywords(new HashSet<>(Arrays.asList("انبوه", "پیامک کوتاه", "سامانه")))
                .definition("سامانه‌ به منظور این که بتوان در حجم انبوه و زیاد، پیامک‌های موردنیاز را ارسال نمود.")
                .history("بیشینه مسئله")
                .considerations("ملاحظاتی که باید در نظر گرفته شوند.")
                .supervisorId(mojtabaMaster.getId())
                .build());

        problemService.initialApprovalOfProblem(mojtabaMaster.getId(), problem3.getId());
        problemService.initialApprovalOfProblem(mojtabaMaster.getId(), problem4.getId());

        setSpringSecurityAuthentication(mojtabaMaster);
        problemService.addReferee(mojtabaMaster.getId(), problem3.getId(), sadeghMaster.getId());
        problemService.addReferee(mojtabaMaster.getId(), problem3.getId(), mahmoudMaster.getId());
        problemService.addReferee(mojtabaMaster.getId(), problem4.getId(), mahmoudMaster.getId());
        problemService.addReferee(mojtabaMaster.getId(), problem4.getId(), sadeghMaster.getId());

        setSpringSecurityAuthentication(aminStudent);
        problemService.addProblemEvent(aminStudent.getId(), problem1.getId(), ProblemEventSaveDto.builder()
                .message("پیشنهاد من برای این مسئله این است که تا حد امکان ویژگی‌های خیلی خوب را مستند کنیم.")
                .build());
        setSpringSecurityAuthentication(sadeghMaster);
        problemService.addProblemEvent(sadeghMaster.getId(), problem1.getId(), ProblemEventSaveDto.builder()
                .message(
                        "من با پیشنهاد شما موافق هستم ولی خیلی می‌تواند بهتر باشد اگر جوانب مختلف این تصمیم را پیش از"
                                + " رفتن به سمت آن بسنجیم تا از درستی آن تا حد خوبی اطمینان پیدا کنیم.")
                .build());

        Calendar calendar = Calendar.getInstance();
        String yesterdayDate = String.format("%04d-%02d-%02d",
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH) + 1,
                calendar.get(Calendar.DAY_OF_MONTH) - 1);
        String todayDate = String.format("%04d-%02d-%02d",
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH) + 1,
                calendar.get(Calendar.DAY_OF_MONTH));
        String tomorrowDate = String.format("%04d-%02d-%02d",
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH) + 1,
                calendar.get(Calendar.DAY_OF_MONTH) + 1);
        meetScheduleService.addScheduleEvent(sadeghMaster.getId(), problem3.getMeetSchedule().getId(),
                DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 09:00", todayDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 10:00", todayDate)).toInstant())
                        .build());
        meetScheduleService.addScheduleEvent(aminStudent.getId(), problem3.getMeetSchedule().getId(),
                DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 11:00", todayDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 12:00", todayDate)).toInstant())
                        .build());
        meetScheduleService.addScheduleEvent(mojtabaMaster.getId(), problem3.getMeetSchedule().getId(),
                DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 13:00", todayDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 15:00", todayDate)).toInstant())
                        .build());

        // Shared schedule event between all participants for problem 3
        meetScheduleService.addScheduleEvent(sadeghMaster.getId(), problem3.getMeetSchedule().getId(),
                DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 15:00", tomorrowDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 20:00", tomorrowDate)).toInstant())
                        .build());
        meetScheduleService.addScheduleEvent(aminStudent.getId(), problem3.getMeetSchedule().getId(),
                DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 15:30", tomorrowDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 19:30", tomorrowDate)).toInstant())
                        .build());
        meetScheduleService.addScheduleEvent(mojtabaMaster.getId(), problem3.getMeetSchedule().getId(),
                DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 16:00", tomorrowDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 19:00", tomorrowDate)).toInstant())
                        .build());
        meetScheduleService.addScheduleEvent(mahmoudMaster.getId(), problem3.getMeetSchedule().getId(),
                DateRangeDto.builder()
                        .startDate(dateFormat.parse(String.format("%s 17:00", tomorrowDate)).toInstant())
                        .endDate(dateFormat.parse(String.format("%s 18:00", tomorrowDate)).toInstant())
                        .build());

        // Shared schedule event between all participants for problem 4
        meetScheduleService.startMeetSchedule(mojtabaMaster.getId(), problem4.getMeetSchedule().getId(),
                MeetScheduleSaveDto.builder()
                        .durationMinutes(30)
                        .minimumDate(twoDayAgo)
                        .maximumDate(threeDayTomorrow)
                        .build());
        for (UserDto user : Arrays.asList(sadeghMaster, aminStudent, mojtabaMaster, mahmoudMaster)) {
            meetScheduleService.addScheduleEvent(user.getId(), problem4.getMeetSchedule().getId(),
                    DateRangeDto.builder()
                            .startDate(dateFormat.parse(String.format("%s 17:00", yesterdayDate)).toInstant())
                            .endDate(dateFormat.parse(String.format("%s 18:00", yesterdayDate)).toInstant())
                            .build());
        }
        // Complete meet schedule of problem 4
        meetScheduleService.finalizeMeetSchedule(mojtabaMaster.getId(), problem4.getMeetSchedule().getId(),
                dateFormat.parse(String.format("%s 17:00", yesterdayDate)).toInstant());
        meetScheduleService.acceptMeetSchedule(mojtabaMaster.getId(), problem4.getMeetSchedule().getId());
        // Complete some of evaluation of users
        setSpringSecurityAuthentication(mahmoudMaster);
        reviewService.reviewProblem(mahmoudMaster.getId(), problem4.getId(), ProblemReviewSaveDto.builder()
                .score(10)
                .peerReviews(new HashSet<>(Arrays.asList(
                        PeerReviewSaveDto.builder()
                                .reviewedId(sadeghMaster.getId())
                                .content("خیلی خوب در زمان جلسه دانشجو را مورد بررسی قرار دادند.")
                                .score(4)
                                .build(),
                        PeerReviewSaveDto.builder()
                                .reviewedId(sadeghMaster.getId())
                                .content("ایشان با مطالعه‌ی قبلی در جلسه‌ی دفاع حضور داشتند و نسبت به مسئله‌ی دانشجو و چالش‌های آن کاملا آگاه بودند.")
                                .score(3)
                                .build(),
                        PeerReviewSaveDto.builder()
                                .reviewedId(mojtabaMaster.getId())
                                .content("بر روی مطلب پروژه‌ی دانشجو کاملا تسلط داشتند.")
                                .score(4)
                                .build()
                )))
                .build());
        setSpringSecurityAuthentication(sadeghMaster);
        reviewService.reviewProblem(sadeghMaster.getId(), problem4.getId(), ProblemReviewSaveDto.builder()
                .score(15)
                .peerReviews(new HashSet<>(Arrays.asList(
                        PeerReviewSaveDto.builder()
                                .reviewedId(mahmoudMaster.getId())
                                .content("سوالات چالشی خوبی برای بررسی دانشجو مدنظر داشتند.")
                                .score(5)
                                .build(),
                        PeerReviewSaveDto.builder()
                                .reviewedId(mojtabaMaster.getId())
                                .content("خیلی از هدف مسئله آگاهی نداشتند.")
                                .score(1)
                                .build()
                )))
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
