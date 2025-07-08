export type TWorkLogs = {
  username: string;
  total: number;
  logs: {
    id: number;
    date: string;
    taskId: number;
    task: string;
    quantity: number;
    isEnough: boolean;
  }[];
};

export type TWorkLogRequest = {
  date: string;
  taskId: number;
  quantity: number;
};
