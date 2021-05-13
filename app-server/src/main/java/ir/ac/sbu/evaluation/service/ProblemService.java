package ir.ac.sbu.evaluation.service;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.dto.problem.ProblemEventDto;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.exception.IllegalResourceAccessException;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.problem.ProblemEventRepository;
import ir.ac.sbu.evaluation.repository.problem.ProblemRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProblemService {

    private final ProblemEventRepository problemEventRepository;

    private final StudentRepository studentRepository;
    private final MasterRepository masterRepository;
    private final ProblemRepository problemRepository;

    public ProblemService(ProblemEventRepository problemEventRepository,
            StudentRepository studentRepository,
            MasterRepository masterRepository, ProblemRepository problemRepository) {
        this.problemEventRepository = problemEventRepository;
        this.studentRepository = studentRepository;
        this.masterRepository = masterRepository;
        this.problemRepository = problemRepository;
    }

    @Transactional
    public ProblemDto addProblem(long studentUserId, ProblemDto problemDto) {
        Student student = studentRepository.findById(studentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Student with given ID not found: " + studentUserId));
        Master supervisor = masterRepository.findByUsername(problemDto.getSupervisor().getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Master with given username not found: "
                        + problemDto.getSupervisor().getUsername()));

        Problem problem = problemDto.toProblem();
        problem.setStudent(student);
        problem.setSupervisor(supervisor);
        problem.setState(ProblemState.CREATED);
        problem.getEvents().add(problemEventRepository.save(
                ProblemEvent.builder().message("پایان‌نامه (پروژه) تعریف شد.").build()));
        return ProblemDto.from(problemRepository.save(problem));
    }

    @Transactional
    public ProblemDto updateStudentProblem(long studentId, long problemId, ProblemDto problemDto) {
        Problem problem = getProblem(problemId);
        if (problem.getStudent().getId() != studentId) {
            throw new IllegalResourceAccessException("Problem is not belong to student: " + studentId);
        }

        problem.setEducation(problemDto.getEducation());
        problem.setTitle(problemDto.getTitle());
        problem.setEnglishTitle(problemDto.getEnglishTitle());
        problem.setKeywords(problemDto.getKeywords());
        problem.setDefinition(problemDto.getDefinition());
        problem.setHistory(problemDto.getHistory());
        problem.setConsiderations(problemDto.getConsiderations());
        problem.getEvents().add(problemEventRepository.save(
                ProblemEvent.builder().message("اطلاعات مربوط به مسئله ویرایش شد.").build()));
        return ProblemDto.from(problemRepository.save(problem));
    }

    @Transactional
    public ProblemDto abandonProblem(long userId, long problemId) {
        Problem problem = getProblem(problemId);
        if (problem.getStudent().getId() != userId && problem.getSupervisor().getId() != userId) {
            throw new IllegalResourceAccessException(
                    "Problem is not belong to student or supervisor: ID = " + userId + " Problem ID = " + problemId);
        }

        problem.setState(ProblemState.ABANDONED);
        problem.getEvents().add(problemEventRepository.save(
                ProblemEvent.builder().message("مسئله به وضعیت لغو شده تغییر کرد.").build()));
        return ProblemDto.from(problemRepository.save(problem));
    }

    @Transactional
    public ProblemDto initialApprovalOfProblem(long userId, long problemId) {
        Problem problem = getProblem(problemId);
        if (problem.getSupervisor().getId() != userId) {
            throw new IllegalResourceAccessException(
                    "Problem is not controlled by master user: ID = " + userId + " Problem ID = " + problemId);
        }

        problem.setState(ProblemState.IN_PROGRESS);
        problem.getEvents().add(problemEventRepository.save(
                ProblemEvent.builder().message("مسئله تایید اولیه شد.").build()));
        return ProblemDto.from(problemRepository.save(problem));
    }

    public ProblemDto retrieveProblem(long userId, long problemId) {
        Problem problem = getProblem(problemId);
        checkUserAccessProblem(userId, problem);
        return ProblemDto.from(problem);
    }

    public Page<ProblemDto> retrieveProblemsOfStudents(long studentUserId, ProblemState problemState,
            Pageable pageable) {
        return problemRepository.findAllByStudentIdAndState(studentUserId, problemState, pageable)
                .map(ProblemDto::from);
    }

    public Page<ProblemDto> retrieveMasterAssignedProblems(long masterUserId, ProblemState problemState,
            Pageable pageable) {
        return problemRepository
                .findAllAssignedForMasterAndState(masterUserId, problemState, pageable)
                .map(ProblemDto::from);
    }

    @Transactional
    public ProblemEventDto placeCommentOnProblem(long problemId, ProblemEventDto comment) {
        Problem problem = getProblem(problemId);

        ProblemEvent savedEvent = problemEventRepository.save(comment.toProblemEvent());
        problem.getEvents().add(savedEvent);
        problemRepository.save(problem);

        return ProblemEventDto.from(savedEvent);
    }

    public Page<ProblemEventDto> retrieveProblemEvents(long userId, long problemId, Pageable pageable) {
        Problem problem = getProblem(problemId);
        checkUserAccessProblem(userId, problem);
        return problemEventRepository.findAllByProblemId(problemId, pageable).map(ProblemEventDto::from);
    }

    private void checkUserAccessProblem(long userId, Problem problem) {
        if (problem.getStudent().getId() != userId && problem.getSupervisor().getId() != userId
                && problem.getReferees().stream().noneMatch(master -> master.getId() == userId)) {
            throw new IllegalResourceAccessException(
                    "Problem is not owned or controlled by user: ID = " + userId + " Problem ID = " + problem.getId());
        }
    }

    private Problem getProblem(long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found: ID = " + problemId));
    }
}
