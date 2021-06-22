package ir.ac.sbu.evaluation.model.schedule;

import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.problem.Problem;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
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
    @Column(name = "state")
    private MeetScheduleState state;

    @Column(name = "finalized_date")
    private Instant finalizedDate;

    @OneToOne(mappedBy = "meetSchedule")
    private Problem problem;

    @OneToMany(mappedBy = "meetSchedule")
    private Set<ScheduleEvent> scheduleEvents = new HashSet<>();

    @ElementCollection
    private Set<Long> announcedUsers = new HashSet<>();

    public MeetSchedule() {
    }

    @Builder
    public MeetSchedule(Long id,
            Long durationMinutes,
            Instant minimumDate,
            Instant maximumDate,
            MeetScheduleState state,
            Instant finalizedDate,
            Problem problem,
            Set<ScheduleEvent> scheduleEvents,
            Set<Long> announcedUsers) {
        super(id);
        this.durationMinutes = durationMinutes;
        this.minimumDate = minimumDate;
        this.maximumDate = maximumDate;
        this.state = state;
        this.finalizedDate = finalizedDate;
        this.problem = problem;
        this.scheduleEvents = scheduleEvents == null ? new HashSet<>() : scheduleEvents;
        this.announcedUsers = announcedUsers == null ? new HashSet<>() : announcedUsers;
    }

    public String getDurationInfo() {
        String[] persianDurationNames = new String[]{"۳۰ دقیقه", "یک ساعت", "یک ساعت و ۳۰ دقیقه", "دو ساعت"};
        if (durationMinutes < 30 || durationMinutes > 120) {
            throw new IllegalStateException(
                    "Schedule duration should be between 30 to 120 minutes: " + durationMinutes);
        }
        return persianDurationNames[(int) (durationMinutes / 30) - 1];
    }

    public Instant getEndOfFinalizedDate() {
        return finalizedDate.plus(durationMinutes, ChronoUnit.MINUTES);
    }

    public Set<Long> getParticipants() {
        Set<Long> participants = new HashSet<>();
        participants.add(problem.getStudent().getId());
        participants.add(problem.getSupervisor().getId());
        participants.addAll(problem.getReferees().stream().map(BaseEntity::getId).collect(Collectors.toSet()));
        return participants;
    }
}
