import apiAxios from "../../../config/axios-config";
import {Student, StudentRegister} from "../../../model/user/student";

class StudentService {

    private static readonly API_STUDENT_ROOT_PATH = "/student"
    private static readonly API_STUDENT_REGISTER_PATH = `${StudentService.API_STUDENT_ROOT_PATH}/register`
    private static readonly API_STUDENT_INFO_PATH = `${StudentService.API_STUDENT_ROOT_PATH}/info`

    private constructor() {
    }

    static registerStudent(studentRegister: StudentRegister) {
        return apiAxios.post<Student>(StudentService.API_STUDENT_REGISTER_PATH, studentRegister)
    }

    static retrieveStudentInfo() {
        // Returns info based on authenticated user.
        return apiAxios.get<Student>(StudentService.API_STUDENT_INFO_PATH)
    }

    static isStudentNumberValid(studentNumber: string) {
        return studentNumber.replace(/[^0-9]/g, '') === studentNumber
            && studentNumber.length > 0;
    }
}

export default StudentService;