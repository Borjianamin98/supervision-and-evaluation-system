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
            location: "",
        }
    }

    static retrieveUniversityFaculties(pageSize: number, page: number, universityId: number) {
        return apiAxios.get<Pageable<Faculty>>(API_FACULTY_ROOT_PATH,
            {
                validateStatus: status => status === 200,
                params: {
                    universityId: universityId,
                    size: pageSize,
                    page: page,
                }
            })
    }

    static registerFaculty(universityId: number, faculty: Faculty) {
        return apiAxios.post<Faculty>(API_FACULTY_REGISTER_PATH,
            faculty,
            {
                validateStatus: status => status === 200,
                params: {
                    universityId: universityId,
                }
            })
    }

    static updateFaculty(facultyId: number, faculty: Faculty) {
        return apiAxios.put<Faculty>(API_FACULTY_RESOURCE_PATH.replace("{0}", String(facultyId)),
            faculty,
            {
                validateStatus: status => status === 200
            })
    }

    static deleteFaculty(facultyId: number) {
        return apiAxios.delete<Faculty>(API_FACULTY_RESOURCE_PATH.replace("{0}", String(facultyId)),
            {
                validateStatus: status => status === 200
            })
    }

    static isFacultyValid(faculty: Faculty) {
        return faculty.name.length > 0;
    }
}

export default UniversityService;