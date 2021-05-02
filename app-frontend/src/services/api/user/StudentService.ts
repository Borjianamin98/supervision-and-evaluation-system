import apiAxios from "../../../config/axios-config";
import {Student, StudentRegister} from "../../../model/user/student";
import {API_STUDENT_INFO_PATH, API_STUDENT_REGISTER_PATH} from "../../ApiPaths";

class StudentService {

    private constructor() {
    }

    static registerStudent(studentRegister: StudentRegister) {
        return apiAxios.post<Student>(API_STUDENT_REGISTER_PATH, studentRegister,
            {
                validateStatus: status => status === 200
            })
    }

    static retrieveStudentInfo() {
        // Returns info based on authenticated user.
        return apiAxios.get<Student>(API_STUDENT_INFO_PATH,
            {
                validateStatus: status => status === 200
            })
    }

    static isStudentNumberValid(studentNumber: string) {
        return studentNumber.replace(/[^0-9]/g, '') === studentNumber
            && studentNumber.length > 0;
    }
}

export default StudentService;