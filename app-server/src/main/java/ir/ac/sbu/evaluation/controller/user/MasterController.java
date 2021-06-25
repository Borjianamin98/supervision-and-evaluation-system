package ir.ac.sbu.evaluation.controller.user;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_MASTER_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.report.RefereeReportItemDto;
import ir.ac.sbu.evaluation.dto.review.peer.AggregatedPeerReviewsDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterSaveDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.user.MasterService;
import java.util.stream.Stream;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_MASTER_ROOT_PATH)
public class MasterController {

    private final static String API_MASTER_REGISTER_PATH = "/register";

    private final MasterService masterService;

    public MasterController(MasterService masterService) {
        this.masterService = masterService;
    }

    public static String[] permittedPaths() {
        return Stream.of(API_MASTER_REGISTER_PATH)
                .map(path -> API_MASTER_ROOT_PATH + path).toArray(String[]::new);
    }

    @GetMapping(value = {"", "/"})
    public Page<MasterDto> list(
            @RequestParam(name = "nameQuery", required = false, defaultValue = "") String nameQuery,
            Pageable pageable) {
        return masterService.retrieveMasters(nameQuery, pageable);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.MASTER_ROLE_NAME)")
    @GetMapping(path = "/authenticated")
    public MasterDto retrieveAuthenticatedMaster(@ModelAttribute AuthUserDetail authUserDetail) {
        return masterService.retrieveMaster(authUserDetail.getUserId());
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.ADMIN_ROLE_NAME)")
    @GetMapping(path = "/{masterId}")
    public MasterDto retrieveMaster(
            @PathVariable long masterId) {
        return masterService.retrieveMaster(masterId);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.ADMIN_ROLE_NAME)")
    @GetMapping(path = "/{masterId}/peerReviews")
    public AggregatedPeerReviewsDto retrieveMasterPeerReviews(
            @PathVariable long masterId,
            Pageable pageable) {
        return masterService.retrieveMasterPeerReviews(masterId, pageable);
    }

    @PreAuthorize("hasAnyAuthority(@SecurityRoles.ADMIN_ROLE_NAME)")
    @GetMapping(path = "/{masterId}/refereeReport")
    public Page<RefereeReportItemDto> retrieveMasterRefereeReport(
            @RequestParam(name = "universityName", required = false, defaultValue = "") String universityName,
            @PathVariable long masterId,
            Pageable pageable) {
        return masterService.retrieveMasterRefereeReport(masterId, universityName, pageable);
    }

    @PostMapping(path = API_MASTER_REGISTER_PATH)
    public MasterDto add(@Valid @RequestBody MasterSaveDto masterSaveDto) {
        return masterService.save(masterSaveDto);
    }
}
