
export enum Role {
  ADMIN = 'مدير',
  EMPLOYEE = 'موظف'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
  phone: string;
  address: string;
  startDate: string;
  permissions: string[];
}

export interface Product {
  code: string;
  name: string;
  priceBeforeTax: number;
  priceAfterTax: number;
  stock: number;
}

export interface Company {
  id: number;
  name: string;
  products: Product[];
}

export interface Payment {
  amount: number;
  date: string;
}

export interface Invoice {
  id: number;
  companyId: number;
  companyName: string;
  items: {
    code: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  total: number;
  date: string;
  status: 'تم التسليم' | 'قيد الانتظار';
  payments: Payment[];
  isPaid: boolean;
}

export interface SaleItem {
  code: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  items: SaleItem[];
  total: number;
  receivedAmount: number;
  changeAmount: number;
  date: string;
}

export interface AppSettings {
  appName: string;
  profitMargin: number;
  lowStockThreshold: number;
  isGlassMode: boolean;
  sidebarNames: { [key: string]: string };
}
