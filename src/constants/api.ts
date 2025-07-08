export const AUTH_API = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  REFRESH_TOKEN: 'auth/refresh-token',
  PROFILE: 'auth/profile',
};

export const USER_API = {
  GET_ALL: 'users',
  CREATE: 'users',
  UPDATE: (id: number) => `users/${id}`,
  DELETE: (id: number) => `users/${id}`,
};

export const TASK_API = {
  GET_ALL: 'tasks',
  CREATE: 'tasks',
  UPDATE: (id: number) => `tasks/${id}`,
  DELETE: (id: number) => `tasks/${id}`,
};

export const WORK_LOG_API = {
  GET_USER_WORK_LOGS: 'work-logs',
  CREATE_OR_UPDATE: 'work-logs',
  DELETE: (id: number) => `work-logs/${id}`,
};

export const REPORT_API = {
  GET_DAILY_REPORT: 'reports/daily',
};

export const STANDARD_API = {
  GET_ALL: 'standards',
  SET_STANDARD: 'standards',
  DELETE_STANDARD: (id: number) => `standards/${id}`,
};
