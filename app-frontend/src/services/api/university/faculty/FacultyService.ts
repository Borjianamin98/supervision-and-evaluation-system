import apiAxios from "../../../../config/axios-config";
import {Pageable} from "../../../../model/pageable";
import {Faculty} from "../../../../model/university/faculty/faculty";
import {FacultySave} from "../../../../model/university/faculty/facultySave";

class FacultyService {

    private static readonly API_FACULTY_ROOT_PATH = "/faculty"
    private static readonly API_FACULTY_REGISTER_PATH = `${FacultyService.API_FACULTY_ROOT_PATH}/register`

    private constructor() {
    }

    static createInitialFacultySave(): FacultySave {
        return {
            name: "",
            webAddress: "",
        }
    }

    static retrieveUniversityFaculties(universityId: number, pageSize: number, page: number, nameQuery?: string) {
        return apiAxios.get<Pageable<Faculty>>(FacultyService.API_FACULTY_ROOT_PATH,
            {
                params: {
                    universityId: universityId,
                    size: pageSize,
                    page: page,
                    nameQuery: nameQuery,
                }
            }).then(response => response.data);
    }

    static registerFaculty(universityId: number, facultySave: FacultySave) {
        return apiAxios.post<Faculty>(FacultyService.API_FACULTY_REGISTER_PATH,
            facultySave,
            {
                params: {
                    universityId: universityId,
                }
            }).then(response => response.data);
    }

    static updateFaculty(facultyId: number, facultySave: FacultySave) {
        return apiAxios.put<Faculty>(`${FacultyService.API_FACULTY_ROOT_PATH}/${facultyId}`, facultySave)
            .then(response => response.data);
    }

    static deleteFaculty(facultyId: number) {
        return apiAxios.delete<Faculty>(`${FacultyService.API_FACULTY_ROOT_PATH}/${facultyId}`)
            .then(response => response.data);
    }

    static isFacultyValid(facultySave: FacultySave) {
        return facultySave.name.length > 0;
    }
}

export default FacultyService;