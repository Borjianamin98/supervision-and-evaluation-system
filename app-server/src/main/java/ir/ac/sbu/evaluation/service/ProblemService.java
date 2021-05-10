package ir.ac.sbu.evaluation.service;

import ir.ac.sbu.evaluation.dto.problem.ProblemDto;
import ir.ac.sbu.evaluation.dto.problem.ProblemEventDto;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.problem.EventRepository;
import ir.ac.sbu.evaluation.repository.problem.ProblemRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProblemService {

    private final EventRepository eventRepository;

    private final StudentRepository studentRepository;
    private final MasterRepository masterRepository;
    private final ProblemRepository problemRepository;

    public ProblemService(EventRepository eventRepository,
            StudentRepository studentRepository,
            MasterRepository masterRepository, ProblemRepository problemRepository) {
        this.eventRepository = eventRepository;
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
        problem.getEvents().add(eventRepository.save(
                ProblemEvent.builder().message("پایان‌نامه (پروژه) تعریف شد.").build()));
        return ProblemDto.from(problemRepository.save(problem));
    }

    public ProblemDto updateProblem(long problemId, ProblemDto problemDto) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found: ID = " + problemId));

        problem.setEducation(problemDto.getEducation());
        problem.setTitle(problemDto.getTitle());
        problem.setEnglishTitle(problemDto.getEnglishTitle());
        problem.setKeywords(problemDto.getKeywords());
        problem.setDefinition(problemDto.getDefinition());
        problem.setHistory(problemDto.getHistory());
        problem.setConsiderations(problemDto.getConsiderations());
        problem.getEvents().add(eventRepository.save(
                ProblemEvent.builder().message("اطلاعات مربوط به مسئله ویرایش شد.").build()));
        return ProblemDto.from(problemRepository.save(problem));
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
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found: ID = " + problemId));

        ProblemEvent savedEvent = eventRepository.save(comment.toProblemEvent());
        problem.getEvents().add(savedEvent);
        problemRepository.save(problem);

        return ProblemEventDto.from(savedEvent);
    }
}
