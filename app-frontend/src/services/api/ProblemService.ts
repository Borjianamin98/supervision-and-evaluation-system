import {Problem} from "../../model/problem";

class ProblemService {

    public static readonly EDUCATIONS = ["کارشناسی", "کارشناسی ارشد"];

    private constructor() {
    }

    static createInitialProblem(): Problem {
        return {
            education: this.EDUCATIONS[0],
            keywords: []
        }
    }
}

export default ProblemService;