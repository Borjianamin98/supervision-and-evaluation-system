package ir.ac.sbu.evaluation.controller;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_PROBLEM_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.ProblemDto;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.service.ProblemService;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PROBLEM_ROOT_PATH)
public class ProblemController {

    public final static String API_PROBLEM_CREATE_PATH = "/create";

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @PostMapping(path = API_PROBLEM_CREATE_PATH)
    public ProblemDto createProblem(@Valid @RequestBody ProblemDto problemDto,
            @ModelAttribute AuthUserDetail authUserDetail) {
        return problemService.addProblem(authUserDetail.getUserId(), problemDto);
    }
}
