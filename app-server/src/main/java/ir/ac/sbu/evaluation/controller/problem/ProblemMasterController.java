package ir.ac.sbu.evaluation.controller.problem;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_PROBLEM_MASTER_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.ProblemDto;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.ProblemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PROBLEM_MASTER_ROOT_PATH)
@PreAuthorize("hasAuthority(@SecurityRoles.MASTER_ROLE_NAME)")
public class ProblemMasterController {

    private final ProblemService problemService;

    public ProblemMasterController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping(path = {"", "/"})
    public Page<ProblemDto> retrieveAssignedProblems(
            @ModelAttribute AuthUserDetail authUserDetail,
            @RequestParam(name = "problemState") ProblemState problemState,
            Pageable pageable) {
        return problemService.retrieveMasterAssignedProblems(authUserDetail.getUserId(), problemState, pageable);
    }
}
