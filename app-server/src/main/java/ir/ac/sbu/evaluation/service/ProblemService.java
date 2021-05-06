package ir.ac.sbu.evaluation.service;

import ir.ac.sbu.evaluation.dto.ProblemDto;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.Problem;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.ProblemRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProblemService {

    private final StudentRepository studentRepository;
    private final MasterRepository masterRepository;
    private final ProblemRepository problemRepository;

    public ProblemService(StudentRepository studentRepository,
            MasterRepository masterRepository, ProblemRepository problemRepository) {
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
                        + problemDto.getSupervisor()));

        Problem problem = problemDto.toProblem();
        problem.setStudent(student);
        problem.setSupervisor(supervisor);
        problem.setState(ProblemState.CREATED);
        return ProblemDto.from(problemRepository.save(problem));
    }

    public Page<ProblemDto> retrieveProblems(long studentUserId, ProblemState problemState, Pageable pageable) {
        return problemRepository.findAllByStudentIdAndState(studentUserId, problemState, pageable)
                .map(ProblemDto::from);
    }
}
