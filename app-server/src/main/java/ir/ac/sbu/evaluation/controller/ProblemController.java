package ir.ac.sbu.evaluation.controller;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_PROBLEM_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.ProblemDto;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.security.SecurityRoles;
import ir.ac.sbu.evaluation.service.ProblemService;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(API_PROBLEM_ROOT_PATH)
public class ProblemController {

    public final static String API_PROBLEM_CREATE_PATH = "/create";
    public final static String API_PROBLEM_AUTHENTICATED_OWNER_PROBLEMS_PATH = "/authenticatedOwner";

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping(path = API_PROBLEM_AUTHENTICATED_OWNER_PROBLEMS_PATH)
    public Page<ProblemDto> retrieveProblems(
            @ModelAttribute AuthUserDetail authUserDetail,
            @RequestParam(name = "problemState") ProblemState problemState,
            Pageable pageable) {
        if (!authUserDetail.getRoles().contains(SecurityRoles.STUDENT_ROLE_NAME)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return problemService.retrieveProblems(authUserDetail.getUserId(), problemState, pageable);
    }

    @PostMapping(path = API_PROBLEM_CREATE_PATH)
    @ResponseStatus(HttpStatus.CREATED)
    public ProblemDto createProblem(@Valid @RequestBody ProblemDto problemDto,
            @ModelAttribute AuthUserDetail authUserDetail) {
        if (!authUserDetail.getRoles().contains(SecurityRoles.STUDENT_ROLE_NAME)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return problemService.addProblem(authUserDetail.getUserId(), problemDto);
    }
}
