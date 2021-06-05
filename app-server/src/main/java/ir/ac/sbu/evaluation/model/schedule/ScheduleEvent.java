package ir.ac.sbu.evaluation.model.schedule;

import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.user.User;
import java.time.Instant;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "schedule_event")
public class ScheduleEvent extends BaseEntity {

    @Column(name = "start_date")
    private Instant startDate; // ISO-8601 representation

    @Column(name = "end_date")
    private Instant endDate; // ISO-8601 representation

    @OneToOne
    @JoinColumn(name = "owner", referencedColumnName = "id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "meetSchedule_eventSchedule")
    private MeetSchedule meetSchedule;

    public ScheduleEvent() {
    }

    @Builder
    public ScheduleEvent(Long id, Instant startDate, Instant endDate,
            User owner, MeetSchedule meetSchedule) {
        super(id);
        this.startDate = startDate;
        this.endDate = endDate;
        this.owner = owner;
        this.meetSchedule = meetSchedule;
    }
}
