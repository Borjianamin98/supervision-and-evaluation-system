package ir.ac.sbu.evaluation.repository;

import ir.ac.sbu.evaluation.model.Problem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findAllByStudentId(long studentId);
}
