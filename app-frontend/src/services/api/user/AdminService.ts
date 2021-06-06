import apiAxios from "../../../config/axios-config";
import {Admin} from "../../../model/user/admin/Admin";

class AdminService {

    private static readonly API_ADMIN_ROOT_PATH = "/admin"
    private static readonly API_ADMIN_INFO_PATH = `${AdminService.API_ADMIN_ROOT_PATH}/info`

    private constructor() {
    }

    static retrieveAdminInfo() {
        // Returns info based on authenticated user.
        return apiAxios.get<Admin>(AdminService.API_ADMIN_INFO_PATH)
            .then(response => response.data);
    }
}

export default AdminService;