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

    static retrieveUniversities(pageSize: number, page: number, nameQuery?: string) {
        return apiAxios.get<Pageable<University>>(API_UNIVERSITY_ROOT_PATH,
            {
                params: {
                    size: pageSize,
                    page: page,
                    nameQuery: nameQuery ?? "",
                }
            })
    }

    static registerUniversity(university: University) {
        return apiAxios.post<University>(API_UNIVERSITY_REGISTER_PATH, university)
    }

    static updateUniversity(universityId: number, university: University) {
        return apiAxios.put<University>(API_UNIVERSITY_RESOURCE_PATH.replace("{0}", String(universityId)),
            university)
    }

    static deleteUniversity(universityId: number) {
        return apiAxios.delete<University>(API_UNIVERSITY_RESOURCE_PATH.replace("{0}", String(universityId)))
    }

    static isUniversityValid(university: University) {
        return university.name.length > 0;
    }
}

export default UniversityService;