package ir.ac.sbu.evaluation.service.schedule;

import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleDto;
import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleSaveDto;
import ir.ac.sbu.evaluation.dto.schedule.event.DateRangeDto;
import ir.ac.sbu.evaluation.dto.schedule.event.ScheduleEventDto;
import ir.ac.sbu.evaluation.exception.IllegalResourceAccessException;
import ir.ac.sbu.evaluation.exception.ResourceConflictException;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import ir.ac.sbu.evaluation.model.problem.ProblemState;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import ir.ac.sbu.evaluation.model.schedule.ScheduleState;
import ir.ac.sbu.evaluation.model.user.User;
import ir.ac.sbu.evaluation.repository.problem.ProblemEventRepository;
import ir.ac.sbu.evaluation.repository.schedule.MeetScheduleRepository;
import ir.ac.sbu.evaluation.repository.schedule.ScheduleEventRepository;
import ir.ac.sbu.evaluation.repository.user.UserRepository;
import ir.ac.sbu.evaluation.utility.DateUtility;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScheduleService {

    private final UserRepository userRepository;

    private final ProblemEventRepository problemEventRepository;

    private final MeetScheduleRepository meetScheduleRepository;
    private final ScheduleEventRepository scheduleEventRepository;

    public ScheduleService(UserRepository userRepository,
            ProblemEventRepository problemEventRepository,
            MeetScheduleRepository meetScheduleRepository,
            ScheduleEventRepository scheduleEventRepository) {
        this.userRepository = userRepository;
        this.problemEventRepository = problemEventRepository;
        this.meetScheduleRepository = meetScheduleRepository;
        this.scheduleEventRepository = scheduleEventRepository;
    }

    public List<ScheduleEventDto> retrieveScheduleEvents(long userId, long meetScheduleId, Instant startDate,
            Instant endDate) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);
        checkUserAccessMeetSchedule(userId, meetSchedule);

        if (startDate.isBefore(meetSchedule.getMinimumDate()) && endDate.isAfter(meetSchedule.getMaximumDate())) {
            return Collections.emptyList();
        }
        Instant start = startDate.isBefore(meetSchedule.getMinimumDate()) ? meetSchedule.getMinimumDate() : startDate;
        Instant end = endDate.isAfter(meetSchedule.getMaximumDate()) ? meetSchedule.getMaximumDate() : endDate;
        List<ScheduleEvent> scheduleEvents = scheduleEventRepository
                .findAllByMeetScheduleIdAndStartDateGreaterThanEqualAndEndDateLessThanEqual(meetScheduleId, start, end);
        return scheduleEvents.stream().map(ScheduleEventDto::from).collect(Collectors.toList());
    }

    @Transactional
    public ScheduleEventDto addScheduleEvent(long userId, long meetScheduleId, DateRangeDto dateRangeDto) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: ID = " + userId));
        checkUserAccessMeetSchedule(userId, meetSchedule);

        ScheduleEvent newScheduleEvent = scheduleEventRepository
                .save(ScheduleEvent.builder().startDate(dateRangeDto.getStartDate()).endDate(dateRangeDto.getEndDate())
                        .meetSchedule(meetSchedule).owner(user).build());
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

    @Transactional
    public MeetScheduleDto startMeetSchedule(long userId, long meetScheduleId,
            MeetScheduleSaveDto meetScheduleSaveDto) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);

        Problem scheduleProblem = meetSchedule.getProblem();
        checkUserIsSupervisor(userId, scheduleProblem);
        checkMeetScheduleState(meetSchedule, ScheduleState.CREATED);
        long durationMinutes = meetScheduleSaveDto.getDurationMinutes();
        if (durationMinutes % 30 != 0) {
            throw new IllegalArgumentException("Invalid duration value for a meet schedule: ID = " + meetScheduleId
                    + " duration = " + durationMinutes);
        }

        problemEventRepository.save(ProblemEvent.builder()
                .message(
                        "زمان‌بندی دفاع پایان‌نامه (پروژه) شروع شده است. خواهشا تمامی اعضای مربوطه زمان‌های حضور خود "
                                + "را برای برگزاری جلسه‌ی دفاع مشخص نمایند.")
                .problem(scheduleProblem).build());

        meetSchedule.setDurationMinutes(durationMinutes);
        meetSchedule.setMinimumDate(DateUtility.getStartOfDay(meetScheduleSaveDto.getMinimumDate()));
        meetSchedule.setMaximumDate(DateUtility.getEndOfDay(meetScheduleSaveDto.getMaximumDate()));
        meetSchedule.setScheduleState(ScheduleState.STARTED);
        return MeetScheduleDto.from(meetScheduleRepository.save(meetSchedule));
    }

    @Transactional
    public MeetScheduleDto updateMeetScheduleDate(long userId, long meetScheduleId, DateRangeDto dateRangeDto) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);

        Problem scheduleProblem = meetSchedule.getProblem();
        checkUserIsSupervisor(userId, scheduleProblem);
        checkMeetScheduleState(meetSchedule, ScheduleState.STARTED);

        problemEventRepository.save(ProblemEvent.builder()
                .message(
                        "زمان‌بندی دفاع پایان‌نامه (پروژه) به درخواست استاد راهنما تغییر یافته است. خواهشا تمامی "
                                + "اعضای مربوطه زمان‌های حضور خود را برای برگزاری جلسه‌ی دفاع در زمان‌بندی جدید مشخص "
                                + "نمایند.")
                .problem(scheduleProblem).build());

        meetSchedule.setMinimumDate(DateUtility.getStartOfDay(dateRangeDto.getStartDate()));
        meetSchedule.setMaximumDate(DateUtility.getEndOfDay(dateRangeDto.getEndDate()));
        return MeetScheduleDto.from(meetScheduleRepository.save(meetSchedule));
    }

    @Transactional
    public MeetScheduleDto announceFinalizationByUser(long userId, long meetScheduleId) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);
        checkUserAccessMeetSchedule(userId, meetSchedule);
        checkMeetScheduleState(meetSchedule, ScheduleState.STARTED);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: ID = " + userId));
        problemEventRepository.save(ProblemEvent.builder()
                .message(String.format("زمان‌بندی دفاع پایان‌نامه (پروژه) توسط «%s» نهایی شد.", user.getFullName()))
                .problem(meetSchedule.getProblem())
                .build());

        meetSchedule.getAnnouncedUsers().add(userId);
        return MeetScheduleDto.from(meetScheduleRepository.save(meetSchedule));
    }

    @Transactional
    public MeetScheduleDto rescheduleMeetSchedule(long userId, long meetScheduleId) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);

        Problem scheduleProblem = meetSchedule.getProblem();
        checkUserIsSupervisor(userId, scheduleProblem);
        checkMeetScheduleState(meetSchedule, ScheduleState.STARTED);

        problemEventRepository.save(ProblemEvent.builder()
                .message(
                        "با توجه به زمان‌های اعلام‌شده توسط اساتید، زمان مشترکی برای برگزاری جلسه دفاع یافت نشد. به "
                                + "همین منظور زمان‌بندی بازنشانی شد تا تمامی افراد زمان‌های خود را بررسی و در صورت "
                                + "امکان مواردی را تغییر دهند.")
                .problem(meetSchedule.getProblem())
                .build());

        meetSchedule.setAnnouncedUsers(new HashSet<>());
        return MeetScheduleDto.from(meetScheduleRepository.save(meetSchedule));
    }

    @Transactional
    public MeetScheduleDto finalizeMeetSchedule(long userId, long meetScheduleId, Instant finalizedDateStart) {
        MeetSchedule meetSchedule = getMeetSchedule(meetScheduleId);

        Problem scheduleProblem = meetSchedule.getProblem();
        checkUserIsSupervisor(userId, scheduleProblem);
        checkMeetScheduleState(meetSchedule, ScheduleState.STARTED);

        // Finalized date should be between min and max date of meet schedule
        Instant finalizedDateEnd = finalizedDateStart.plus(meetSchedule.getDurationMinutes(), ChronoUnit.MINUTES);
        if (finalizedDateStart.isBefore(meetSchedule.getMinimumDate()) ||
                finalizedDateEnd.isAfter(meetSchedule.getMaximumDate())) {
            throw new IllegalArgumentException("Schedule finalization date should be between minimum and maximum date:"
                    + " finalized date = " + finalizedDateStart
                    + " minimum date = " + meetSchedule.getMinimumDate()
                    + " maximum date = " + meetSchedule.getMaximumDate());
        }
        // Finalized date time should be between 8 AM to 8 PM
        LocalDateTime localDateTime = DateUtility.convert(finalizedDateStart);
        int hour = localDateTime.getHour();
        int minimumHour = 8;
        if (!localDateTime.isAfter(DateUtility.convert(DateUtility.getEndOfDay(Instant.now())))) {
            // Selected finalize date is in today date time
            minimumHour = Math.max(8, LocalDateTime.now().getHour());
        }
        if (hour < minimumHour || hour * 60 + meetSchedule.getDurationMinutes() > 20 * 60) {
            throw new IllegalArgumentException("Schedule finalization date should be between 8 am until 8 pm: "
                    + "hour = " + hour);
        }

        // Check selected time be in all involved user's schedule times.
        Set<Long> availableUsersInFinalizedDate = scheduleEventRepository
                .findAllByMeetScheduleIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(meetScheduleId,
                        finalizedDateStart, finalizedDateEnd)
                .stream().map(ScheduleEvent::getOwner)
                .map(BaseEntity::getId)
                .collect(Collectors.toSet());
        Set<Long> meetScheduleParticipants = meetSchedule.getParticipants();
        if (!availableUsersInFinalizedDate.equals(meetScheduleParticipants)) {
            throw new ResourceConflictException("Not all users are available during selected finalize date: "
                    + "available users = " + availableUsersInFinalizedDate
                    + " required users = " + meetScheduleParticipants,
                    "تمام افرادی که باید در جلسه دفاع حضور داشته باشند، در زمان مشخص‌شده حضور خود را اعلام نکرده‌اند.");
        }

        // Check that there is no meet schedule in this time for all involved users.
        List<MeetSchedule> finalizedMeetSchedulesIncludeUsers = meetScheduleRepository
                .findAllMeetScheduleIncludeAnyOfUsersAsParticipant(ProblemState.IN_PROGRESS,
                        ScheduleState.FINALIZED, meetScheduleParticipants);
        List<MeetSchedule> allMeetScheduleIntersectWithFinalizedDate = finalizedMeetSchedulesIncludeUsers.stream()
                .filter(m -> !(finalizedDateEnd.isBefore(m.getFinalizedDate())
                        || finalizedDateStart.isAfter(m.getEndOfFinalizedDate())))
                .collect(Collectors.toList());
        List<Long> usersHaveAnotherMeetScheduleSameTime = allMeetScheduleIntersectWithFinalizedDate.stream()
                .flatMap(m -> m.getParticipants().stream())
                .filter(meetScheduleParticipants::contains)
                .collect(Collectors.toList());
        if (!usersHaveAnotherMeetScheduleSameTime.isEmpty()) {
            throw new ResourceConflictException(
                    "Some of users are participated in another meet schedule during selected finalize date: "
                            + "users = " + usersHaveAnotherMeetScheduleSameTime,
                    "تعدادی از افرادی که باید در جلسه‌ی دفاع حضور داشته باشند، به صورت همزمان در جلسه‌ی دفاع دیگری "
                            + "شرکت می‌کنند.");
        }

        problemEventRepository.save(ProblemEvent.builder()
                .message(String.format(
                        "جلسه دفاع پایان‌نامه (پروژه) در تاریخ %s به مدت %s برگزار می‌شود.",
                        DateUtility.getFullPersianDate(finalizedDateStart), meetSchedule.getDurationInfo()))
                .problem(meetSchedule.getProblem())
                .build());

        meetSchedule.setScheduleState(ScheduleState.FINALIZED);
        meetSchedule.setFinalizedDate(finalizedDateStart);
        meetSchedule.setAnnouncedUsers(Collections.emptySet());
        return MeetScheduleDto.from(meetScheduleRepository.save(meetSchedule));
    }

    private void checkMeetScheduleState(MeetSchedule meetSchedule, ScheduleState state) {
        if (meetSchedule.getScheduleState() != state) {
            throw new IllegalArgumentException("Illegal change on meet schedule in current state: "
                    + "ID = " + meetSchedule.getId() + " state = " + meetSchedule.getScheduleState());
        }
    }

    private void checkUserIsSupervisor(long userId, Problem problem) {
        if (problem.getSupervisor().getId() != userId) {
            throw new IllegalResourceAccessException(
                    "Problem is not owned or controlled (supervisor) by user: user ID = " + userId + " Problem ID = "
                            + problem.getId());
        }
    }

    private void checkUserAccessModifyOrDeleteEvent(long userId, ScheduleEvent scheduleEvent) {
        if (scheduleEvent.getOwner().getId() != userId) {
            throw new IllegalResourceAccessException(
                    "Schedule event is not created by user: user ID = " + userId + " Schedule event ID = "
                            + scheduleEvent.getId() + " schedule event owner: " + scheduleEvent.getOwner()
                            .getFullName());
        }
    }

    private void checkUserAccessMeetSchedule(long userId, MeetSchedule meetSchedule) {
        Problem scheduleProblem = meetSchedule.getProblem();
        if (scheduleProblem.getStudent().getId() != userId && scheduleProblem.getSupervisor().getId() != userId
                && scheduleProblem.getReferees().stream().noneMatch(master -> master.getId() == userId)) {
            throw new IllegalResourceAccessException(
                    "Meet schedule is not owned or controlled by user: ID = " + userId + " Schedule ID = "
                            + meetSchedule.getId());
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
            throw new IllegalResourceAccessException(String.format(
                    "Schedule event selected is not belonging to meet schedule: "
                            + "meet schedule ID = %s schedule event ID = %s", meetScheduleId, scheduleEvent.getId()));
        }
        return scheduleEvent;
    }
}
