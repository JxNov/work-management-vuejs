import { ref } from 'vue';
import type { TWorkLogRequest, TWorkLogs } from '@/types/workLog.type';
import WorkLogServices from '@/services/workLog';
import { toast } from '@/utils/toast';

export const useWorkLogs = () => {
  const workLogs = ref<TWorkLogs[]>([]);

  const getUserWorkLogsByDate = async (date: string) => {
    try {
      const { data } = await WorkLogServices.getUserWorkLogsByDate({
        params: { date },
      });

      if (!data.success) {
        throw new Error(data.message || 'Lấy danh sách công việc thất bại');
      }

      workLogs.value = data.data || [];
    } catch {
      workLogs.value = [];
    }
  };

  const createOrUpdateWorkLog = async (workLog: TWorkLogRequest) => {
    try {
      const { data } = await WorkLogServices.createOrUpdateWorkLog({ params: workLog });

      if (!data.success) {
        throw new Error(data.message || 'Tạo công việc thất bại');
      }

      workLogs.value.push(data.data);
      toast.success('Tạo công việc thành công');
    } catch {
      toast.error('Tạo công việc thất bại');
    }
  };

  return {
    workLogs,
    getUserWorkLogsByDate,
    createOrUpdateWorkLog,
  };
};
