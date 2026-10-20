import { getStudioSectionData } from '@/studio/section/api/get-studio-section-data';
import { mapStudioSectionData } from '@/studio/section/mapper/studio-section-mapper';
import type { StudioSectionMetadata } from '@/studio/section/model/studio-section-metadata';

export const loadStudioSectionData = async (
  section: StudioSectionMetadata,
  parentRecordId?: string,
): Promise<StudioSectionMetadata> => {
  const response = await getStudioSectionData({
    parent_record_id: parentRecordId,
    section_id: section.sectionId,
  });

  return mapStudioSectionData(section, response);
};
