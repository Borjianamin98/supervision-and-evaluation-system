package ir.ac.sbu.evaluation.model.schedule;

import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.problem.Problem;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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

    @Column(name = "duration_minutes")
    private Long durationMinutes;

    @Column(name = "minimum_date")
    private Instant minimumDate;

    @Column(name = "maximum_date")
    private Instant maximumDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_state")
    private ScheduleState scheduleState;

    @Column(name = "finalized_date")
    private Instant finalizedDate;

    @OneToOne(mappedBy = "meetSchedule")
    private Problem problem;

    @OneToMany(mappedBy = "meetSchedule")
    private Set<ScheduleEvent> scheduleEvents = new HashSet<>();

    @ElementCollection
    private Set<Long> verifiedUsers = new HashSet<>();

    public MeetSchedule() {
    }

    @Builder
    public MeetSchedule(Long id, Long durationMinutes,
            Instant minimumDate, Instant maximumDate,
            ScheduleState scheduleState, Instant finalizedDate,
            Problem problem, Set<ScheduleEvent> scheduleEvents, Set<Long> verifiedUsers) {
        super(id);
        this.durationMinutes = durationMinutes;
        this.minimumDate = minimumDate;
        this.maximumDate = maximumDate;
        this.scheduleState = scheduleState;
        this.finalizedDate = finalizedDate;
        this.problem = problem;
        this.scheduleEvents = scheduleEvents == null ? new HashSet<>() : scheduleEvents;
        this.verifiedUsers = verifiedUsers == null ? new HashSet<>() : verifiedUsers;
    }

    public void removeVerifyUser(long refereeId) {
        getVerifiedUsers().remove(refereeId);
    }
}
