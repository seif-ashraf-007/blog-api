export type ApiResponse<T> = {
  data: T;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  success?: boolean;
};
