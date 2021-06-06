package ir.ac.sbu.evaluation.service.schedule;

import ir.ac.sbu.evaluation.dto.schedule.event.DateRangeDto;
import ir.ac.sbu.evaluation.dto.schedule.event.ScheduleEventDto;
import ir.ac.sbu.evaluation.exception.IllegalResourceAccessException;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import ir.ac.sbu.evaluation.model.user.User;
import ir.ac.sbu.evaluation.repository.schedule.MeetScheduleRepository;
import ir.ac.sbu.evaluation.repository.schedule.ScheduleEventRepository;
import ir.ac.sbu.evaluation.repository.user.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScheduleService {

    private final UserRepository userRepository;

    private final MeetScheduleRepository meetScheduleRepository;
    private final ScheduleEventRepository scheduleEventRepository;

    public ScheduleService(UserRepository userRepository,
            MeetScheduleRepository meetScheduleRepository,
            ScheduleEventRepository scheduleEventRepository) {
        this.userRepository = userRepository;
        this.meetScheduleRepository = meetScheduleRepository;
        this.scheduleEventRepository = scheduleEventRepository;
    }

    public List<ScheduleEventDto> retrieveScheduleEvents(long userId, long meetScheduleId,
            Instant startDate, Instant endDate) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);
        checkUserAccessMeetSchedule(userId, meetSchedule);
        List<ScheduleEvent> scheduleEvents = scheduleEventRepository
                .findAllByMeetScheduleIdAndStartDateGreaterThanEqualAndEndDateLessThanEqual(meetScheduleId, startDate,
                        endDate);
        return scheduleEvents.stream().map(ScheduleEventDto::from).collect(Collectors.toList());
    }

    @Transactional
    public ScheduleEventDto addScheduleEvent(long userId, long meetScheduleId,
            DateRangeDto dateRangeDto) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: ID = " + userId));
        checkUserAccessMeetSchedule(userId, meetSchedule);

        ScheduleEvent newScheduleEvent = scheduleEventRepository.save(ScheduleEvent.builder()
                .startDate(dateRangeDto.getStartDate())
                .endDate(dateRangeDto.getEndDate())
                .meetSchedule(meetSchedule)
                .owner(user)
                .build());
        meetSchedule.getScheduleEvents().add(newScheduleEvent);
        meetScheduleRepository.save(meetSchedule);
        return ScheduleEventDto.from(newScheduleEvent);
    }

    @Transactional
    public ScheduleEventDto deleteScheduleEvent(long userId, long meetScheduleId, long scheduleEventId) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);
        ScheduleEvent scheduleEvent = getScheduleEvent(meetScheduleId, scheduleEventId);
        checkUserAccessMeetSchedule(userId, meetSchedule);
        checkUserAccessModifyOrDeleteEvent(userId, scheduleEvent);

        scheduleEventRepository.delete(scheduleEvent);
        meetSchedule.getScheduleEvents().remove(scheduleEvent);
        meetScheduleRepository.save(meetSchedule);
        return ScheduleEventDto.from(scheduleEvent);
    }

    @Transactional
    public ScheduleEventDto updateScheduleEvent(long userId, long meetScheduleId, long scheduleEventId,
            DateRangeDto dateRangeDto) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);
        ScheduleEvent scheduleEvent = getScheduleEvent(meetScheduleId, scheduleEventId);
        checkUserAccessMeetSchedule(userId, meetSchedule);
        checkUserAccessModifyOrDeleteEvent(userId, scheduleEvent);

        scheduleEvent.setStartDate(dateRangeDto.getStartDate());
        scheduleEvent.setEndDate(dateRangeDto.getEndDate());
        ScheduleEvent savedScheduleEvent = scheduleEventRepository.save(scheduleEvent);
        return ScheduleEventDto.from(savedScheduleEvent);
    }

    private void checkUserAccessModifyOrDeleteEvent(long userId, ScheduleEvent scheduleEvent) {
        if (scheduleEvent.getOwner().getId() != userId) {
            throw new IllegalResourceAccessException(
                    "Schedule event is not created by user: user ID = " + userId
                            + " Schedule event ID = " + scheduleEvent.getId()
                            + " schedule event owner: " + scheduleEvent.getOwner().getFullName());
        }
    }

    private void checkUserAccessMeetSchedule(long userId, MeetSchedule meetSchedule) {
        Problem scheduleProblem = meetSchedule.getProblem();
        if (scheduleProblem.getStudent().getId() != userId && scheduleProblem.getSupervisor().getId() != userId
                && scheduleProblem.getReferees().stream().noneMatch(master -> master.getId() == userId)) {
            throw new IllegalResourceAccessException(
                    "Meet schedule is not owned or controlled by user: ID = " + userId
                            + " Schedule ID = " + meetSchedule.getId());
        }
    }

    private MeetSchedule getMeetSchedule(long meetScheduleId) {
        return meetScheduleRepository.findById(meetScheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Meet schedule not found: ID = " + meetScheduleId));
    }

    private ScheduleEvent getScheduleEvent(long meetScheduleId, long scheduleEventId) {
        ScheduleEvent scheduleEvent = scheduleEventRepository.findById(scheduleEventId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule event not found: ID = " + scheduleEventId));
        if (scheduleEvent.getMeetSchedule().getId() != meetScheduleId) {
            throw new IllegalResourceAccessException(
                    String.format("Schedule event selected is not belonging to meet schedule: "
                            + "meet schedule ID = %s schedule event ID = %s", meetScheduleId, scheduleEvent.getId()));
        }
        return scheduleEvent;
    }
}
