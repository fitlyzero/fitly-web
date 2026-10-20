import type { WorkspaceTarget } from '@/workspace/model/workspace-target';

export interface WorkspaceTab extends WorkspaceTarget {
  label: string;
}
