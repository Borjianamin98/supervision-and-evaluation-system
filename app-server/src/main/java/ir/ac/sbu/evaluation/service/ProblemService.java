package ir.ac.sbu.evaluation.service;

import ir.ac.sbu.evaluation.dto.ProblemDto;
import ir.ac.sbu.evaluation.repository.ProblemRepository;
import org.springframework.stereotype.Service;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public void addProblem(long studentId, ProblemDto problemDto) {

    }
}
