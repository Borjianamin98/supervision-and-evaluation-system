package ir.ac.sbu.evaluation.controller.user;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_MASTER_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.user.MasterDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.service.user.MasterService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_MASTER_ROOT_PATH)
public class MasterController {

    private final static String API_MASTER_REGISTER_PATH = "/register";

    private final MasterService masterService;

    public MasterController(MasterService masterService) {
        this.masterService = masterService;
    }

    @GetMapping(path = {"", "/"})
    public List<UserDto> list() {
        return masterService.listAsUser();
    }

    @PostMapping(path = API_MASTER_REGISTER_PATH)
    public MasterDto add(@Valid @RequestBody MasterDto masterDto) {
        return masterService.save(masterDto);
    }
}
