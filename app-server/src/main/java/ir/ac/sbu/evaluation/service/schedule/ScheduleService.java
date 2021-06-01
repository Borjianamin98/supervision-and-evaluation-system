package ir.ac.sbu.evaluation.service.schedule;

import ir.ac.sbu.evaluation.dto.schedule.ScheduleEventDto;
import ir.ac.sbu.evaluation.exception.IllegalResourceAccessException;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import ir.ac.sbu.evaluation.repository.schedule.MeetScheduleRepository;
import ir.ac.sbu.evaluation.repository.schedule.ScheduleEventRepository;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ScheduleService {

    private final MeetScheduleRepository meetScheduleRepository;
    private final ScheduleEventRepository scheduleEventRepository;

    public ScheduleService(MeetScheduleRepository meetScheduleRepository,
            ScheduleEventRepository scheduleEventRepository) {
        this.meetScheduleRepository = meetScheduleRepository;
        this.scheduleEventRepository = scheduleEventRepository;
    }

    public List<ScheduleEventDto> retrieveScheduleEvents(long userId, long scheduleId,
            Instant startDate, Instant endDate) {
        MeetSchedule meetSchedule = getMeetSchedule(scheduleId);
        checkUserAccessMeetSchedule(userId, meetSchedule);
        List<ScheduleEvent> scheduleEvents = scheduleEventRepository
                .findAllByScheduleIdAndStartDateGreaterThanEqualAndEndDateLessThanEqual(scheduleId, startDate, endDate);
        return scheduleEvents.stream().map(ScheduleEventDto::from).collect(Collectors.toList());
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
