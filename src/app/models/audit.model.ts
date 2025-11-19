import { AuditActionTypes } from './audit-actions.enum';

export interface Audit {
  id?: number;
  user_id?: number;
  act?: AuditActionTypes;
  date?: Date;
  comment_id?: number;
  details?: string;
  before_state?: number;
  after_state?: number;
  before_text?: string;
  after_text?: string;
  change_reason?: string;
}