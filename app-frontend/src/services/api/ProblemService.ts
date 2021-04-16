import {Problem} from "../../model/problem";

class ProblemService {

    public static readonly EDUCATIONS = ["کارشناسی", "کارشناسی ارشد"];

    private constructor() {
    }

    static createInitialProblem(): Problem {
        return {
            education: ProblemService.EDUCATIONS[0],
            title: "",
            englishTitle: "",
            keywords: [],
            definition: "",
        }
    }
}

export default ProblemService;