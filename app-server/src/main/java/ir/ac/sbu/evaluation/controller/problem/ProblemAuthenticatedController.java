package ir.ac.sbu.evaluation.controller.problem;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_PROBLEM_ROOT_PATH;

import io.jsonwebtoken.Claims;
import ir.ac.sbu.evaluation.dto.problem.event.ProblemEventDto;
import ir.ac.sbu.evaluation.dto.problem.event.ProblemEventSaveDto;
import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleDto;
import ir.ac.sbu.evaluation.exception.security.InvalidJwtTokenException;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.security.JwtTokenProvider;
import ir.ac.sbu.evaluation.service.problem.ProblemService;
import java.util.stream.Stream;
import javax.validation.Valid;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PROBLEM_ROOT_PATH)
public class ProblemAuthenticatedController {

    private final JwtTokenProvider jwtTokenProvider;
    private final ProblemService problemService;

    public ProblemAuthenticatedController(JwtTokenProvider jwtTokenProvider,
            ProblemService problemService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.problemService = problemService;
    }

    public static String[] permittedPaths() {
        return Stream.of("/*/events/*/attachment")
                .map(path -> API_PROBLEM_ROOT_PATH + path).toArray(String[]::new);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @GetMapping(path = "/{problemId}")
    public ir.ac.sbu.evaluation.dto.problem.ProblemDto retrieveProblem(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId) {
        return problemService.retrieveProblem(authUserDetail.getUserId(), problemId);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{problemId}/events")
    public ProblemEventDto addProblemEvent(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId,
            @Valid @ModelAttribute ProblemEventSaveDto problemEventSaveDto) {
        return problemService.addProblemEvent(authUserDetail.getUserId(), problemId, problemEventSaveDto);
    }

    @GetMapping(path = "/{problemId}/events/{problemEventId}/attachment")
    public ResponseEntity<ByteArrayResource> getProblemEventAttachment(
            @PathVariable long problemId,
            @PathVariable long problemEventId,
            @RequestParam(name = "token") String token) throws InvalidJwtTokenException {
        // No security enforcement for this method. All security concerns should be check from token.
        Claims tokenClaims = jwtTokenProvider.parseToken(token);
        jwtTokenProvider.ensureIsDownloadToken(tokenClaims);

        return problemService.getProblemEventAttachment(jwtTokenProvider.getUserId(tokenClaims),
                problemId, problemEventId);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @GetMapping(path = "/{problemId}/events")
    public Page<ProblemEventDto> retrieveProblemEvents(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId,
            Pageable pageable) {
        return problemService.retrieveProblemEvents(authUserDetail.getUserId(), problemId, pageable);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @GetMapping(path = "/{problemId}/abandon")
    public ir.ac.sbu.evaluation.dto.problem.ProblemDto abandonProblem(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId) {
        return problemService.abandonProblem(authUserDetail.getUserId(), problemId);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @GetMapping(path = "/{problemId}/schedule")
    public MeetScheduleDto retrieveProblemSchedule(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId) {
        return problemService.retrieveProblemSchedule(authUserDetail.getUserId(), problemId);
    }
}
