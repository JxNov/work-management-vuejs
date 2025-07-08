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

  updateTask(id: number, options?: ValueOptions) {
    return apiServices.patch(TASK_API.UPDATE(id), options?.params);
  },

  deleteTask(id: number, options?: ValueOptions) {
    return apiServices.delete(TASK_API.DELETE(id), options?.params);
  },
};

export default TaskServices;
