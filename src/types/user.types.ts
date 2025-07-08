export type TUsers = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export type TCreateUser = {
  username: string;
  email: string;
  password?: string;
  role: string;
};
