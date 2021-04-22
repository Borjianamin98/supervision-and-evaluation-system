package ir.ac.sbu.evaluation.service;

import ir.ac.sbu.evaluation.dto.ProblemDto;
import ir.ac.sbu.evaluation.model.Problem;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.MasterRepository;
import ir.ac.sbu.evaluation.repository.ProblemRepository;
import ir.ac.sbu.evaluation.repository.StudentRepository;
import java.util.List;
import java.util.stream.Collectors;
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
        return ProblemDto.from(problemRepository.save(problem));
    }

    public List<ProblemDto> retrieveProblems(long studentUserId) {
        return problemRepository.findAllByStudentId(studentUserId)
                .stream().map(ProblemDto::from)
                .collect(Collectors.toList());
    }
}
