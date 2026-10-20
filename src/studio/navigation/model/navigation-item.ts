import type { WorkspaceTarget } from '@/workspace/model/workspace-target';

export interface NavigationItem {
  children?: NavigationItem[];
  description: string;
  disabled?: boolean;
  key: string;
  label: string;
  target?: WorkspaceTarget;
}
