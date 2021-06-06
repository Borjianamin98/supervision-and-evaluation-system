import apiAxios from "../../../config/axios-config";
import {Pageable} from "../../../model/pageable";
import {University} from "../../../model/university/University";
import {UniversitySave} from "../../../model/university/UniversitySave";

class UniversityService {

    private static readonly API_UNIVERSITY_ROOT_PATH = "/university"
    private static readonly API_UNIVERSITY_REGISTER_PATH = `${UniversityService.API_UNIVERSITY_ROOT_PATH}/register`

    private constructor() {
    }

    static createInitialUniversitySave(): UniversitySave {
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

    static registerUniversity(universitySave: UniversitySave) {
        return apiAxios.post<University>(UniversityService.API_UNIVERSITY_REGISTER_PATH, universitySave)
            .then(response => response.data)
    }

    static updateUniversity(universityId: number, universitySave: UniversitySave) {
        return apiAxios.put<University>(`${UniversityService.API_UNIVERSITY_ROOT_PATH}/${universityId}`,
            universitySave).then(response => response.data)
    }

    static deleteUniversity(universityId: number) {
        return apiAxios.delete<University>(`${UniversityService.API_UNIVERSITY_ROOT_PATH}/${universityId}`)
            .then(response => response.data)
    }

    static isUniversityValid(universitySave: UniversitySave) {
        return universitySave.name.length > 0;
    }
}

export default UniversityService;