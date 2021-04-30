import apiAxios from "../../../config/axios-config";
import {Faculty} from "../../../model/university/faculty";
import {University} from "../../../model/university/university";
import {
    API_UNIVERSITY_DELETE_PATH,
    API_UNIVERSITY_LIST_FACULTIES_PATH,
    API_UNIVERSITY_PATH,
    API_UNIVERSITY_REGISTER_PATH
} from "../../ApiPaths";

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

    static createInitialFaculty(): Faculty {
        return {
            name: "",
            location: "",
        }
    }

    static registerUniversity(university: University) {
        return apiAxios.post<University>(API_UNIVERSITY_REGISTER_PATH,
            university,
            {
                validateStatus: status => status === 200
            })
    }

    static deleteUniversity(universityId: number) {
        return apiAxios.delete<University>(API_UNIVERSITY_DELETE_PATH.replace("{0}", String(universityId)),
            {
                validateStatus: status => status === 200
            })
    }

    static retrieveUniversities() {
        return apiAxios.get<Array<University>>(API_UNIVERSITY_PATH,
            {
                validateStatus: status => status === 200
            })
    }

    static retrieveUniversityFaculties(universityId: number) {
        return apiAxios.get<Array<Faculty>>(API_UNIVERSITY_LIST_FACULTIES_PATH.replace("{0}", String(universityId)),
            {
                validateStatus: status => status === 200
            })
    }

    static isUniversityValid(university: University) {
        return university.name.length > 0;
    }
}

export default UniversityService;