import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {Faculty} from "../../../model/university/faculty";
import {API_UNIVERSITY_REGISTER_PATH, API_UNIVERSITY_RESOURCE_PATH, API_UNIVERSITY_ROOT_PATH} from "../../ApiPaths";

class UniversityService {

    private constructor() {
    }

    static createInitialFaculty(): Faculty {
        return {
            name: "",
            location: "",
        }
    }

}

export default UniversityService;