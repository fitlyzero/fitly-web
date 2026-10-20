import type { FieldMetadata } from '@/studio/field/model/field-metadata';
import type { StudioGridRowMetadata } from '@/studio/section/model/studio-grid-row-metadata';
import type { StudioSectionType } from '@/studio/section/model/studio-section-type';
import type { StudioSystemAction } from '@/studio/section/model/studio-system-action';

interface BaseStudioSectionMetadata {
  childSections: StudioSectionMetadata[];
  fields: FieldMetadata[];
  fieldsByLayout?: Partial<Record<StudioSectionType, FieldMetadata[]>>;
  parentId?: string;
  rows: StudioGridRowMetadata[];
  sectionId: string;
  sequence?: number;
  source: 'STUDIO';
  systemActions: StudioSystemAction[];
  title: string;
}

export interface StudioGridSectionMetadata extends BaseStudioSectionMetadata {
  sectionType: 'GRID';
}

export interface StudioDetailSectionMetadata extends BaseStudioSectionMetadata {
  sectionType: 'DETAIL';
}

export interface StudioTreeSectionMetadata extends BaseStudioSectionMetadata {
  sectionType: 'TREE';
}

export type StudioSectionMetadata =
  | StudioGridSectionMetadata
  | StudioDetailSectionMetadata
  | StudioTreeSectionMetadata;
