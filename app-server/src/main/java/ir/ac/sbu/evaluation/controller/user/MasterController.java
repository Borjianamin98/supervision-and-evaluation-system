package ir.ac.sbu.evaluation.controller.user;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_MASTER_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterRegisterDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.user.MasterService;
import java.util.List;
import java.util.stream.Stream;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping(path = {"", "/"})
    public List<UserDto> list() {
        return masterService.listAsUser();
    }

    @PostMapping(path = API_MASTER_REGISTER_PATH)
    public MasterDto add(@Valid @RequestBody MasterRegisterDto masterRegisterDto) {
        return masterService.save(masterRegisterDto.getMaster(), masterRegisterDto.getFacultyId());
    }
}
