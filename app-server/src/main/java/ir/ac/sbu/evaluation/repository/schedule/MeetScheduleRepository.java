package ir.ac.sbu.evaluation.repository.schedule;

import ir.ac.sbu.evaluation.model.problem.ProblemState;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.schedule.MeetScheduleState;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetScheduleRepository extends JpaRepository<MeetSchedule, Long> {

    @Query("select distinct m from MeetSchedule m left join m.problem p left join p.referees r "
            + "where p.state = :problemState and m.state = :meetScheduleState and "
            + "(p.student.id in :userIds or p.supervisor.id in :userIds or r.id in :userIds)")
    List<MeetSchedule> findAllMeetScheduleIncludeAnyOfUsersAsParticipant(
            @Param("problemState") ProblemState problemState,
            @Param("meetScheduleState") MeetScheduleState meetScheduleState,
            @Param("userIds") Set<Long> userIds);
}
