export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  id: number;
  name: string;
  refreshToken: string;
  state: number;
  username: string;
}
