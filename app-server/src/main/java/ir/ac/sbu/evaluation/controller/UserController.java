package ir.ac.sbu.evaluation.controller;

import ir.ac.sbu.evaluation.dto.UserListDto;
import ir.ac.sbu.evaluation.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(UserController.API_USER_PATH)
public class UserController {

    public static final String API_USER_PATH = "/api/v1/user";

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(path = {"", "/"})
    public UserListDto getAllUsers() {
        return userService.getAllUsers();
    }
}
