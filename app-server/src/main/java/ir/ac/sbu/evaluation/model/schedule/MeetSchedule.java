package ir.ac.sbu.evaluation.model.schedule;

import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "meet_schedule")
public class MeetSchedule extends BaseEntity {

    @OneToMany(mappedBy = "schedule")
    private Set<ScheduleEvent> scheduleEvents = new HashSet<>();

    @OneToOne(mappedBy = "schedule")
    private Problem problem;

    public MeetSchedule() {
    }

    @Builder
    public MeetSchedule(Long id, Set<ScheduleEvent> scheduleEvents, Problem problem) {
        super(id);
        this.scheduleEvents = scheduleEvents == null ? new HashSet<>() : scheduleEvents;
        this.problem = problem;
    }
}
