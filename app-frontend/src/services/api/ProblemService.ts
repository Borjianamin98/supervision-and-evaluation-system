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
            considerations: "",
        }
    }

    static isDefinitionValid(definition: string) {
        return definition.split(/[ ]+/).length >= 15;
    }

    static isKeywordsValid(keywords: string[]) {
        return keywords.length >= 2 && keywords.every(value => value.length >= 2);
    }
}

export default ProblemService;