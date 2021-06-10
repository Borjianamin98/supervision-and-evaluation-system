package ir.ac.sbu.evaluation.service.problem;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.dto.problem.ProblemSaveDto;
import ir.ac.sbu.evaluation.dto.problem.event.ProblemEventDto;
import ir.ac.sbu.evaluation.dto.problem.event.ProblemEventSaveDto;
import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleDto;
import ir.ac.sbu.evaluation.exception.IllegalResourceAccessException;
import ir.ac.sbu.evaluation.exception.ResourceConflictException;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import ir.ac.sbu.evaluation.model.problem.ProblemState;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import ir.ac.sbu.evaluation.model.schedule.ScheduleState;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.problem.ProblemEventRepository;
import ir.ac.sbu.evaluation.repository.problem.ProblemRepository;
import ir.ac.sbu.evaluation.repository.schedule.MeetScheduleRepository;
import ir.ac.sbu.evaluation.repository.schedule.ScheduleEventRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import ir.ac.sbu.evaluation.security.SecurityRoles;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProblemService {

    private final StudentRepository studentRepository;
    private final MasterRepository masterRepository;
    private final ProblemRepository problemRepository;

    private final ProblemEventRepository problemEventRepository;
    private final MeetScheduleRepository meetScheduleRepository;
    private final ScheduleEventRepository scheduleEventRepository;

    public ProblemService(StudentRepository studentRepository,
            MasterRepository masterRepository, ProblemRepository problemRepository,
            ProblemEventRepository problemEventRepository,
            MeetScheduleRepository meetScheduleRepository,
            ScheduleEventRepository scheduleEventRepository) {
        this.studentRepository = studentRepository;
        this.masterRepository = masterRepository;
        this.problemRepository = problemRepository;
        this.problemEventRepository = problemEventRepository;
        this.meetScheduleRepository = meetScheduleRepository;
        this.scheduleEventRepository = scheduleEventRepository;
    }

    @Transactional
    public ProblemDto addProblem(long studentUserId, ProblemSaveDto problemSaveDto) {
        Student student = studentRepository.findById(studentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: ID = " + studentUserId));
        Master supervisor = masterRepository.findById(problemSaveDto.getSupervisorId())
                .orElseThrow(() -> new IllegalArgumentException("Master not found: ID = "
                        + problemSaveDto.getSupervisorId()));

        Problem problem = problemSaveDto.toProblem();
        problem.setStudent(student);
        problem.setSupervisor(supervisor);
        problem.setState(ProblemState.CREATED);
        problem.getEvents().add(problemEventRepository.save(
                ProblemEvent.builder().message("پایان‌نامه (پروژه) تعریف شد.").build()));
        Problem savedProblem = problemRepository.save(problem);

        MeetSchedule meetSchedule = meetScheduleRepository.save(MeetSchedule.builder()
                .durationMinutes(30L)
                .minimumDate(Instant.now())
                .maximumDate(Instant.now())
                .scheduleState(ScheduleState.CREATED)
                .problem(savedProblem)
                .build());
        savedProblem.setMeetSchedule(meetSchedule);
        savedProblem = problemRepository.save(savedProblem);
        return ProblemDto.from(savedProblem);
    }

    @Transactional
    public ProblemDto updateProblem(long studentId, long problemId, ProblemSaveDto problemSaveDto) {
        Problem problem = getProblem(problemId);
        if (problem.getStudent().getId() != studentId) {
            throw new IllegalResourceAccessException("Problem is not belong to student: " + studentId);
        }

        problem.setEducation(problemSaveDto.getEducation());
        problem.setTitle(problemSaveDto.getTitle());
        problem.setEnglishTitle(problemSaveDto.getEnglishTitle());
        problem.setKeywords(problemSaveDto.getKeywords());
        problem.setDefinition(problemSaveDto.getDefinition());
        problem.setHistory(problemSaveDto.getHistory());
        problem.setConsiderations(problemSaveDto.getConsiderations());
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
        ProblemEvent savedProblemEvent = problemEventRepository.save(ProblemEvent.builder()
                .message("مسئله تایید اولیه شد.").problem(problem).build());
        problem.getEvents().add(savedProblemEvent);
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
    public ProblemEventDto addProblemEvent(long userId, long problemId, ProblemEventSaveDto problemEventSaveDto) {
        Problem problem = getProblem(problemId);
        checkUserAccessProblem(userId, problem);

        ProblemEvent problemEvent = problemEventSaveDto.toProblemEvent();
        problemEvent.setProblem(problem);
        ProblemEvent savedProblemEvent = problemEventRepository.save(problemEvent);
        problem.getEvents().add(savedProblemEvent);
        problemRepository.save(problem);

        return ProblemEventDto.from(savedProblemEvent);
    }

    public Page<ProblemEventDto> retrieveProblemEvents(long userId, long problemId, Pageable pageable) {
        Problem problem = getProblem(problemId);
        checkUserAccessProblem(userId, problem);
        return problemEventRepository.findAllByProblemId(problemId, pageable).map(ProblemEventDto::from);
    }

    public MeetScheduleDto retrieveProblemSchedule(long userId, long problemId) {
        Problem problem = getProblem(problemId);
        checkUserAccessProblem(userId, problem);
        if (problem.getMeetSchedule() == null) {
            throw new ResourceNotFoundException("No schedule found for problem: id = " + problemId);
        }
        return MeetScheduleDto.from(problem.getMeetSchedule());
    }

    @Transactional
    public ProblemDto addReferee(long userId, long problemId, long refereeId) {
        Problem problem = getProblem(problemId);
        checkUserAccessProblem(userId, problem, Collections.singletonList(SecurityRoles.MASTER_ROLE_NAME));
        if (problem.getSupervisor().getId() != userId) {
            throw new IllegalResourceAccessException("Delete referee of problem is only available for supervisor: "
                    + "problem ID = " + problemId);
        }

        Master referee = masterRepository.findById(refereeId)
                .orElseThrow(() -> new ResourceNotFoundException("Master not found: ID = " + refereeId));
        if (problem.getReferees().contains(referee)) {
            throw new IllegalArgumentException("Problem already contains user as referee: "
                    + "problem ID = " + problemId + " referee ID = " + refereeId);
        }

        problem.getReferees().add(referee);
        Problem savedProblem = problemRepository.save(problem);
        referee.getProblemsReferee().add(savedProblem);
        masterRepository.save(referee);

        String message = String.format("استاد «%s» به لیست داورهای مسئله اضافه شد.", referee.getFullName());
        ProblemEvent savedProblemEvent = problemEventRepository.save(ProblemEvent.builder()
                .message(message).problem(problem).build());
        problem.getEvents().add(savedProblemEvent);

        return ProblemDto.from(savedProblem);
    }

    @Transactional
    public ProblemDto deleteReferee(long userId, long problemId, long refereeId, boolean forceToRemove) {
        Problem problem = getProblem(problemId);
        checkUserAccessProblem(userId, problem, Collections.singletonList(SecurityRoles.MASTER_ROLE_NAME));
        if (problem.getSupervisor().getId() != userId) {
            throw new IllegalResourceAccessException("Delete referee of problem is only available for supervisor: "
                    + "problem ID = " + problemId);
        }

        Optional<Master> refereeToRemove = problem.getReferees().stream()
                .filter(master -> master.getId() == refereeId)
                .findFirst();
        if (!refereeToRemove.isPresent()) {
            throw new ResourceNotFoundException("Referee not found or not belong to problem: "
                    + "problem ID = " + problemId + " referee ID = " + refereeId);
        }

        List<ScheduleEvent> problemScheduleEventsByReferee = scheduleEventRepository
                .findAllByOwnerIdAndMeetSchedule_Problem_Id(refereeId, problemId);
        if (!forceToRemove && !problemScheduleEventsByReferee.isEmpty()) {
            throw new ResourceConflictException("Unable to remove referee because of some schedule event dependencies: "
                    + "schedule events count = " + problemScheduleEventsByReferee.size());
        } else {
            problem.getMeetSchedule().removeVerifyUser(refereeId);
            problem.setMeetSchedule(meetScheduleRepository.save(problem.getMeetSchedule()));
            problemScheduleEventsByReferee.forEach(scheduleEventRepository::delete);
        }

        Master referee = refereeToRemove.get();
        problem.getReferees().remove(referee);
        Problem savedProblem = problemRepository.save(problem);
        referee.getProblemsReferee().removeIf(p -> p.getId().equals(savedProblem.getId()));
        masterRepository.save(referee);

        String message = String.format("استاد داور «%s» حذف شد.", referee.getFullName());
        ProblemEvent savedProblemEvent = problemEventRepository.save(ProblemEvent.builder()
                .message(message).problem(problem).build());
        problem.getEvents().add(savedProblemEvent);

        return ProblemDto.from(savedProblem);
    }

    private void checkUserAccessProblem(long userId, Problem problem) {
        checkUserAccessProblem(userId, problem,
                Arrays.asList(SecurityRoles.STUDENT_ROLE_NAME, SecurityRoles.MASTER_ROLE_NAME));
    }

    private void checkUserAccessProblem(long userId, Problem problem, List<String> accessibleRoles) {
        if (accessibleRoles.contains(SecurityRoles.STUDENT_ROLE_NAME) &&
                problem.getStudent().getId() == userId) {
            return;
        } else if (accessibleRoles.contains(SecurityRoles.MASTER_ROLE_NAME)
                && (problem.getSupervisor().getId() == userId
                || problem.getReferees().stream().anyMatch(master -> master.getId() == userId))) {
            return;
        }
        throw new IllegalResourceAccessException(
                "Problem is not accessible by user: ID = " + userId + " Problem ID = " + problem.getId());
    }

    private Problem getProblem(long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found: ID = " + problemId));
    }
}
