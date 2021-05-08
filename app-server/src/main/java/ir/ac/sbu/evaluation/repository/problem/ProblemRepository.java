package ir.ac.sbu.evaluation.repository.problem;

import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.problem.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends PagingAndSortingRepository<Problem, Long> {

    Page<Problem> findAllByStudentIdAndState(long studentId, ProblemState state, Pageable pageable);

    @Query("select u from Problem u left join u.referees r "
            + "where (u.supervisor.id = :masterId or r.id = :masterId) and u.state = :state")
    Page<Problem> findAllAssignedForMasterAndState(
            @Param("masterId") long masterId,
            @Param("state") ProblemState state,
            Pageable pageable);

}
