import { ref } from 'vue';
import type { TReports } from '@/types/report.type';
import ReportServices from '@/services/report';

export const useReports = () => {
  const reports = ref<TReports[]>([]);

  const getDailySummary = async (date: string, username: string) => {
    try {
      const { data } = await ReportServices.getDailySummary({
        params: { date, username },
      });

      if (!data.success) {
        throw new Error(data.message || 'Lấy danh sách báo cáo thất bại');
      }

      reports.value = data.data || [];
    } catch {
      reports.value = [];
    }
  };

  return {
    reports,
    getDailySummary,
  };
};
