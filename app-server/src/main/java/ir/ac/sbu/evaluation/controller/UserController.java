package ir.ac.sbu.evaluation.controller;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_USER_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.UserDto;
import ir.ac.sbu.evaluation.dto.UserListDto;
import ir.ac.sbu.evaluation.service.UserService;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_USER_ROOT_PATH)
public class UserController {

    public final static String API_USER_REGISTER_PATH = "/register";

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(path = {"", "/"})
    public UserListDto getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping(path = API_USER_REGISTER_PATH)
    public UserDto saveUser(@Valid @RequestBody UserDto userDto) {
        return userService.save(userDto);
    }
}
