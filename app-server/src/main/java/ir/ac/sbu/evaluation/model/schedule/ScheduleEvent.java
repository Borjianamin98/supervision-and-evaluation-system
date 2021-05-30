package ir.ac.sbu.evaluation.model.schedule;

import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.user.User;
import java.time.Instant;
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

    @Column(name = "subject")
    private String subject;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "is_all_day")
    private boolean isAllDay;

    @OneToOne
    @JoinColumn(name = "owner", referencedColumnName = "id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "event_meet")
    private MeetSchedule schedule;

    public ScheduleEvent() {
    }

    @Builder
    public ScheduleEvent(Long id, String subject, Instant startDate, Instant endDate, boolean isAllDay,
            User owner) {
        super(id);
        this.subject = subject;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isAllDay = isAllDay;
        this.owner = owner;
    }
}
