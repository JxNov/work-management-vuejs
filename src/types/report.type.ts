type Log = {
  date: string;
  task: string;
  quantity: number;
};

export type TReports = {
  username: string;
  total: number;
  logs: Log[];
};
