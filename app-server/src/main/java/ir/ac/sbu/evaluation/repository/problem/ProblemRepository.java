package ir.ac.sbu.evaluation.repository.problem;

import ir.ac.sbu.evaluation.dto.report.RefereeReportItemDto;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemState;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends PagingAndSortingRepository<Problem, Long> {

    Page<Problem> findAllByStudentIdAndState(long studentId, ProblemState state, Pageable pageable);

    @Query("select distinct u from Problem u left join u.referees r "
            + "where (u.supervisor.id = :masterId or r.id = :masterId) and u.state = :state")
    Page<Problem> findAllAssignedForMasterAndState(
            @Param("masterId") long masterId,
            @Param("state") ProblemState state,
            Pageable pageable);

    @Query("select " +
            "distinct new ir.ac.sbu.evaluation.dto.report.RefereeReportItemDto("
            + " p.student.faculty.university.name,"
            + " count(distinct p.id),"
            + " sum(case when p.supervisor.id = :masterId then 1 else 0 end),"
            + " sum(case when r.id = :masterId then 1 else 0 end)) " +
            "from Problem p left join p.referees r " +
            "where p.state = :state " +
            "group by p.student.faculty.university.name")
    Page<RefereeReportItemDto> masterProblemRefereeReport(
            @Param("masterId") long masterId,
            @Param("state") ProblemState state,
            Pageable pageable);
}
