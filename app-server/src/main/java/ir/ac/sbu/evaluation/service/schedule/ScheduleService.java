package ir.ac.sbu.evaluation.service.schedule;

import ir.ac.sbu.evaluation.dto.schedule.event.ScheduleEventCreateDto;
import ir.ac.sbu.evaluation.dto.schedule.event.ScheduleEventInfoDto;
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

    public List<ScheduleEventInfoDto> retrieveScheduleEvents(long userId, long meetScheduleId,
            Instant startDate, Instant endDate) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);
        checkUserAccessMeetSchedule(userId, meetSchedule);
        List<ScheduleEvent> scheduleEvents = scheduleEventRepository
                .findAllByMeetScheduleIdAndStartDateGreaterThanEqualAndEndDateLessThanEqual(meetScheduleId, startDate,
                        endDate);
        return scheduleEvents.stream().map(ScheduleEventInfoDto::from).collect(Collectors.toList());
    }

    @Transactional
    public ScheduleEventInfoDto addScheduleEvent(long userId, long meetScheduleId,
            ScheduleEventCreateDto scheduleEventCreateDto) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: ID = " + userId));
        checkUserAccessMeetSchedule(userId, meetSchedule);

        ScheduleEvent newScheduleEvent = scheduleEventRepository.save(ScheduleEvent.builder()
                .startDate(scheduleEventCreateDto.getStartDate())
                .endDate(scheduleEventCreateDto.getEndDate())
                .meetSchedule(meetSchedule)
                .owner(user)
                .build());
        meetSchedule.getScheduleEvents().add(newScheduleEvent);
        meetScheduleRepository.save(meetSchedule);
        return ScheduleEventInfoDto.from(newScheduleEvent);
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
}
