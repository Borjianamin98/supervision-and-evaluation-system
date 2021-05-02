package ir.ac.sbu.evaluation.controller.university;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_AUTHENTICATION_ROOT_PATH;
import static ir.ac.sbu.evaluation.controller.ApiPaths.API_UNIVERSITY_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.university.UniversityDto;
import ir.ac.sbu.evaluation.service.university.UniversityService;
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
@RequestMapping(API_UNIVERSITY_ROOT_PATH)
public class UniversityController {

    private final static String API_UNIVERSITY_REGISTER_PATH = "/register";

    private final UniversityService universityService;

    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }

    public static String[] permittedPaths() {
        return new String[]{API_UNIVERSITY_ROOT_PATH};
    }

    @GetMapping(value = {"", "/"})
    public Page<UniversityDto> list(
            @RequestParam(name = "nameQuery", required = false, defaultValue = "") String nameQuery,
            Pageable pageable) {
        return universityService.retrieveUniversities(nameQuery, pageable);
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
