package ir.ac.sbu.evaluation.controller.user;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_ADMIN_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.user.admin.AdminDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.user.AdminService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_ADMIN_ROOT_PATH)
public class AdminController {

    private final static String API_ADMIN_INFO_PATH = "/info";

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping(path = API_ADMIN_INFO_PATH)
    public AdminDto retrieveInfo(@ModelAttribute AuthUserDetail authUserDetail) {
        return adminService.retrieve(authUserDetail.getUserId());
    }
}
