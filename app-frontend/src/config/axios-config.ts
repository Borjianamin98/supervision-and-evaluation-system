import axios, {AxiosError} from "axios";
import AuthenticationService from "../services/api/AuthenticationService";
import {API_ROOT_PATH} from "../services/ApiPaths";

let apiAxios = axios.create({
    baseURL: API_ROOT_PATH,
    timeout: 1000
});

export function configAxios() {
    apiAxios.interceptors.request.use(
        config => {
            if (AuthenticationService.isAuthenticated()) {
                config.headers.Authorization = `Bearer ${AuthenticationService.getAuthenticationToken()}`;
            }
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );
}

export default apiAxios;