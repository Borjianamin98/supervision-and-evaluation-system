package ir.ac.sbu.evaluation.controller.schedule;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_SCHEDULE_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.schedule.event.ScheduleEventDateDto;
import ir.ac.sbu.evaluation.dto.schedule.event.ScheduleEventInfoDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.schedule.ScheduleService;
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

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping(path = "/{meetScheduleId}/events")
    public List<ScheduleEventInfoDto> retrieveScheduleEvents(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @RequestParam(name = "startDate") Instant startDate,
            @RequestParam(name = "endDate") Instant endDate) {
        return scheduleService.retrieveScheduleEvents(authUserDetail.getUserId(), meetScheduleId, startDate, endDate);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{meetScheduleId}/event")
    public ScheduleEventInfoDto addScheduleEvent(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @Valid @RequestBody ScheduleEventDateDto scheduleEventDateDto) {
        return scheduleService.addScheduleEvent(authUserDetail.getUserId(), meetScheduleId, scheduleEventDateDto);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @PostMapping(path = "/{meetScheduleId}/event/{scheduleEventId}")
    public ScheduleEventInfoDto updateScheduleEvent(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @PathVariable long scheduleEventId,
            @Valid @RequestBody ScheduleEventDateDto scheduleEventDateDto) {
        return scheduleService.updateScheduleEvent(authUserDetail.getUserId(),
                meetScheduleId, scheduleEventId, scheduleEventDateDto);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.STUDENT_ROLE_NAME, @SecurityRoles.MASTER_ROLE_NAME)")
    @DeleteMapping(path = "/{meetScheduleId}/event/{scheduleEventId}")
    public ScheduleEventInfoDto deleteScheduleEvent(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long meetScheduleId,
            @PathVariable long scheduleEventId) {
        return scheduleService.deleteScheduleEvent(authUserDetail.getUserId(), meetScheduleId, scheduleEventId);
    }
}
