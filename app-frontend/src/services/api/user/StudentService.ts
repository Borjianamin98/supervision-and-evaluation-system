import apiAxios from "../../../config/axios-config";
import {Student} from "../../../model/user/student";
import {API_STUDENT_REGISTER_PATH} from "../../ApiPaths";

class StudentService {

    private constructor() {
    }

    static registerStudent(student: Student) {
        return apiAxios.post<Student>(API_STUDENT_REGISTER_PATH, student,
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