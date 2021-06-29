package ir.ac.sbu.evaluation.service.review;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.dto.review.ProblemReviewSaveDto;
import ir.ac.sbu.evaluation.dto.review.peer.PeerReviewSaveDto;
import ir.ac.sbu.evaluation.exception.IllegalResourceAccessException;
import ir.ac.sbu.evaluation.exception.ResourceConflictException;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import ir.ac.sbu.evaluation.model.problem.ProblemState;
import ir.ac.sbu.evaluation.model.review.PeerReview;
import ir.ac.sbu.evaluation.model.review.ProblemReview;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.repository.problem.ProblemEventRepository;
import ir.ac.sbu.evaluation.repository.problem.ProblemRepository;
import ir.ac.sbu.evaluation.repository.review.PeerReviewRepository;
import ir.ac.sbu.evaluation.repository.review.ProblemReviewRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.service.notification.NotificationService;
import ir.ac.sbu.evaluation.utility.LocaleUtility;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final NotificationService notificationService;

    private final MasterRepository masterRepository;

    private final ProblemRepository problemRepository;
    private final ProblemEventRepository problemEventRepository;

    private final PeerReviewRepository peerReviewRepository;
    private final ProblemReviewRepository problemReviewRepository;

    public ReviewService(NotificationService notificationService,
            MasterRepository masterRepository,
            ProblemRepository problemRepository,
            ProblemEventRepository problemEventRepository,
            PeerReviewRepository peerReviewRepository,
            ProblemReviewRepository problemReviewRepository) {
        this.notificationService = notificationService;
        this.masterRepository = masterRepository;
        this.problemRepository = problemRepository;
        this.problemEventRepository = problemEventRepository;
        this.peerReviewRepository = peerReviewRepository;
        this.problemReviewRepository = problemReviewRepository;
    }

    @Transactional
    public ProblemDto reviewProblem(long userId, long problemId, ProblemReviewSaveDto problemReviewSaveDto) {
        Problem problem = getProblem(problemId);
        Master reviewer = getMasterUser(userId);
        checkUserAccessProblem(userId, problem);

        if (problem.getProblemReviews().stream()
                .anyMatch(problemReview -> problemReview.getReviewer().getId().equals(reviewer.getId()))) {
            throw new ResourceConflictException("It is illegal to review a problem more than once by a same user: "
                    + "problem ID = " + problemId + " user ID = " + reviewer.getId());
        }

        ProblemReview problemReview = problemReviewRepository.save(ProblemReview.builder()
                .problem(problem)
                .reviewer(reviewer)
                .score(problemReviewSaveDto.getScore())
                .build());

        for (PeerReviewSaveDto peerReviewSaveDto : problemReviewSaveDto.getPeerReviews()) {
            PeerReview peerReview = peerReviewSaveDto.toPeerReview();
            peerReview.setProblem(problem);
            peerReview.setReviewer(reviewer);
            peerReview.setReviewed(getMasterUser(peerReviewSaveDto.getReviewedId()));
            peerReviewRepository.save(peerReview);
        }

        problemEventRepository.save(ProblemEvent.builder()
                .message(String.format(
                        "استاد «%s» ارزیابی مربوط به جلسه‌ی دفاع را تکمیل نمودند.",
                        reviewer.getFullName()))
                .problem(problem)
                .build());

        notificationService.sendNotification(
                String.format("استاد «%s» ارزیابی مربوط به جلسه‌ی دفاع پایان‌نامه (پروژه) %s را تکمیل کرد.",
                        reviewer.getFullName(), problem.getTitle()),
                problem.getAllParticipants(reviewer.getId()));

        problem.getProblemReviews().add(problemReview);
        if (problem.isAllDoneReview()) {
            // All participant evaluated problem so we update final grade of problem
            problem.getProblemReviews()
                    .stream().mapToDouble(ProblemReview::getScore).average()
                    .ifPresent(problem::setFinalGrade);
        }
        return ProblemDto.from(problemRepository.save(problem));
    }

    @Transactional
    public ProblemDto finalizeProblem(long userId, long problemId, Double finalGrade) {
        Problem problem = getProblem(problemId);
        checkUserAccessProblem(userId, problem);

        if (!problem.isAllDoneReview()) {
            throw new ResourceConflictException("It is illegal to finalize a problem review before all "
                    + "participants reviewed problem: problem ID = " + problemId
                    + " current number Of reviews: " + problem.getProblemReviews().size()
                    + " target number of referees: " + problem.getNumberOfReferees());
        }

        String finalGradePersian = LocaleUtility.convertToPersianDigits(String.format("%.2f", finalGrade));
        problemEventRepository.save(ProblemEvent.builder()
                .message(String.format(
                        "ارزیابی پایان‌نامه (پروژه) توسط استاد راهنما تایید شد. "
                                + "نمره نهایی پایان‌نامه (پروژه) دانشجو %s می‌باشد.",
                        finalGradePersian))
                .problem(problem)
                .build());

        notificationService.sendNotification(
                String.format(
                        "ارزیابی پایان‌نامه (پروژه) %s توسط استاد راهنما تایید شد. "
                                + "نمره نهایی دانشجو %s می‌باشد.",
                        problem.getTitle(), finalGradePersian),
                problem.getAllParticipants(problem.getSupervisor().getId()));

        problem.setFinalGrade(finalGrade);
        problem.setState(ProblemState.COMPLETED);
        return ProblemDto.from(problemRepository.save(problem));
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

    private Master getMasterUser(long userId) {
        return masterRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: ID = " + userId));
    }
}
