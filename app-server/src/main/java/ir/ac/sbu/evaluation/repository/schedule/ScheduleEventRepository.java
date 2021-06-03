package ir.ac.sbu.evaluation.repository.schedule;

import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleEventRepository extends JpaRepository<ScheduleEvent, Long> {

    List<ScheduleEvent> findAllByMeetScheduleIdAndStartDateGreaterThanEqualAndEndDateLessThanEqual(long meetScheduleId,
            Instant startDate, Instant endDate);
}
