import { REPORT_API } from '@/constants/api';
import type { ValueOptions } from '@/types/common.types';
import { apiServices } from '@/services/api';

const ReportServices = {
  getDailySummary(options?: ValueOptions) {
    return apiServices.get(REPORT_API.GET_DAILY_REPORT, options?.params);
  },
};

export default ReportServices;
