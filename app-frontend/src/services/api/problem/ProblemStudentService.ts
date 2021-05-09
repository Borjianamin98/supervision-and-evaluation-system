import apiAxios from "../../../config/axios-config";
import {Education, ENGLISH_EDUCATIONS} from "../../../model/enum/education";
import {Pageable} from "../../../model/pageable";
import {Problem} from "../../../model/problem/problem";
import {ProblemState} from "../../../model/problem/problemState";
import {University} from "../../../model/university/university";
import {API_PROBLEM_ROOT_PATH, API_PROBLEM_STUDENT_RESOURCE_PATH, API_PROBLEM_STUDENT_ROOT_PATH} from "../../ApiPaths";

class ProblemStudentService {

    public static readonly MAX_LONG_STRING_LENGTH = 1000;

    private constructor() {
    }

    static createInitialProblem(): Problem {
        return {
            education: Education.BACHELOR,
            title: "",
            englishTitle: "",
            keywords: [],
            definition: "",
            history: "",
            considerations: "",
            state: ProblemState.CREATED,
            events: [],
            referees: [],
        }
    }

    static createProblem(problem: Problem) {
        return apiAxios.post(API_PROBLEM_ROOT_PATH,
            problem,
            {
                validateStatus: status => status === 201
            })
    }

    static retrieveProblemsOfStudent(pageSize: number, page: number, problemState: ProblemState) {
        return apiAxios.get<Pageable<Problem>>(API_PROBLEM_STUDENT_ROOT_PATH,
            {
                validateStatus: status => status === 200,
                params: {
                    size: pageSize,
                    page: page,
                    problemState: problemState,
                }
            })
    }

    static updateProblem(problemId: number, problem: Problem) {
        return apiAxios.put<University>(API_PROBLEM_STUDENT_RESOURCE_PATH.replace("{0}", String(problemId)),
            problem,
            {
                validateStatus: status => status === 200
            })
    }

    static isValidProblem(problem: Problem) {
        return ENGLISH_EDUCATIONS.includes(problem.education) &&
            problem.title.length > 0 && problem.title.length <= 70 &&
            problem.englishTitle.length > 0 && problem.englishTitle.length <= 70 &&
            ProblemStudentService.isKeywordsValid(problem.keywords) &&
            ProblemStudentService.isDefinitionValid(problem.definition) &&
            problem.considerations.length > 0 && problem.considerations.length <= ProblemStudentService.MAX_LONG_STRING_LENGTH &&
            problem.history.length <= ProblemStudentService.MAX_LONG_STRING_LENGTH &&
            problem.supervisor
    }

    static isDefinitionValid(definition: string) {
        return definition.split(/[ ]+/).length >= 10 && definition.length <= ProblemStudentService.MAX_LONG_STRING_LENGTH;
    }

    static isKeywordsValid(keywords: string[]) {
        return keywords.length >= 2 && keywords.length <= 5 && keywords.every(value => value.length >= 2);
    }
}

export default ProblemStudentService;