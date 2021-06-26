export const BACKEND_SERVICE_HOST = "http://localhost:8080"
export const API_ROOT_PATH = `${BACKEND_SERVICE_HOST}/api/v1`

// Authentication paths
const API_AUTHENTICATION_PATH = "/auth"
export const API_AUTHENTICATION_LOGIN_PATH = `${API_AUTHENTICATION_PATH}/login`
export const API_AUTHENTICATION_REFRESH_PATH = `${API_AUTHENTICATION_PATH}/refresh`
export const API_AUTHENTICATION_CHECK_PATH = `${API_AUTHENTICATION_PATH}/check`
export const API_AUTHENTICATION_DOWNLOAD_TOKEN_PATH = `${API_AUTHENTICATION_PATH}/downloadToken`

// Problem root path
export const API_PROBLEM_ROOT_PATH = "/problem"
