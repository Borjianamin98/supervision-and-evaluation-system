package ir.ac.sbu.evaluation.service.review;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.dto.review.PeerReviewSaveDto;
import ir.ac.sbu.evaluation.dto.review.ProblemReviewSaveDto;
import ir.ac.sbu.evaluation.exception.IllegalResourceAccessException;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import ir.ac.sbu.evaluation.model.review.PeerReview;
import ir.ac.sbu.evaluation.model.review.ProblemReview;
import ir.ac.sbu.evaluation.model.user.User;
import ir.ac.sbu.evaluation.repository.problem.ProblemEventRepository;
import ir.ac.sbu.evaluation.repository.problem.ProblemRepository;
import ir.ac.sbu.evaluation.repository.review.PeerReviewRepository;
import ir.ac.sbu.evaluation.repository.review.ProblemReviewRepository;
import ir.ac.sbu.evaluation.repository.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final UserRepository userRepository;

    private final ProblemRepository problemRepository;
    private final ProblemEventRepository problemEventRepository;

    private final PeerReviewRepository peerReviewRepository;
    private final ProblemReviewRepository problemReviewRepository;

    public ReviewService(UserRepository userRepository,
            ProblemRepository problemRepository,
            ProblemEventRepository problemEventRepository,
            PeerReviewRepository peerReviewRepository,
            ProblemReviewRepository problemReviewRepository) {
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.problemEventRepository = problemEventRepository;
        this.peerReviewRepository = peerReviewRepository;
        this.problemReviewRepository = problemReviewRepository;
    }

    @Transactional
    public ProblemDto reviewProblem(long userId, long problemId, ProblemReviewSaveDto problemReviewSaveDto) {
        Problem problem = getProblem(problemId);
        User reviewer = getUser(userId);
        checkUserAccessProblem(userId, problem);

        ProblemReview problemReview = problemReviewRepository.save(ProblemReview.builder()
                .problem(problem)
                .reviewer(reviewer)
                .score(problemReviewSaveDto.getScore())
                .build());

        for (PeerReviewSaveDto peerReviewSaveDto : problemReviewSaveDto.getPeerReviews()) {
            PeerReview peerReview = peerReviewSaveDto.toPeerReview();
            peerReview.setProblem(problem);
            peerReview.setReviewer(reviewer);
            peerReview.setReviewed(getUser(peerReviewSaveDto.getReviewedId()));
            peerReviewRepository.save(peerReview);
        }

        problemEventRepository.save(ProblemEvent.builder()
                .message(String.format(
                        "استاد «%s» ارزیابی خود از جلسه‌ی دفاع را تکمیل نمودند.",
                        reviewer.getFullName()))
                .problem(problem)
                .build());

        problem.getProblemReviews().add(problemReview);
        return ProblemDto.from(problem);
    }

    private void checkUserIsSupervisor(long userId, Problem problem) {
        if (problem.getSupervisor().getId() != userId) {
            throw new IllegalResourceAccessException(
                    "Problem is not owned or controlled (supervisor) by user: user ID = " + userId + " Problem ID = "
                            + problem.getId());
        }
    }

    private void checkUserAccessProblem(long userId, Problem problem) {
        if (problem.getStudent().getId() != userId && problem.getSupervisor().getId() != userId
                && problem.getReferees().stream().noneMatch(master -> master.getId() == userId)) {
            throw new IllegalResourceAccessException(
                    "Meet schedule is not owned or controlled by user: ID = " + userId + " Schedule ID = "
                            + problem.getId());
        }
    }

    private Problem getProblem(long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found: ID = " + problemId));
    }

    private User getUser(long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: ID = " + userId));
    }
}
