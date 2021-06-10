package ir.ac.sbu.evaluation.controller.problem;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_PROBLEM_MASTER_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.problem.ProblemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PROBLEM_MASTER_ROOT_PATH)
@PreAuthorize("hasAuthority(@SecurityRoles.MASTER_ROLE_NAME)")
public class ProblemMasterController {

    private static final String API_PROBLEM_MASTER_UPDATE_REFEREES_PATH = "";

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

    @GetMapping(path = "/{problemId}/initialApprove")
    public ProblemDto initialApprovalOfProblem(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId) {
        return problemService.initialApprovalOfProblem(authUserDetail.getUserId(), problemId);
    }

    @PostMapping(path = "/{problemId}/referee/{refereeId}")
    public ProblemDto addReferee(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId,
            @PathVariable long refereeId) {
        return problemService.addReferee(authUserDetail.getUserId(), problemId, refereeId);
    }

    @DeleteMapping(path = "/{problemId}/referee/{refereeId}")
    public ProblemDto deleteReferee(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId,
            @PathVariable long refereeId,
            @RequestParam(name = "force") boolean forceToRemove) {
        return problemService.deleteReferee(authUserDetail.getUserId(), problemId, refereeId, forceToRemove);
    }
}
