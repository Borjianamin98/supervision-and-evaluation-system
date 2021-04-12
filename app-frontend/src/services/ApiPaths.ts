export const API_ROOT_PATH = "http://localhost:8080/api/v1"

// Actuator paths
export const API_ACTUATOR_HEALTH_PATH = `${API_ROOT_PATH}/actuator/health`

// Authentication paths
const API_AUTHENTICATION_PATH = "/auth"
export const API_AUTHENTICATION_LOGIN_PATH = `${API_AUTHENTICATION_PATH}/login`
export const API_AUTHENTICATION_REFRESH_PATH = `${API_AUTHENTICATION_PATH}/refresh`

// User Paths
export const API_USER_PATH = "/user"
export const API_USER_PROFILE_PICTURE_PATH = `${API_USER_PATH}/profile/picture`