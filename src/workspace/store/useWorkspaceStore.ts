import { create } from 'zustand';

import type { WorkspaceTab } from '@/workspace/model/workspace-tab';
import type { WorkspaceTarget } from '@/workspace/model/workspace-target';

interface WorkspaceState {
  activeScreenId: string;
  closeTarget: (screenId: string) => void;
  openTarget: (target: WorkspaceTarget, label?: string) => void;
  openTabs: WorkspaceTab[];
  resetWorkspace: () => void;
  selectTarget: (screenId: string) => void;
}

const dashboardTab: WorkspaceTab = {
  label: 'Dashboard',
  screenId: 'dashboard',
  type: 'SCREEN',
};

const createWorkspaceState = (): Pick<WorkspaceState, 'activeScreenId' | 'openTabs'> => ({
  activeScreenId: dashboardTab.screenId,
  openTabs: [dashboardTab],
});

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  ...createWorkspaceState(),
  closeTarget: (screenId) =>
    set((state) => {
      const nextTabs = state.openTabs.filter((tab) => tab.screenId !== screenId);

      if (nextTabs.length === 0) {
        return createWorkspaceState();
      }

      if (state.activeScreenId !== screenId) {
        return { openTabs: nextTabs };
      }

      const closedIndex = state.openTabs.findIndex((tab) => tab.screenId === screenId);
      return {
        activeScreenId: nextTabs[Math.max(0, closedIndex - 1)]?.screenId ?? nextTabs[0].screenId,
        openTabs: nextTabs,
      };
    }),
  openTarget: (target, label) =>
    set((state) => ({
      activeScreenId: target.screenId,
      openTabs: state.openTabs.some((tab) => tab.screenId === target.screenId)
        ? state.openTabs
        : [...state.openTabs, { ...target, label: label ?? target.screenId }],
    })),
  resetWorkspace: () => set(createWorkspaceState()),
  selectTarget: (screenId) => set({ activeScreenId: screenId }),
}));

export const resetWorkspaceStore = (): void => {
  useWorkspaceStore.setState(createWorkspaceState());
};
