package ir.ac.sbu.evaluation.controller.schedule;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_SCHEDULE_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleDto;
import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleSaveDto;
import ir.ac.sbu.evaluation.dto.schedule.event.DateRangeDto;
import ir.ac.sbu.evaluation.dto.schedule.event.ScheduleEventDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.schedule.MeetScheduleService;
import java.time.Instant;
import java.util.List;
import javax.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_SCHEDULE_ROOT_PATH)
public class ScheduleController {

    private final MeetScheduleService meetScheduleService;

    public ScheduleController(MeetScheduleService meetScheduleService) {
        this.meetScheduleService = meetScheduleService;
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{meetScheduleId}/start")
    public MeetScheduleDto updateMeetSchedule(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @Valid @RequestBody MeetScheduleSaveDto meetScheduleSaveDto) {
        return meetScheduleService.startMeetSchedule(authUserDetail.getUserId(), meetScheduleId, meetScheduleSaveDto);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{meetScheduleId}/updateDate")
    public MeetScheduleDto updateMeetScheduleDate(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @Valid @RequestBody DateRangeDto dateRangeDto) {
        return meetScheduleService.updateMeetScheduleDate(authUserDetail.getUserId(), meetScheduleId, dateRangeDto);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{meetScheduleId}/announceFinalization")
    public MeetScheduleDto announceFinalizationByUserOfMeetSchedule(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId) {
        return meetScheduleService.announceFinalizationByUser(authUserDetail.getUserId(), meetScheduleId);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{meetScheduleId}/reschedule")
    public MeetScheduleDto requestRescheduleMeetSchedule(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId) {
        return meetScheduleService.rescheduleMeetSchedule(authUserDetail.getUserId(), meetScheduleId);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{meetScheduleId}/finalize")
    public MeetScheduleDto finalizeMeetSchedule(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @RequestParam(name = "finalizedDate") Instant finalizedDate) {
        return meetScheduleService.finalizeMeetSchedule(authUserDetail.getUserId(), meetScheduleId, finalizedDate);
    }

    @GetMapping(path = "/{meetScheduleId}/events")
    public List<ScheduleEventDto> retrieveScheduleEvents(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @RequestParam(name = "startDate") Instant startDate,
            @RequestParam(name = "endDate") Instant endDate) {
        return meetScheduleService.retrieveScheduleEvents(authUserDetail.getUserId(), meetScheduleId, startDate, endDate);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{meetScheduleId}/event")
    public ScheduleEventDto addScheduleEvent(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @Valid @RequestBody DateRangeDto dateRangeDto) {
        return meetScheduleService.addScheduleEvent(authUserDetail.getUserId(), meetScheduleId, dateRangeDto);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{meetScheduleId}/event/{scheduleEventId}")
    public ScheduleEventDto updateScheduleEvent(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @PathVariable long scheduleEventId,
            @Valid @RequestBody DateRangeDto dateRangeDto) {
        return meetScheduleService.updateScheduleEvent(authUserDetail.getUserId(),
                meetScheduleId, scheduleEventId, dateRangeDto);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @DeleteMapping(path = "/{meetScheduleId}/event/{scheduleEventId}")
    public ScheduleEventDto deleteScheduleEvent(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @PathVariable long scheduleEventId) {
        return meetScheduleService.deleteScheduleEvent(authUserDetail.getUserId(), meetScheduleId, scheduleEventId);
    }
}
