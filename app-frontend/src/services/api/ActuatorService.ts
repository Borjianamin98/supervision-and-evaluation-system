import apiAxios from "../../config/axios-config";
import {BACKEND_SERVICE_HOST} from "../ApiPaths";

interface ActuatorHealthResponse {
    status: string
}

class ActuatorService {

    private static readonly API_ACTUATOR_ROOT_PATH = `${BACKEND_SERVICE_HOST}/actuator`

    private constructor() {
    }

    static async isServerUp() {
        const response = await apiAxios.get<ActuatorHealthResponse>(
            `${(ActuatorService.API_ACTUATOR_ROOT_PATH)}/health`)
        if (response.data.status !== "UP") {
            throw new Error("Backend server is not healthy");
        }
    }
}

export default ActuatorService;