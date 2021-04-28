package ir.ac.sbu.evaluation.controller.user;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_USER_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.exception.InitializationFailureException;
import ir.ac.sbu.evaluation.service.user.UserService;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.Objects;
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

@RestController
@RequestMapping(API_USER_ROOT_PATH)
public class UserController {

    private final static Logger logger = LoggerFactory.getLogger(UserController.class);

    private final static String API_USER_REGISTER_PATH = "/register";
    private final static String API_USER_PROFILE_PICTURE_PATH = "/profile/picture";

    private final UserService userService;
    private final byte[] defaultUserProfilePicture;

    public UserController(UserService userService) throws InitializationFailureException {
        this.userService = userService;

        try {
            defaultUserProfilePicture = Files.readAllBytes(Paths.get(Objects.requireNonNull(
                    this.getClass().getClassLoader().getResource("static/images/user-default-profile.png")).toURI()));
        } catch (IOException | URISyntaxException | NullPointerException e) {
            throw new InitializationFailureException("Unable to find or load default user profile picture", e);
        }
    }

    @PostMapping(value = API_USER_PROFILE_PICTURE_PATH, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserDto setProfilePicture(Principal principal, @RequestParam MultipartFile file) throws IOException {
        return userService.setProfilePicture(principal.getName(), file.getBytes());
    }

    @GetMapping(value = API_USER_PROFILE_PICTURE_PATH, produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getProfilePicture(Principal principal) {
        byte[] image = userService.getProfilePicture(principal.getName()).orElse(defaultUserProfilePicture);
        return ResponseEntity.status(HttpStatus.OK).body(image);
    }
}
