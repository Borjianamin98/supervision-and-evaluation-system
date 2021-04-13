export const BACKEND_SERVICE_HOST = "http://localhost:8080"
export const API_ROOT_PATH = `${BACKEND_SERVICE_HOST}/api/v1`

// Actuator paths
export const API_ACTUATOR_HEALTH_PATH = `${BACKEND_SERVICE_HOST}/actuator/health`

// Authentication paths
const API_AUTHENTICATION_PATH = "/auth"
export const API_AUTHENTICATION_LOGIN_PATH = `${API_AUTHENTICATION_PATH}/login`
export const API_AUTHENTICATION_REFRESH_PATH = `${API_AUTHENTICATION_PATH}/refresh`

// User Paths
export const API_USER_PATH = "/user"
export const API_USER_PROFILE_PICTURE_PATH = `${API_USER_PATH}/profile/picture`