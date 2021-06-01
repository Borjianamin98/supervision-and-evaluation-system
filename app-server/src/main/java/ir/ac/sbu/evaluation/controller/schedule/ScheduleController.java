package ir.ac.sbu.evaluation.controller.schedule;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_SCHEDULE_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.schedule.ScheduleEventDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.schedule.ScheduleService;
import java.time.Instant;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping(path = "/{scheduleId}/events")
    public List<ScheduleEventDto> retrieveScheduleEvents(
            @ModelAttribute AuthUserDetail authUserDetail,
            @PathVariable long scheduleId,
            @RequestParam(name = "startDate") Instant startDate,
            @RequestParam(name = "endDate") Instant endDate) {
        return scheduleService.retrieveScheduleEvents(authUserDetail.getUserId(), scheduleId, startDate, endDate);
    }
}
