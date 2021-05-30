package ir.ac.sbu.evaluation.repository.schedule;

import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleEventRepository extends JpaRepository<ScheduleEvent, Long> {

}
