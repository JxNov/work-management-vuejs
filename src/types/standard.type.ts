import type { TTasks } from '@/types/task.type.ts';

export type TStandards = {
  id: number;
  dailyMinimum: number;
  task: TTasks;
};

export type TStandardRequest = {
  id?: number;
  taskId: number;
  dailyMinimum: number;
};
