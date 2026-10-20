import type { WorkspaceNavItem } from '@/studio/screen/model/workspace-metadata.types';

// Development fallback used only when /api/workspace/navigation is unavailable.
export const demoNavigation: WorkspaceNavItem[] = [
  {
    key: 'dashboard',
    moduleKey: 'dashboard',
    label: 'Dashboard',
    description: 'KPI and workflow overview',
  },
  {
    key: 'task',
    label: 'Task',
    description: 'Workflow and approvals',
    children: [
      {
        key: 'task-workflow',
        moduleKey: 'tasks',
        label: 'Workflow',
        description: 'Stage-based task flow',
      },
    ],
  },
  {
    key: 'sales',
    label: 'Sales',
    description: 'Sales and customer orders',
    children: [
      {
        key: 'sales-orders',
        moduleKey: 'sales-orders',
        label: 'Sales Order',
        description: 'Customer order list',
      },
      {
        key: 'sales-invoices',
        moduleKey: 'sales-invoices',
        label: 'Sales Invoice',
        description: 'Billing documents',
      },
      {
        key: 'invoices',
        moduleKey: 'invoices',
        label: 'Invoice',
        description: 'Dynamic invoice workspace',
      },
      {
        key: 'customers',
        moduleKey: 'customers',
        label: 'Customers',
        description: 'Customer master data',
      },
      {
        key: 'products',
        moduleKey: 'products',
        label: 'Products',
        description: 'Sellable catalog',
      },
      {
        key: 'price-list',
        moduleKey: 'price-list',
        label: 'Price List',
        description: 'Pricing tables',
      },
    ],
  },
  {
    key: 'purchase',
    label: 'Purchase',
    description: 'Buying and approvals',
    children: [
      {
        key: 'purchase-orders',
        moduleKey: 'purchase-orders',
        label: 'Purchase Orders',
        description: 'Request queues and approval routing',
      },
      {
        key: 'purchase-request',
        moduleKey: 'purchase-requests',
        label: 'Purchase Request',
        description: 'Internal demand intake',
      },
      {
        key: 'vendors',
        moduleKey: 'vendors',
        label: 'Vendors',
        description: 'Supplier master data',
      },
    ],
  },
  {
    key: 'warehouse',
    label: 'Warehouse',
    description: 'Stock and movement',
    children: [
      {
        key: 'inventory-overview',
        moduleKey: 'warehouse',
        label: 'Inventory',
        description: 'Stock balance table',
      },
      {
        key: 'stock-transfer',
        moduleKey: 'stock-transfers',
        label: 'Stock Transfer',
        description: 'Inventory movement',
      },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    description: 'Receivable and payable',
    children: [
      {
        key: 'finance-overview',
        moduleKey: 'finance',
        label: 'Finance Overview',
        description: 'Cash and document status',
      },
      {
        key: 'invoices',
        moduleKey: 'finance-invoices',
        label: 'Invoices',
        description: 'AR and AP invoice queue',
      },
    ],
  },
  {
    key: 'administration',
    label: 'Administration',
    description: 'Master data and governance',
    children: [
      {
        key: 'system-user',
        screenId: '019fe523-8616-7195-95af-c9176f5b8450',
        label: 'System User',
        description: 'System user accounts',
      },
      {
        key: 'table-column',
        screenId: '01a153d8-5d58-7c10-a41e-91d614c54329',
        label: 'Table & Column',
        description: 'Table and column metadata',
      },
      {
        key: 'employees',
        moduleKey: 'employees',
        label: 'Employees',
        description: 'Master data, onboarding, and org changes',
      },
      {
        key: 'organization',
        moduleKey: 'organization',
        label: 'Organization',
        description: 'Tree-based organization and department master data',
      },
      {
        key: 'access-control',
        moduleKey: 'access-control',
        label: 'Access Control',
        description: 'Permission baselines and review policies',
      },
    ],
  },
];
