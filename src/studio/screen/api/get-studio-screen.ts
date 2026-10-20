import { getRequiredJson, unwrapApiResponse } from '@/api/http';
import type { BaseResponse } from '@/common/api/base-response';
import type { GetScreenRequest } from '@/studio/screen/model/get-screen-request';
import type { ScreenResponse } from '@/studio/screen/model/screen-response';
import { createQuery } from '@/studio/shared/api/create-query';

export const getStudioScreen = async (
  request: GetScreenRequest,
): Promise<ScreenResponse> => {
  const response = await getRequiredJson<BaseResponse<ScreenResponse>>(
    `/studio/ui/screen?${createQuery({ screen_id: request.screen_id })}`,
  );

  return unwrapApiResponse(response);
};
