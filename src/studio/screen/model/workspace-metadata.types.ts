import type { DynamicPageSchema } from '@/studio/screen/model/local-screen.types';

export type WorkspaceModuleKey =
  | 'customers'
  | 'dashboard'
  | 'employees'
  | 'finance'
  | 'finance-invoices'
  | 'invoices'
  | 'organization'
  | 'price-list'
  | 'products'
  | 'purchase-orders'
  | 'purchase-requests'
  | 'sales-invoices'
  | 'sales-orders'
  | 'stock-transfers'
  | 'tasks'
  | 'vendors'
  | 'warehouse'
  | 'access-control';

export interface WorkspaceNavItem {
  children?: WorkspaceNavItem[];
  description: string;
  disabled?: boolean;
  key: string;
  label: string;
  moduleKey?: WorkspaceModuleKey;
  screenId?: string;
}

export type WorkspaceModuleSchema = DynamicPageSchema & {
  moduleKey: WorkspaceModuleKey;
};
