import {
  AccountBalanceWalletOutlined,
  AdminPanelSettingsOutlined,
  AppsOutlined,
  AssignmentTurnedInOutlined,
  DashboardOutlined,
  DescriptionOutlined,
  GroupOutlined,
  HistoryOutlined,
  Inventory2Outlined,
  PointOfSaleOutlined,
  ShoppingCartOutlined,
  StorefrontOutlined,
} from '@mui/icons-material';
import type { ReactElement } from 'react';

const screenIcons: Record<string, ReactElement> = {
  'access-control': <AdminPanelSettingsOutlined />,
  customers: <GroupOutlined />,
  dashboard: <DashboardOutlined />,
  employees: <GroupOutlined />,
  finance: <AccountBalanceWalletOutlined />,
  'finance-invoices': <DescriptionOutlined />,
  invoices: <DescriptionOutlined />,
  organization: <GroupOutlined />,
  'price-list': <PointOfSaleOutlined />,
  products: <Inventory2Outlined />,
  'purchase-orders': <DescriptionOutlined />,
  'purchase-requests': <DescriptionOutlined />,
  'sales-invoices': <DescriptionOutlined />,
  'sales-orders': <ShoppingCartOutlined />,
  'stock-transfers': <AppsOutlined />,
  tasks: <AssignmentTurnedInOutlined />,
  vendors: <GroupOutlined />,
  warehouse: <AppsOutlined />,
};

const groupIcons: Record<string, ReactElement> = {
  administration: <AdminPanelSettingsOutlined />,
  finance: <AccountBalanceWalletOutlined />,
  purchase: <DescriptionOutlined />,
  sales: <StorefrontOutlined />,
  task: <AssignmentTurnedInOutlined />,
  warehouse: <AppsOutlined />,
};

export const getNavigationIcon = (key: string, screenId?: string): ReactElement =>
  (screenId ? screenIcons[screenId] : undefined)
  ?? groupIcons[key]
  ?? <HistoryOutlined />;
