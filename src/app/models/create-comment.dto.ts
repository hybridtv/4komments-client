import { ItemType } from './items.enum';

export interface CreateCommentDto {
  parent_id?: number;
  item_id: number;
  item_type: ItemType;
  user_name: string;
  text: string;
  email?: string;
}