package ir.ac.sbu.evaluation.repository.problem;

import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<ProblemEvent, Long> {

}
