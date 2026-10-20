import { getStudioScreen } from '@/studio/screen/api/get-studio-screen';
import type { ScreenMetadata } from '@/studio/screen/model/screen-metadata';
import {
  getOrderedStudioChildren,
  mapStudioSectionStructure,
  requireStudioString,
  type OrderedStudioSection,
} from '@/studio/section/mapper/studio-section-mapper';
import type { StudioSectionMetadata } from '@/studio/section/model/studio-section-metadata';
import { loadStudioSectionData } from '@/studio/section/service/studio-section-service';

const mapSectionTree = (
  orderedSection: OrderedStudioSection,
): StudioSectionMetadata => {
  const section = mapStudioSectionStructure(orderedSection);
  const childSections = getOrderedStudioChildren(orderedSection.section).map((child) =>
    mapSectionTree({ parentId: section.sectionId, section: child }));

  return { ...section, childSections };
};

export const loadStudioScreen = async (
  requestedScreenId: string,
): Promise<ScreenMetadata> => {
  const response = await getStudioScreen({ screen_id: requestedScreenId });
  // Child section data depends on the selected parent record, so only the root
  // section data is loaded here; children load in StudioChildSectionContent.
  const rootSection = await loadStudioSectionData(
    mapSectionTree({ section: response.section_tree ?? {} }),
  );

  return {
    screenId: requireStudioString(response.screen_id),
    sections: [rootSection],
    title: requireStudioString(response.name),
  };
};
