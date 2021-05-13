package ir.ac.sbu.evaluation.repository.problem;

import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemEventRepository extends JpaRepository<ProblemEvent, Long> {

    Page<ProblemEvent> findAllByProblemId(long problemId, Pageable pageable);

}
