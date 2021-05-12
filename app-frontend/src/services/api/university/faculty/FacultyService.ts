import apiAxios from "../../../../config/axios-config";
import {Pageable} from "../../../../model/pageable";
import {Faculty} from "../../../../model/university/faculty";
import {API_FACULTY_REGISTER_PATH, API_FACULTY_RESOURCE_PATH, API_FACULTY_ROOT_PATH} from "../../../ApiPaths";

class UniversityService {

    private constructor() {
    }

    static createInitialFaculty(): Faculty {
        return {
            name: "",
            webAddress: "",
        }
    }

    static retrieveUniversityFaculties(universityId: number, pageSize: number, page: number, nameQuery?: string) {
        return apiAxios.get<Pageable<Faculty>>(API_FACULTY_ROOT_PATH,
            {
                params: {
                    universityId: universityId,
                    size: pageSize,
                    page: page,
                    nameQuery: nameQuery ?? "",
                }
            })
    }

    static registerFaculty(universityId: number, faculty: Faculty) {
        return apiAxios.post<Faculty>(API_FACULTY_REGISTER_PATH,
            faculty,
            {
                params: {
                    universityId: universityId,
                }
            })
    }

    static updateFaculty(facultyId: number, faculty: Faculty) {
        return apiAxios.put<Faculty>(API_FACULTY_RESOURCE_PATH.replace("{0}", String(facultyId)), faculty)
    }

    static deleteFaculty(facultyId: number) {
        return apiAxios.delete<Faculty>(API_FACULTY_RESOURCE_PATH.replace("{0}", String(facultyId)))
    }

    static isFacultyValid(faculty: Faculty) {
        return faculty.name.length > 0;
    }
}

export default UniversityService;