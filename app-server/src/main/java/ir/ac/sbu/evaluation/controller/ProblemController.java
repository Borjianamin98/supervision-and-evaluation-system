package ir.ac.sbu.evaluation.controller;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_PROBLEM_ROOT_PATH;

import ir.ac.sbu.evaluation.dto.ProblemDto;
import ir.ac.sbu.evaluation.dto.authentication.AuthPrinciple;
import ir.ac.sbu.evaluation.service.ProblemService;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PROBLEM_ROOT_PATH)
public class ProblemController {

    private final static Logger logger = LoggerFactory.getLogger(ProblemController.class);

    public final static String API_PROBLEM_ADD_PATH = "/add";

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @PostMapping(path = API_PROBLEM_ADD_PATH)
    public void addProblem(@Valid @RequestBody ProblemDto problemDto, @ModelAttribute AuthPrinciple authPrinciple) {
    }
}
