import type { MessageResponse } from '@/common/api/message-response';

export interface BaseResponse<TData> {
  data?: TData;
  err_message?: MessageResponse | null;
  status?: number;
}
