import { WORK_LOG_API } from '@/constants/api';
import type { ValueOptions } from '@/types/common.types';
import { apiServices } from '@/services/api';

const WorkLogServices = {
  getUserWorkLogsByDate(options?: ValueOptions) {
    return apiServices.get(WORK_LOG_API.GET_USER_WORK_LOGS, options?.params);
  },

  createOrUpdateWorkLog(options?: ValueOptions) {
    return apiServices.post(WORK_LOG_API.CREATE_OR_UPDATE, options?.params);
  },

  deleteWorkLog(id: number, options?: ValueOptions) {
    return apiServices.delete(WORK_LOG_API.DELETE(id), options?.params);
  },
};

export default WorkLogServices;
