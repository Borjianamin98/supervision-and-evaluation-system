package ir.ac.sbu.evaluation.controller.problem;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_PROBLEM_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.dto.problem.event.ProblemEventSaveDto;
import ir.ac.sbu.evaluation.dto.problem.event.ProblemEventDto;
import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.problem.ProblemService;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PROBLEM_ROOT_PATH)
public class ProblemAuthenticatedController {

    private static final String API_PROBLEM_AUTHENTICATED_PROBLEM_EVENTS_PATH = "/events";
    private static final String API_PROBLEM_AUTHENTICATED_ABANDON_PROBLEM_PATH = "/abandon";
    private static final String API_PROBLEM_AUTHENTICATED_PROBLEM_SCHEDULE_PATH = "/schedule";

    private final ProblemService problemService;

    public ProblemAuthenticatedController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @GetMapping(path = "/{problemId}")
    public ProblemDto retrieveProblem(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId) {
        return problemService.retrieveProblem(authUserDetail.getUserId(), problemId);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{problemId}" + API_PROBLEM_AUTHENTICATED_PROBLEM_EVENTS_PATH)
    public ProblemEventDto addProblemEvent(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId,
            @Valid @RequestBody ProblemEventSaveDto problemEventSaveDto) {
        return problemService.addProblemEvent(authUserDetail.getUserId(), problemId, problemEventSaveDto);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @GetMapping(path = "/{problemId}" + API_PROBLEM_AUTHENTICATED_PROBLEM_EVENTS_PATH)
    public Page<ProblemEventDto> retrieveProblemEvents(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId,
            Pageable pageable) {
        return problemService.retrieveProblemEvents(authUserDetail.getUserId(), problemId, pageable);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @GetMapping(path = "/{problemId}" + API_PROBLEM_AUTHENTICATED_ABANDON_PROBLEM_PATH)
    public ProblemDto abandonProblem(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId) {
        return problemService.abandonProblem(authUserDetail.getUserId(), problemId);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @GetMapping(path = "/{problemId}" + API_PROBLEM_AUTHENTICATED_PROBLEM_SCHEDULE_PATH)
    public MeetScheduleDto retrieveProblemSchedule(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId) {
        return problemService.retrieveProblemSchedule(authUserDetail.getUserId(), problemId);
    }
}
