export const BACKEND_SERVICE_HOST = "http://localhost:8080"
export const API_ROOT_PATH = `${BACKEND_SERVICE_HOST}/api/v1`

// Actuator paths
export const API_ACTUATOR_HEALTH_PATH = `${BACKEND_SERVICE_HOST}/actuator/health`

// Authentication paths
const API_AUTHENTICATION_PATH = "/auth"
export const API_AUTHENTICATION_LOGIN_PATH = `${API_AUTHENTICATION_PATH}/login`
export const API_AUTHENTICATION_REFRESH_PATH = `${API_AUTHENTICATION_PATH}/refresh`
export const API_AUTHENTICATION_CHECK_PATH = `${API_AUTHENTICATION_PATH}/check`

// User Paths
export const API_USER_PATH = "/user"
export const API_USER_PROFILE_PICTURE_PATH = `${API_USER_PATH}/profile/picture`

// Master Paths
export const API_MASTER_PATH = "/master"
export const API_MASTER_REGISTER_PATH = `${API_MASTER_PATH}/register`

// Slave Paths
export const API_STUDENT_PATH = "/student"
export const API_STUDENT_REGISTER_PATH = `${API_STUDENT_PATH}/register`

// Problem Paths
const API_PROBLEM_PATH = "/problem"
export const API_PROBLEM_CREATE_PATH = `${API_PROBLEM_PATH}/create`
export const API_PROBLEM_RETRIEVE_OWNER_PROBLEMS_PATH = `${API_PROBLEM_PATH}/owner`

// University Paths
export const API_UNIVERSITY_PATH = "/university"
export const API_UNIVERSITY_REGISTER_PATH = `${API_UNIVERSITY_PATH}/register`
export const API_UNIVERSITY_DELETE_PATH = `${API_UNIVERSITY_PATH}/{0}`
export const API_UNIVERSITY_LIST_FACULTIES_PATH = `${API_UNIVERSITY_PATH}/{0}/faculty`
