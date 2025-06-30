import type { TTasks } from '@/types/task.type.ts';

export type TStandards = {
  dailyMinimum: number;
  task: TTasks;
};

export type TStandardRequest = {
  taskId: number;
  dailyMinimum: number;
};
