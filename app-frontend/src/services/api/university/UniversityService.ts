import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {University} from "../../../model/university/university";
import {API_UNIVERSITY_REGISTER_PATH, API_UNIVERSITY_RESOURCE_PATH, API_UNIVERSITY_ROOT_PATH} from "../../ApiPaths";

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

    static retrieveUniversities(pageSize: number, page: number) {
        return apiAxios.get<Pageable<University>>(API_UNIVERSITY_ROOT_PATH,
            {
                validateStatus: status => status === 200,
                params: {
                    size: pageSize,
                    page: page,
                }
            })
    }

    static registerUniversity(university: University) {
        return apiAxios.post<University>(API_UNIVERSITY_REGISTER_PATH,
            university,
            {
                validateStatus: status => status === 200
            })
    }

    static updateUniversity(universityId: number, university: University) {
        return apiAxios.put<University>(API_UNIVERSITY_RESOURCE_PATH.replace("{0}", String(universityId)),
            university,
            {
                validateStatus: status => status === 200
            })
    }

    static deleteUniversity(universityId: number) {
        return apiAxios.delete<University>(API_UNIVERSITY_RESOURCE_PATH.replace("{0}", String(universityId)),
            {
                validateStatus: status => status === 200
            })
    }

    static isUniversityValid(university: University) {
        return university.name.length > 0;
    }
}

export default UniversityService;