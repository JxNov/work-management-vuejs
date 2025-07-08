import { ref } from 'vue';
import type { TStandardRequest, TStandards } from '@/types/standard.type.ts';
import StandardServices from '@/services/standard';
import { toast } from '@/utils/toast';

export const useStandards = () => {
  const standards = ref<TStandards[]>([]);

  const getAllStandards = async () => {
    try {
      const { data } = await StandardServices.getAllStandards();

      if (!data.success) {
        throw new Error(data.message || 'Lấy danh sách tiêu chuẩn thất bại');
      }

      standards.value = data.data || [];
    } catch {
      standards.value = [];
    }
  };

  const setStandard = async (standard: TStandardRequest) => {
    try {
      const { data } = await StandardServices.setStandard({ params: standard });

      if (!data.success) {
        throw new Error(data.message || 'Cập nhật tiêu chuẩn thất bại');
      }

      if (standard.id) {
        const index = standards.value.findIndex(s => s.id === standard.id);
        if (index !== -1) {
          standards.value[index] = { ...standards.value[index], ...standard };
        }
      } else {
        standards.value.push(data.data);
      }
      toast.success('Cập nhật tiêu chuẩn thành công');
    } catch {
      toast.error('Cập nhật tiêu chuẩn thất bại');
    }
  };

  const deleteStandard = async (id: number) => {
    try {
      const { data } = await StandardServices.deleteStandard(id);
      if (!data.success) {
        throw new Error(data.message || 'Xoá tiêu chuẩn thất bại');
      }

      standards.value = standards.value.filter(standard => standard.id !== id);
      toast.success('Xoá tiêu chuẩn thành công');
    } catch {
      toast.error('Xoá tiêu chuẩn thất bại');
    }
  };

  return {
    standards,
    getAllStandards,
    setStandard,
    deleteStandard,
  };
};
