import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import type {
  DynamicFormSection,
  DynamicHeroSection,
  DynamicRecordDetailField,
  DynamicRecordDetailTab,
  DynamicRecordListSection,
  DynamicStatsSection,
  DynamicTableColumn,
  DynamicTableSection,
  DynamicTreeRecordListSection,
  DynamicWorkflowSection,
} from '@/studio/section/model/local-section.types';
import type { GridSectionLayoutMetadata } from '@/studio/section/model/section-layout-metadata';
import type {
  StudioDetailSectionMetadata,
  StudioGridSectionMetadata,
  StudioTreeSectionMetadata,
} from '@/studio/section/model/studio-section-metadata';

interface BaseSectionMetadata {
  sectionId: string;
  title: string;
}

export interface DetailSectionMetadata extends BaseSectionMetadata {
  detailFields: DynamicRecordDetailField[];
  detailTabs?: DynamicRecordDetailTab[];
  lineColumns: DynamicTableColumn[];
  sectionType: 'DETAIL';
}

export interface LocalGridSectionMetadata extends BaseSectionMetadata {
  detail?: DetailSectionMetadata;
  fields: FieldMetadata[];
  grid: DynamicRecordListSection | DynamicTableSection;
  layout?: GridSectionLayoutMetadata;
  sectionType: 'GRID';
  source: 'LOCAL';
}

export interface TreeSectionMetadata extends BaseSectionMetadata {
  sectionType: 'TREE';
  source: 'LOCAL';
  tree: DynamicTreeRecordListSection;
}

export interface HeroSectionMetadata extends BaseSectionMetadata {
  definition: DynamicHeroSection;
  sectionType: 'HERO';
}

export interface StatsSectionMetadata extends BaseSectionMetadata {
  definition: DynamicStatsSection;
  sectionType: 'STATS';
}

export interface FormSectionMetadata extends BaseSectionMetadata {
  definition: DynamicFormSection;
  sectionType: 'FORM';
}

export interface WorkflowSectionMetadata extends BaseSectionMetadata {
  definition: DynamicWorkflowSection;
  sectionType: 'WORKFLOW';
}

export interface ProfileSectionMetadata extends BaseSectionMetadata {
  sectionType: 'PROFILE';
}

export type GridSectionMetadata =
  | LocalGridSectionMetadata
  | StudioGridSectionMetadata;

export type SectionMetadata =
  | GridSectionMetadata
  | DetailSectionMetadata
  | StudioDetailSectionMetadata
  | TreeSectionMetadata
  | StudioTreeSectionMetadata
  | HeroSectionMetadata
  | StatsSectionMetadata
  | FormSectionMetadata
  | WorkflowSectionMetadata
  | ProfileSectionMetadata;
