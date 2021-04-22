import apiAxios from "../../config/axios-config";
import {educationPersianMapping, PERSIAN_EDUCATIONS, Problem} from "../../model/problem";
import {API_PROBLEM_CREATE_PATH} from "../ApiPaths";

class ProblemService {


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
        }
    }

    static sendCreateProblem(problem: Problem) {
        const problemData: Problem = {
            ...problem,
            education: educationPersianMapping(problem.education),
        }
        return apiAxios.post(API_PROBLEM_CREATE_PATH,
            problemData,
            {
                validateStatus: status => status === 201
            })
    }

    static validateInitialProblem(problem: Problem) {
        return PERSIAN_EDUCATIONS.includes(problem.education) &&
            problem.title.length > 0 && problem.title.length <= 70 &&
            problem.englishTitle.length > 0 && problem.englishTitle.length <= 70 &&
            ProblemService.isKeywordsValid(problem.keywords) &&
            ProblemService.isDefinitionValid(problem.definition) &&
            problem.considerations.length > 0 && problem.considerations.length <= 400 &&
            problem.history.length <= 400 &&
            problem.supervisor
    }

    static isDefinitionValid(definition: string) {
        return definition.split(/[ ]+/).length >= 10 && definition.length <= 400;
    }

    static isKeywordsValid(keywords: string[]) {
        return keywords.length >= 2 && keywords.length <= 5 && keywords.every(value => value.length >= 2);
    }
}

export default ProblemService;