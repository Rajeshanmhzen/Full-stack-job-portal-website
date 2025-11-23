const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const USER_API_END_POINT = `${API_BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/api/v1/application`;
export const RESUME_API_END_POINT = `${API_BASE_URL}/api/v1/resume`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/api/v1/company`;
export const SERVER_BASE_URL = API_BASE_URL;
export const NOTIFICATION_API_END_POINT = `${API_BASE_URL}/api/v1/notification`;