import apiAxios from "../../../config/axios-config";
import {University} from "../../../model/university/university";
import {API_UNIVERSITY_PATH} from "../../ApiPaths";

class UniversityService {

    private constructor() {
    }

    static createInitialUniversity(): University {
        return {
            name: "",
            location: "",
            webAddress: "",
        }
    }

    static retrieveUniversities() {
        return apiAxios.get<Array<University>>(API_UNIVERSITY_PATH,
            {
                validateStatus: status => status === 200
            })
    }
}

export default UniversityService;