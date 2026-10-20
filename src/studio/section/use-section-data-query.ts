import { useQuery } from '@tanstack/react-query';

import type { StudioSectionMetadata } from '@/studio/section/model/studio-section-metadata';
import { loadStudioSectionData } from '@/studio/section/service/studio-section-service';

export const useSectionDataQuery = (
  section: StudioSectionMetadata,
  parentRecordId: string,
) =>
  useQuery({
    queryFn: () => loadStudioSectionData(section, parentRecordId),
    queryKey: ['section-data', section.sectionId, parentRecordId],
    staleTime: 30_000,
  });
