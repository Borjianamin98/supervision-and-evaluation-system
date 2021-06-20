import apiAxios from "../../../config/axios-config";
import {Education, ENGLISH_EDUCATIONS} from "../../../model/enum/education";
import {Pageable} from "../../../model/api/Pageable";
import {Problem, ProblemSave} from "../../../model/problem/problem";
import {ProblemState} from "../../../model/problem/problemState";
import {API_PROBLEM_ROOT_PATH} from "../../ApiPaths";

class ProblemStudentService {

    public static readonly MAX_LONG_STRING_LENGTH = 1000;
    private static readonly API_PROBLEM_STUDENT_ROOT_PATH = `${API_PROBLEM_ROOT_PATH}/authenticatedStudent`

    private constructor() {
    }

    static createInitialProblemSave(): ProblemSave {
        return {
            education: Education.BACHELOR,
            title: "",
            englishTitle: "",
            keywords: [],
            definition: "",
            history: "",
            considerations: "",
        }
    }

    static createProblem(problemSave: ProblemSave) {
        return apiAxios.post<Problem>(ProblemStudentService.API_PROBLEM_STUDENT_ROOT_PATH,
            problemSave, {
                validateStatus: status => status === 201
            }).then(response => response.data);
    }

    static retrieveProblemsOfStudent(pageSize: number, page: number, problemState: ProblemState) {
        return apiAxios.get<Pageable<Problem>>(ProblemStudentService.API_PROBLEM_STUDENT_ROOT_PATH,
            {
                params: {
                    size: pageSize,
                    page: page,
                    problemState: problemState,
                }
            }).then(response => response.data);
    }

    static updateProblem(problemId: number, problemSave: ProblemSave) {
        return apiAxios.put<Problem>(`${ProblemStudentService.API_PROBLEM_STUDENT_ROOT_PATH}/${problemId}`,
            problemSave).then(response => response.data);
    }

    static isValidProblem(problemSave: ProblemSave) {
        return ENGLISH_EDUCATIONS.includes(problemSave.education)
            && problemSave.title.length > 0
            && problemSave.title.length <= 70
            && problemSave.englishTitle.length > 0 && problemSave.englishTitle.length <= 70
            && ProblemStudentService.isKeywordsValid(problemSave.keywords)
            && ProblemStudentService.isDefinitionValid(problemSave.definition)
            && problemSave.considerations.length > 0
            && problemSave.considerations.length <= ProblemStudentService.MAX_LONG_STRING_LENGTH
            && problemSave.history.length <= ProblemStudentService.MAX_LONG_STRING_LENGTH
            && problemSave.supervisorId;
    }

    static isDefinitionValid(definition: string) {
        return definition.split(/[ ]+/).length >= 10 && definition.length <= ProblemStudentService.MAX_LONG_STRING_LENGTH;
    }

    static isKeywordsValid(keywords: string[]) {
        return keywords.length >= 2 && keywords.length <= 5 && keywords.every(value => value.length >= 2);
    }
}

export default ProblemStudentService;