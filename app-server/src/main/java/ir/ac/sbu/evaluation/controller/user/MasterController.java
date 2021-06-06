package ir.ac.sbu.evaluation.controller.user;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_MASTER_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterSaveDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.user.MasterService;
import java.util.stream.Stream;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_MASTER_ROOT_PATH)
public class MasterController {

    private final static String API_MASTER_REGISTER_PATH = "/register";
    private final static String API_MASTER_INFO_PATH = "/info";

    private final MasterService masterService;

    public MasterController(MasterService masterService) {
        this.masterService = masterService;
    }

    public static String[] permittedPaths() {
        return Stream.of(API_MASTER_REGISTER_PATH)
                .map(path -> API_MASTER_ROOT_PATH + path).toArray(String[]::new);
    }

    @GetMapping(path = API_MASTER_INFO_PATH)
    public MasterDto retrieveInfo(@ModelAttribute AuthUserDetail authUserDetail) {
        return masterService.retrieve(authUserDetail.getUserId());
    }

    @GetMapping(value = {"", "/"})
    public Page<MasterDto> list(
            @RequestParam(name = "nameQuery", required = false, defaultValue = "") String nameQuery,
            Pageable pageable) {
        return masterService.retrieveMasters(nameQuery, pageable);
    }

    @PostMapping(path = API_MASTER_REGISTER_PATH)
    public MasterDto add(@Valid @RequestBody MasterSaveDto masterSaveDto) {
        return masterService.save(masterSaveDto);
    }
}
