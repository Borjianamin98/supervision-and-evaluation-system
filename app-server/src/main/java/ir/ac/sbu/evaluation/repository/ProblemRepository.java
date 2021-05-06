package ir.ac.sbu.evaluation.repository;

import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends PagingAndSortingRepository<Problem, Long> {

    Page<Problem> findAllByStudentIdAndState(long studentId, ProblemState state, Pageable pageable);
}
