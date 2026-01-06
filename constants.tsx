
import { AppSettings, Role, User } from './types';

export const INITIAL_SETTINGS: AppSettings = {
  appName: 'Market Pro',
  profitMargin: 14,
  isGlassMode: false,
  sidebarNames: {
    dailySales: 'المبيعات اليومية',
    createInvoice: 'إنشاء فاتورة',
    transferredOrders: 'الأوردرات المرحلة',
    priceLists: 'قوائم أسعار الشركات',
    inventory: 'المخزون',
    salesReports: 'المبيعات',
    settings: 'الاعدادات'
  }
};

export const INITIAL_ADMIN: User = {
  id: '1',
  username: 'admin',
  password: 'admin',
  role: Role.ADMIN,
  phone: '0123456789',
  address: 'المكتب الرئيسي',
  startDate: new Date().toISOString(),
  permissions: ['dailySales', 'createInvoice', 'transferredOrders', 'priceLists', 'inventory', 'salesReports']
};
