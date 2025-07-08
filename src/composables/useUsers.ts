import { ref } from 'vue';
import type { TCreateUser, TUsers } from '@/types/user.types';
import UserServices from '@/services/user';
import { toast } from '@/utils/toast';

export const useUsers = () => {
  const users = ref<TUsers[]>([]);

  const getAllUsers = async () => {
    try {
      const { data } = await UserServices.getAllUsers();

      if (!data.success) {
        throw new Error(data.message || 'Lấy danh sách người dùng thất bại');
      }

      users.value = data.data || [];
    } catch {
      users.value = [];
    }
  };

  const createUser = async (userData: TCreateUser) => {
    try {
      const { data } = await UserServices.createUser({ params: userData });

      if (!data.success) {
        throw new Error(data.message || 'Tạo người dùng thất bại');
      }

      users.value.push(data.data);
      toast.success('Tạo người dùng thành công');
    } catch {
      toast.error('Tạo người dùng thất bại');
    }
  };

  const updateUser = async (id: number, userData: TCreateUser) => {
    try {
      const { data } = await UserServices.updateUser(id, { params: userData });
      if (!data.success) {
        throw new Error(data.message || 'Cập nhật người dùng thất bại');
      }

      const index = users.value.findIndex(user => user.id === userData.id);
      if (index !== -1) {
        users.value[index] = data.data;
      }
      toast.success('Cập nhật người dùng thành công');
    } catch {
      toast.error('Cập nhật người dùng thất bại');
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const { data } = await UserServices.deleteUser(userId);
      if (!data.success) {
        throw new Error(data.message || 'Xoá người dùng thất bại');
      }

      users.value = users.value.filter(user => user.id !== userId);
      toast.success('Xoá người dùng thành công');
    } catch {
      toast.error('Xoá người dùng thất bại');
    }
  };

  return {
    users,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
