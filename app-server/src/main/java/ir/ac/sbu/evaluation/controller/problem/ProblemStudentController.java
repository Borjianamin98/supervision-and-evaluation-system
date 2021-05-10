package ir.ac.sbu.evaluation.controller.problem;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_PROBLEM_STUDENT_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.ProblemService;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PROBLEM_STUDENT_ROOT_PATH)
@PreAuthorize("hasAuthority(@SecurityRoles.STUDENT_ROLE_NAME)")
public class ProblemStudentController {

    private final ProblemService problemService;

    public ProblemStudentController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping(path = {"", "/"})
    public Page<ProblemDto> retrieveProblems(
            @ModelAttribute AuthUserDetail authUserDetail,
            @RequestParam(name = "problemState") ProblemState problemState,
            Pageable pageable) {
        return problemService.retrieveProblemsOfStudents(authUserDetail.getUserId(), problemState, pageable);
    }

    @PostMapping(path = {"", "/"})
    @ResponseStatus(HttpStatus.CREATED)
    public ProblemDto createProblem(
            @ModelAttribute AuthUserDetail authUserDetail,
            @Valid @RequestBody ProblemDto problemDto) {
        return problemService.addProblem(authUserDetail.getUserId(), problemDto);
    }

    @PutMapping(path = "/{problemId}")
    public ProblemDto update(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId,
            @Valid @RequestBody ProblemDto problemDto) throws IllegalAccessException {
        return problemService.updateStudentProblem(authUserDetail.getUserId(), problemId, problemDto);
    }
}
