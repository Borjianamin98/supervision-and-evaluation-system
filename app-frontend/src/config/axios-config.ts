import axios, {AxiosError} from "axios";
import AuthenticationService from "../services/api/AuthenticationService";
import {API_AUTHENTICATION_REFRESH_PATH, API_ROOT_PATH} from "../services/ApiPaths";
import browserHistory from "./browserHistory";

// Extend any library types, by using the typescript declaration merging feature:
// Docs: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
declare module 'axios' {
    export interface AxiosRequestConfig {
        isRetryable?: boolean;
    }
}

let apiAxios = axios.create({
    baseURL: API_ROOT_PATH,
    // timeout: 1000
});

export function configAxios() {
    apiAxios.interceptors.request.use(
        config => {
            if (AuthenticationService.isAuthenticated()) {
                config.headers.Authorization = `Bearer ${AuthenticationService.getAccessToken()}`;
            }
            config.isRetryable = true;
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    apiAxios.interceptors.response.use(
        response => {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data.
            return response;
        },
        async (error: AxiosError) => {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            if (error.response?.status === 401) {
                const axiosRequestConfig = error.config;
                if (axiosRequestConfig.url?.includes(API_AUTHENTICATION_REFRESH_PATH)) {
                    AuthenticationService.logout();
                    browserHistory.push("/login");
                    return Promise.reject(error);
                } else if (axiosRequestConfig.isRetryable) {
                    axiosRequestConfig.isRetryable = false;
                    await AuthenticationService.refresh();
                    return apiAxios(axiosRequestConfig);
                }
            }
            return Promise.reject(error);
        }
    );
}

export default apiAxios;