import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {University} from "../../../model/university/university";

class UniversityService {

    private static readonly API_UNIVERSITY_ROOT_PATH = "/university"
    private static readonly API_UNIVERSITY_REGISTER_PATH = `${UniversityService.API_UNIVERSITY_ROOT_PATH}/register`

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
        return apiAxios.get<Pageable<University>>(UniversityService.API_UNIVERSITY_ROOT_PATH,
            {
                params: {
                    size: pageSize,
                    page: page,
                    nameQuery: nameQuery,
                }
            }).then(response => response.data)
    }

    static registerUniversity(university: University) {
        return apiAxios.post<University>(UniversityService.API_UNIVERSITY_REGISTER_PATH, university)
            .then(response => response.data)
    }

    static updateUniversity(universityId: number, university: University) {
        return apiAxios.put<University>(`${UniversityService.API_UNIVERSITY_ROOT_PATH}/${universityId}`,
            university).then(response => response.data)
    }

    static deleteUniversity(universityId: number) {
        return apiAxios.delete<University>(`${UniversityService.API_UNIVERSITY_ROOT_PATH}/${universityId}`)
            .then(response => response.data)
    }

    static isUniversityValid(university: University) {
        return university.name.length > 0;
    }
}

export default UniversityService;