import { AUTH_API } from '@/constants/api';
import type { ValueOptions } from '@/types/common.types';
import { apiServices } from '@/services/api';

const AuthServices = {
  login(options?: ValueOptions) {
    return apiServices.post(AUTH_API.LOGIN, options?.params);
  },

  logout(options?: ValueOptions) {
    return apiServices.post(AUTH_API.LOGOUT, options?.params);
  },

  refreshToken(options?: ValueOptions) {
    return apiServices.post(AUTH_API.REFRESH_TOKEN, options?.params);
  },

  profile(options?: ValueOptions) {
    return apiServices.get(AUTH_API.PROFILE, options?.params);
  },
};

export default AuthServices;
