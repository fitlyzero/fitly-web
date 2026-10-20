import { getRequiredJson, unwrapApiResponse } from '@/api/http';
import type { BaseResponse } from '@/common/api/base-response';
import type { GetSectionDataRequest } from '@/studio/section/model/get-section-data-request';
import type { SectionDataResponse } from '@/studio/section/model/section-data-response';
import { createQuery } from '@/studio/shared/api/create-query';

export const getStudioSectionData = async (
  request: GetSectionDataRequest,
): Promise<SectionDataResponse> => {
  const response = await getRequiredJson<BaseResponse<SectionDataResponse>>(
    `/studio/data/section?${createQuery({
      section_id: request.section_id,
      ...(request.parent_record_id ? { parent_record_id: request.parent_record_id } : {}),
    })}`,
  );

  return unwrapApiResponse(response);
};
