package ir.ac.sbu.evaluation.controller.university;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_UNIVERSITY_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.university.FacultyDto;
import ir.ac.sbu.evaluation.dto.university.UniversityDto;
import ir.ac.sbu.evaluation.service.university.UniversityService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_UNIVERSITY_ROOT_PATH)
public class UniversityController {

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
}
