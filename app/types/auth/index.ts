export type RegisterRequestBody = {
  email: string;
  password: string;
  name?: string;
};

export type RegisterResponseBody = {
  id: string;
  email: string;
  name: string | null;
};
