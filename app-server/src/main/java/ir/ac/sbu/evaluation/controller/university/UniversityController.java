package ir.ac.sbu.evaluation.controller.university;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_UNIVERSITY_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.university.FacultyDto;
import ir.ac.sbu.evaluation.dto.university.UniversityDto;
import ir.ac.sbu.evaluation.service.university.UniversityService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_UNIVERSITY_ROOT_PATH)
public class UniversityController {

    private final static String API_UNIVERSITY_REGISTER_PATH = "/register";
    private final static String API_UNIVERSITY_DELETE_PATH = "";

    private final UniversityService universityService;

    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }

    @GetMapping(value = {"", "/"})
    public List<UniversityDto> list() {
        return universityService.retrieveAll();
    }

    @GetMapping(value = "/{universityId}/faculty")
    public List<FacultyDto> listFaculties(@PathVariable long universityId) {
        return universityService.retrieveUniversityFaculties(universityId);
    }

    @DeleteMapping(path = "/{universityId}")
    public UniversityDto delete(@PathVariable long universityId) {
        return universityService.delete(universityId);
    }

    @PutMapping(path = "/{universityId}")
    public UniversityDto update(@PathVariable long universityId, @Valid @RequestBody UniversityDto universityDto) {
        return universityService.update(universityId, universityDto);
    }

    @PostMapping(path = API_UNIVERSITY_REGISTER_PATH)
    public UniversityDto register(@Valid @RequestBody UniversityDto universityDto) {
        return universityService.register(universityDto);
    }
}
