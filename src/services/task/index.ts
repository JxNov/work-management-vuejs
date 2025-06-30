import { TASK_API } from '@/constants/api';
import type { ValueOptions } from '@/types/common.types';
import { apiServices } from '@/services/api';

const TaskServices = {
  getAllTasks(options?: ValueOptions) {
    return apiServices.get(TASK_API.GET_ALL, options?.params);
  },

  createTask(options?: ValueOptions) {
    return apiServices.post(TASK_API.CREATE, options?.params);
  },
};

export default TaskServices;
