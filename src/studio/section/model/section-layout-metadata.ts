export interface GridRecordChildLayoutMetadata {
  defaultHeight?: number;
  initiallyCollapsed?: boolean;
  minHeight?: number;
}

export interface GridSectionLayoutMetadata {
  recordChild?: GridRecordChildLayoutMetadata;
}
