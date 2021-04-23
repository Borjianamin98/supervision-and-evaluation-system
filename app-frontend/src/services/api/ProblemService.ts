import apiAxios from "../../config/axios-config";
import {educationPersianMapping, PERSIAN_EDUCATIONS, Problem, ProblemState} from "../../model/problem";
import {API_PROBLEM_CREATE_PATH, API_PROBLEM_RETRIEVE_OWNER_PROBLEMS_PATH} from "../ApiPaths";

class ProblemService {
    public static readonly MAX_LONG_STRING_LENGTH = 1000;

    private constructor() {
    }

    static createInitialProblem(): Problem {
        return {
            education: PERSIAN_EDUCATIONS[0],
            title: "",
            englishTitle: "",
            keywords: [],
            definition: "",
            history: "",
            considerations: "",
            state: ProblemState.CREATED,
        }
    }

    static sendCreateProblem(problem: Problem) {
        return apiAxios.post(API_PROBLEM_CREATE_PATH,
            {
                ...problem,
                education: educationPersianMapping(problem.education),
            },
            {
                validateStatus: status => status === 201
            })
    }

    static retrieveOwnerProblem() {
        return apiAxios.get<Array<Problem>>(API_PROBLEM_RETRIEVE_OWNER_PROBLEMS_PATH,
            {
                validateStatus: status => status === 200
            })
    }

    static validateInitialProblem(problem: Problem) {
        return PERSIAN_EDUCATIONS.includes(problem.education) &&
            problem.title.length > 0 && problem.title.length <= 70 &&
            problem.englishTitle.length > 0 && problem.englishTitle.length <= 70 &&
            ProblemService.isKeywordsValid(problem.keywords) &&
            ProblemService.isDefinitionValid(problem.definition) &&
            problem.considerations.length > 0 && problem.considerations.length <= ProblemService.MAX_LONG_STRING_LENGTH &&
            problem.history.length <= ProblemService.MAX_LONG_STRING_LENGTH &&
            problem.supervisor
    }

    static isDefinitionValid(definition: string) {
        return definition.split(/[ ]+/).length >= 10 && definition.length <= ProblemService.MAX_LONG_STRING_LENGTH;
    }

    static isKeywordsValid(keywords: string[]) {
        return keywords.length >= 2 && keywords.length <= 5 && keywords.every(value => value.length >= 2);
    }
}

export default ProblemService;