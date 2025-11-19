import { CommentStateTypes } from './states.enum';

export interface History {
  id?: number;
  comment_id?: number;
  version?: number;
  snapshot_text?: string;
  snapshot_state?: CommentStateTypes;
  change_reason?: string;
  timestamp?: Date;
  user_id?: number;
}