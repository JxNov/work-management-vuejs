import { USER_API } from '@/constants/api';
import type { ValueOptions } from '@/types/common.types';
import { apiServices } from '@/services/api';

const UserServices = {
  getAllUsers(options?: ValueOptions) {
    return apiServices.get(USER_API.GET_ALL, options?.params);
  },

  createUser(options?: ValueOptions) {
    return apiServices.post(USER_API.CREATE, options?.params);
  },

  updateUser(id: number, options?: ValueOptions) {
    return apiServices.patch(USER_API.UPDATE(id), options?.params);
  },

  deleteUser(id: number, options?: ValueOptions) {
    return apiServices.delete(USER_API.DELETE(id), options?.params);
  },
};

export default UserServices;
