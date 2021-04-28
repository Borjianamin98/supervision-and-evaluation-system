package ir.ac.sbu.evaluation.controller.user;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_STUDENT_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.user.StudentDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.service.user.StudentService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_STUDENT_ROOT_PATH)
public class StudentController {

    private final static String API_STUDENT_REGISTER_PATH = "/register";

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping(path = {"", "/"})
    public List<UserDto> list() {
        return studentService.listAsUser();
    }

    @PostMapping(path = API_STUDENT_REGISTER_PATH)
    public StudentDto add(@Valid @RequestBody StudentDto studentDto) {
        return studentService.save(studentDto);
    }
}
