import { STANDARD_API } from '@/constants/api';
import type { ValueOptions } from '@/types/common.types';
import { apiServices } from '@/services/api';

const StandardServices = {
  getAllStandards(options?: ValueOptions) {
    return apiServices.get(STANDARD_API.GET_ALL, options?.params);
  },

  setStandard(options?: ValueOptions) {
    return apiServices.post(STANDARD_API.SET_STANDARD, options?.params);
  },

  deleteStandard(id: number, options?: ValueOptions) {
    return apiServices.delete(STANDARD_API.DELETE_STANDARD(id), options?.params);
  },
};

export default StandardServices;
