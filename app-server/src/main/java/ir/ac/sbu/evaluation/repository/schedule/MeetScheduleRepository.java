package ir.ac.sbu.evaluation.repository.schedule;

import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetScheduleRepository extends JpaRepository<MeetSchedule, Long> {

}
