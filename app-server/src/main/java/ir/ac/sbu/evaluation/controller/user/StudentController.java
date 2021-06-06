package ir.ac.sbu.evaluation.controller.user;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_STUDENT_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.user.student.StudentDto;
import ir.ac.sbu.evaluation.dto.user.student.StudentSaveDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.user.StudentService;
import java.util.List;
import java.util.stream.Stream;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_STUDENT_ROOT_PATH)
public class StudentController {

    private final static String API_STUDENT_REGISTER_PATH = "/register";
    private final static String API_STUDENT_INFO_PATH = "/info";

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    public static String[] permittedPaths() {
        return Stream.of(API_STUDENT_REGISTER_PATH)
                .map(path -> API_STUDENT_ROOT_PATH + path).toArray(String[]::new);
    }

    @GetMapping(path = {"", "/"})
    public List<StudentDto> list() {
        return studentService.list();
    }

    @GetMapping(path = API_STUDENT_INFO_PATH)
    public StudentDto retrieveInfo(@ModelAttribute AuthUserDetail authUserDetail) {
        return studentService.retrieve(authUserDetail.getUserId());
    }

    @PostMapping(path = API_STUDENT_REGISTER_PATH)
    public StudentDto register(@Valid @RequestBody StudentSaveDto studentSaveDto) {
        return studentService.save(studentSaveDto);
    }
}
