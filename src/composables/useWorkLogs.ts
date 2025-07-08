import { ref } from 'vue';
import type { TWorkLogRequest, TWorkLogs } from '@/types/workLog.type';
import WorkLogServices from '@/services/workLog';
import { toast } from '@/utils/toast';

export const useWorkLogs = () => {
  const workLogs = ref<TWorkLogs | null>(null);

  const getUserWorkLogsByDate = async (date: string) => {
    try {
      const { data } = await WorkLogServices.getUserWorkLogsByDate({
        params: { date },
      });

      if (!data.success) {
        throw new Error(data.message || 'Lấy danh sách công việc thất bại');
      }

      workLogs.value = data.data || null;
    } catch {
      workLogs.value = null;
    }
  };

  const createOrUpdateWorkLog = async (workLog: TWorkLogRequest) => {
    try {
      const { data } = await WorkLogServices.createOrUpdateWorkLog({ params: workLog });

      if (!data.success) {
        throw new Error(data.message || 'Tạo công việc thất bại');
      }

      if (!workLogs.value) return;

      const existingLogIndex = workLogs.value.logs.findIndex(log => log.id === data.data.id);
      if (existingLogIndex !== -1) {
        workLogs.value.logs[existingLogIndex] = {
          ...workLogs.value.logs[existingLogIndex],
          ...data.data,
        };
      } else {
        workLogs.value.logs.push(data.data);
      }
      workLogs.value.total = (workLogs.value.total || 0) + data.data.quantity;

      toast.success('Tạo công việc thành công');
    } catch {
      toast.error('Tạo công việc thất bại');
    }
  };

  const deleteWorkLog = async (id: number) => {
    try {
      const { data } = await WorkLogServices.deleteWorkLog(id);

      if (!data.success) {
        throw new Error(data.message || 'Xóa công việc thất bại');
      }

      if (!workLogs.value) return;
      workLogs.value.logs = workLogs.value.logs.filter(log => log.id !== id);
      toast.success('Xóa công việc thành công');
    } catch {
      toast.error('Xóa công việc thất bại');
    }
  };

  return {
    workLogs,
    getUserWorkLogsByDate,
    createOrUpdateWorkLog,
    deleteWorkLog,
  };
};
