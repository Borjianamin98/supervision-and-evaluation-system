package ir.ac.sbu.evaluation.controller;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_USER_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.UserDto;
import ir.ac.sbu.evaluation.dto.UserListDto;
import ir.ac.sbu.evaluation.service.UserService;
import java.io.IOException;
import java.security.Principal;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(API_USER_ROOT_PATH)
public class UserController {

    private final static Logger logger = LoggerFactory.getLogger(UserController.class);

    public final static String API_USER_REGISTER_PATH = "/register";
    private final static String API_USER_PROFILE_PICTURE_PATH = "/profile/picture";

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

    @PostMapping(value = API_USER_PROFILE_PICTURE_PATH, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserDto setProfilePicture(Principal principal, @RequestParam MultipartFile file) throws IOException {
        return userService.setProfilePicture(principal.getName(), file.getBytes());
    }

    @GetMapping(value = API_USER_PROFILE_PICTURE_PATH, produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getProfilePicture(Principal principal) {
        byte[] image = userService.getProfilePicture(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User has no profile picture"));
        return ResponseEntity.status(HttpStatus.OK).body(image);
    }
}
