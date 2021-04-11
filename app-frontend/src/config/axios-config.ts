import axios, {AxiosError} from "axios";
import AuthenticationService from "../services/api/AuthenticationService";
import {API_AUTHENTICATION_LOGIN_PATH, API_AUTHENTICATION_REFRESH_PATH, API_ROOT_PATH} from "../services/ApiPaths";
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
    timeout: 2000
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
                    // Refresh token invalidated/expired and we should login again.
                    AuthenticationService.logout();
                    browserHistory.push("/login");
                    return Promise.reject(error);
                } else if (axiosRequestConfig.url?.includes(API_AUTHENTICATION_LOGIN_PATH)) {
                    // Incorrect username/password provided for authentication
                    AuthenticationService.logout();
                    browserHistory.push("/login");
                    return Promise.reject(error);
                } else if (axiosRequestConfig.isRetryable) {
                    // Access token expired. We should try to refresh our token before force
                    // user to login again.
                    axiosRequestConfig.isRetryable = false;
                    await AuthenticationService.refresh();
                    return apiAxios(axiosRequestConfig);
                }
            }
            return Promise.reject(error);
        }
    );
}

export function getGeneralErrorMessage(error: AxiosError): { message: string, statusCode?: number } {
    let message = "", statusCode;
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the validation range.
        statusCode = error.response.status;
    } else if (error.request) {
        // The request was made but no response was received
        message = "در ارتباط با سرور مشکلی می‌باشد. در صورت عدم رفع مشکل با مسئول پشتیبانی تماس بگیرید.";
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Unexpected error happened in request', error.message);
        message = "خطای غیرمنتظره رخ داده است. در صورت عدم رفع مشکل با مسئول پشتیبانی تماس بگیرید.";
    }
    return {
        message,
        statusCode
    }
}

export default apiAxios;