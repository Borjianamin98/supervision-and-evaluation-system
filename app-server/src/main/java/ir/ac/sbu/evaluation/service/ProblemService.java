package ir.ac.sbu.evaluation.service;

import ir.ac.sbu.evaluation.dto.ProblemDto;
import ir.ac.sbu.evaluation.model.Problem;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.ProblemRepository;
import ir.ac.sbu.evaluation.repository.StudentRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProblemService {

    private final StudentRepository studentRepository;
    private final ProblemRepository problemRepository;

    public ProblemService(StudentRepository studentRepository, ProblemRepository problemRepository) {
        this.studentRepository = studentRepository;
        this.problemRepository = problemRepository;
    }

    @Transactional
    public ProblemDto addProblem(long studentUserId, ProblemDto problemDto) {
        Student student = studentRepository.findById(studentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Student with given ID not found: " + studentUserId));

        Problem problem = problemDto.toProblem();
        problem.setStudent(student);
        return ProblemDto.from(problemRepository.save(problem));
    }

    public List<ProblemDto> retrieveProblems(long studentUserId) {
        return problemRepository.findAllByStudentId(studentUserId)
                .stream().map(ProblemDto::from)
                .collect(Collectors.toList());
    }
}
