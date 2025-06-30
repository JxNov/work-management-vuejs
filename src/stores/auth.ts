import { ROUTES } from '@/constants/routers';
import { ACCESS_TOKEN, REFRESH_TOKEN, PROFILE } from '@/constants/variables';
import AuthServices from '@/services/auth';
import type { TUsers } from '@/types/user.types';
import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from '@/utils/toast';

export const useAuthStore = defineStore('auth', () => {
  const users = ref<TUsers | null>(
    Cookies.get(PROFILE) ? JSON.parse(Cookies.get(PROFILE) as string) : null
  );
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const router = useRouter();

  const login = async (payload: { email: string; password: string }) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await AuthServices.login({ params: payload });

      if (!data.success) {
        throw new Error(data.message || 'Đăng nhập thất bại!');
      }

      Cookies.set(ACCESS_TOKEN, data.data.accessToken);
      Cookies.set(REFRESH_TOKEN, data.data.refreshToken);

      await profile();
      toast.success(data.message, 5000);
      await router.push(ROUTES.HOME);
    } catch {
      error.value = 'Đăng nhập thất bại!';
      toast.error(error.value, 5000);
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    users.value = null;

    try {
      const { data } = await AuthServices.logout();

      if (!data.success) {
        throw new Error(data.message || 'Đăng xuất thất bại!');
      }

      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);

      toast.success(data.message, 5000);
      await router.push(ROUTES.AUTH_LOGIN);
    } catch {
      error.value = 'Đăng xuất thất bại!';
      toast.error(error.value, 5000);
    } finally {
      loading.value = false;
    }
  };

  const profile = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await AuthServices.profile();

      if (!data.success) {
        throw new Error(data.message || 'Lấy thông tin người dùng thất bại!');
      }

      users.value = data.data;
      Cookies.set(PROFILE, JSON.stringify(data.data));
    } catch (err) {
      error.value = (err as Error).message || 'Lấy thông tin người dùng thất bại!';
      toast.error(error.value, 5000);
    } finally {
      loading.value = false;
    }
  };

  const refreshToken = async (refreshToken: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await AuthServices.refreshToken({ params: { refreshToken } });

      if (!data.success) {
        throw new Error(data.message || 'Làm mới token thất bại!');
      }

      Cookies.set(ACCESS_TOKEN, data.data.accessToken);
      Cookies.set(REFRESH_TOKEN, data.data.refreshToken);

      await profile();
    } catch (err) {
      error.value = (err as Error).message || 'Làm mới token thất bại!';
      toast.error(error.value, 5000);
    } finally {
      loading.value = false;
    }
  };

  return { users, loading, error, login, logout, profile, refreshToken };
});
