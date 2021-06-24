package ir.ac.sbu.evaluation.controller.review;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_REVIEW_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.dto.review.ProblemReviewSaveDto;
import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleDto;
import ir.ac.sbu.evaluation.model.problem.ProblemState;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.review.ReviewService;
import javax.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_REVIEW_ROOT_PATH)
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{problemId}")
    public ProblemDto updateMeetSchedule(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId,
            @Valid @RequestBody ProblemReviewSaveDto problemReviewSaveDto) {
        return reviewService.reviewProblem(authUserDetail.getUserId(), problemId, problemReviewSaveDto);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{problemId}/finalize")
    public ProblemDto updateMeetSchedule(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long problemId,
            @RequestParam(name = "finalGrade") Double finalGrade) {
        return reviewService.finalizeProblem(authUserDetail.getUserId(), problemId, finalGrade);
    }

}
