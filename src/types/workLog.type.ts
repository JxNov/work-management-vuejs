import type { TTasks } from '@/types/task.type';

export type TWorkLogs = {
  date: string;
  quantity: number;
  users: {
    username: string;
  };
  tasks: TTasks;
};

export type TWorkLogRequest = {
  date: string;
  taskId: number;
  quantity: number;
};
