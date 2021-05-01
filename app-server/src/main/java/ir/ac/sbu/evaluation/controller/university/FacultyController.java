package ir.ac.sbu.evaluation.controller.university;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_FACULTY_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.university.FacultyDto;
import ir.ac.sbu.evaluation.service.university.FacultyService;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_FACULTY_ROOT_PATH)
public class FacultyController {

    private final static String API_FACULTY_REGISTER_PATH = "/register";

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping(value = {"", "/"})
    public Page<FacultyDto> listFaculties(@RequestParam(name = "universityId") long universityId, Pageable pageable) {
        return facultyService.retrieveUniversityFaculties(universityId, pageable);
    }

    @DeleteMapping(path = "/{facultyId}")
    public FacultyDto delete(@PathVariable long facultyId) {
        return facultyService.delete(facultyId);
    }

    @PutMapping(path = "/{facultyId}")
    public FacultyDto update(@PathVariable long facultyId, @Valid @RequestBody FacultyDto facultyDto) {
        return facultyService.update(facultyId, facultyDto);
    }

    @PostMapping(path = API_FACULTY_REGISTER_PATH)
    public FacultyDto register(@RequestParam(name = "universityId") long universityId,
            @Valid @RequestBody FacultyDto facultyDto) {
        return facultyService.register(universityId, facultyDto);
    }
}
