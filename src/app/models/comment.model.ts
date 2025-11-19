import { ItemType } from './items.enum';
import { CommentStateTypes } from './states.enum';

export interface Comment {
  id?: number;
  parent_id?: number;
  item_id: number;
  item_type: ItemType;
  user_name: string;
  user_id?: number;
  created?: Date;
  modified?: Date;
  text: string;
  state?: CommentStateTypes;
  email?: string;
  ip?: string;
  likes?: number;
}