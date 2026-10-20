import { mapColumnsToFields } from '@/studio/section/mapper/local-field-mapper';
import type {
  LocalGridSectionMetadata,
  SectionMetadata,
} from '@/studio/section/model/section-metadata';
import type {
  DynamicPageSection,
  DynamicRecordListSection,
  DynamicTableRow,
  DynamicTableSection,
} from '@/studio/section/model/local-section.types';

const getRows = (
  grid: DynamicRecordListSection | DynamicTableSection,
): DynamicTableRow[] =>
  grid.type === 'record-list' ? grid.rows.map((row) => row.cells) : grid.rows;

export const mapLocalGridSection = (
  section: DynamicRecordListSection | DynamicTableSection,
): LocalGridSectionMetadata => {
  const rows = getRows(section);

  return {
    detail: section.type === 'record-list'
      ? {
          detailFields: section.detailFields,
          detailTabs: section.detailTabs,
          lineColumns: section.lineColumns,
          sectionId: `${section.id}-detail`,
          sectionType: 'DETAIL',
          title: `${section.title} detail`,
        }
      : undefined,
    fields: mapColumnsToFields(section.columns, rows),
    grid: section,
    sectionId: section.id,
    sectionType: 'GRID',
    source: 'LOCAL',
    title: section.title,
  };
};

export const mapLocalSection = (section: DynamicPageSection): SectionMetadata => {
  switch (section.type) {
    case 'record-list':
    case 'table':
      return mapLocalGridSection(section);
    case 'tree-record-list':
      return {
        sectionId: section.id,
        sectionType: 'TREE',
        source: 'LOCAL',
        title: section.title,
        tree: section,
      };
    case 'hero':
      return {
        definition: section,
        sectionId: section.id,
        sectionType: 'HERO',
        title: section.title,
      };
    case 'stats':
      return {
        definition: section,
        sectionId: section.id,
        sectionType: 'STATS',
        title: section.title,
      };
    case 'form':
      return {
        definition: section,
        sectionId: section.id,
        sectionType: 'FORM',
        title: section.title,
      };
    case 'workflow':
      return {
        definition: section,
        sectionId: section.id,
        sectionType: 'WORKFLOW',
        title: section.title,
      };
  }
};
