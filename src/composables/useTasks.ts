import { ref } from 'vue';
import type { TTasks } from '@/types/task.type';
import TaskServices from '@/services/task';
import { toast } from '@/utils/toast';

export const useTasks = () => {
  const tasks = ref<TTasks[]>([]);

  const getAllTasks = async () => {
    try {
      const { data } = await TaskServices.getAllTasks();

      if (!data.success) {
        throw new Error(data.message || 'Lấy danh sách công việc thất bại');
      }

      tasks.value = data.data || [];
    } catch {
      tasks.value = [];
    }
  };

  const createTask = async (task: TTasks) => {
    try {
      const { data } = await TaskServices.createTask({ params: task });

      if (!data.success) {
        throw new Error(data.message || 'Tạo công việc thất bại');
      }

      tasks.value.push(data.data);
      toast.success('Tạo công việc thành công');
    } catch {
      toast.error('Tạo công việc thất bại');
    }
  };

  return {
    tasks,
    getAllTasks,
    createTask,
  };
};
