import { UserStateTypes } from './states.enum';

export interface User {
  id?: number;
  username: string;
  password?: string;
  name: string;
  state: UserStateTypes;
}