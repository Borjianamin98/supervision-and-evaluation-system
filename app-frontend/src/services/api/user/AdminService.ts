import apiAxios from "../../../config/axios-config";
import {Admin} from "../../../model/user/admin";
import {API_ADMIN_INFO_PATH} from "../../ApiPaths";

class AdminService {

    private constructor() {
    }

    static retrieveAdminInfo() {
        // Returns info based on authenticated user.
        return apiAxios.get<Admin>(API_ADMIN_INFO_PATH,
            {
                validateStatus: status => status === 200
            })
    }
}

export default AdminService;