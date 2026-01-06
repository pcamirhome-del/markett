
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Bell, 
  Menu, 
  LogOut, 
  Settings as SettingsIcon, 
  ShoppingCart, 
  FilePlus, 
  Truck, 
  List, 
  Box, 
  BarChart, 
  X, 
  Palette,
  Search,
  Plus,
  Trash2,
  Edit,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  User, 
  Role, 
  AppSettings, 
  Company, 
  Invoice, 
  Product, 
  Sale, 
  SaleItem 
} from './types';
import { INITIAL_SETTINGS, INITIAL_ADMIN } from './constants';

// --- Main App Component ---
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [users, setUsers] = useState<User[]>([INITIAL_ADMIN]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [activeSection, setActiveSection] = useState('dailySales');
  const [showLoginWelcome, setShowLoginWelcome] = useState(false);
  const [time, setTime] = useState(new Date());

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Auth Handlers
  const handleLogin = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setShowLoginWelcome(true);
      setTimeout(() => setShowLoginWelcome(false), 3000);
    } else {
      alert('خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsSidebarOpen(false);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen flex flex-col ${settings.isGlassMode ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' : 'bg-slate-50'}`}>
      
      {/* Welcome Popup */}
      {showLoginWelcome && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-white/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-white/50 flex items-center gap-3 animate-bounce">
          <div className="bg-green-100 p-2 rounded-full text-green-600">
            <CheckCircle size={24} />
          </div>
          <span className="text-lg font-bold">مرحباً بك، {currentUser.username}</span>
        </div>
      )}

      {/* Header */}
      <header className={`h-16 flex items-center justify-between px-4 sticky top-0 z-50 ${settings.isGlassMode ? 'glass text-white' : 'bg-white shadow-sm text-slate-800'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-black/10 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black">{settings.appName}</h1>
            <div className="h-4 w-px bg-current opacity-20 mx-2"></div>
            <span className="text-sm font-medium hidden md:block">المستخدم: {currentUser.username}</span>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center">
          <span className="text-sm font-bold">{formatTime(time)}</span>
          <span className="text-[10px] opacity-70">{formatDate(time)}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setSettings(s => ({...s, isGlassMode: !s.isGlassMode}))}
            className="p-2 hover:bg-black/10 rounded-full"
            title="تغيير النمط"
          >
            <Palette size={20} />
          </button>
          <button className="p-2 hover:bg-black/10 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50/10 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-all text-red-500 font-bold border border-red-500/20">
            <span className="hidden sm:inline">خروج</span>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-72 z-[70] transition-transform duration-300 transform shadow-2xl ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} ${settings.isGlassMode ? 'glass text-white' : 'bg-white text-slate-800'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black">{settings.appName}</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-black/10 rounded-full"><X size={24} /></button>
          </div>

          <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
            <SidebarItem icon={<ShoppingCart size={20}/>} label={settings.sidebarNames.dailySales} active={activeSection === 'dailySales'} onClick={() => { setActiveSection('dailySales'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={<FilePlus size={20}/>} label={settings.sidebarNames.createInvoice} active={activeSection === 'createInvoice'} onClick={() => { setActiveSection('createInvoice'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={<Truck size={20}/>} label={settings.sidebarNames.transferredOrders} active={activeSection === 'transferredOrders'} onClick={() => { setActiveSection('transferredOrders'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={<List size={20}/>} label={settings.sidebarNames.priceLists} active={activeSection === 'priceLists'} onClick={() => { setActiveSection('priceLists'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={<Box size={20}/>} label={settings.sidebarNames.inventory} active={activeSection === 'inventory'} onClick={() => { setActiveSection('inventory'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={<BarChart size={20}/>} label={settings.sidebarNames.salesReports} active={activeSection === 'salesReports'} onClick={() => { setActiveSection('salesReports'); setIsSidebarOpen(false); }} />
            {currentUser.role === Role.ADMIN && (
              <SidebarItem icon={<SettingsIcon size={20}/>} label={settings.sidebarNames.settings} active={activeSection === 'settings'} onClick={() => { setActiveSection('settings'); setIsSidebarOpen(false); }} />
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-current/10 opacity-60 text-xs text-center">
            &copy; 2024 Market Pro - All Rights Reserved
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeSection === 'dailySales' && <DailySalesSection settings={settings} companies={companies} sales={sales} setSales={setSales} setCompanies={setCompanies} />}
        {activeSection === 'createInvoice' && <CreateInvoiceSection companies={companies} invoices={invoices} setInvoices={setInvoices} />}
        {activeSection === 'transferredOrders' && <TransferredOrdersSection invoices={invoices} setInvoices={setInvoices} companies={companies} setCompanies={setCompanies} />}
        {activeSection === 'priceLists' && <PriceListsSection companies={companies} setCompanies={setCompanies} />}
        {activeSection === 'inventory' && <InventorySection invoices={invoices} companies={companies} />}
        {activeSection === 'salesReports' && <SalesReportsSection sales={sales} companies={companies} />}
        {activeSection === 'settings' && <SettingsSection settings={settings} setSettings={setSettings} users={users} setUsers={setUsers} />}
      </main>
    </div>
  );
}

// --- Components ---

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-indigo-50 text-slate-600 hover:text-indigo-600'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function LoginScreen({ onLogin }: { onLogin: (u: string, p: string) => void }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4">
      <div className="w-full max-w-md glass p-8 rounded-[2rem] shadow-2xl border border-white/30 text-white animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-4 shadow-xl">
            <ShoppingCart size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Market Pro</h1>
          <p className="text-white/60 text-sm mt-1">نظام إدارة السوبر ماركت الذكي</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(u, p); }} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-white/80 pr-1">اسم المستخدم</label>
            <input 
              type="text" 
              value={u}
              onChange={(e) => setU(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all placeholder-white/30"
              placeholder="admin"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-white/80 pr-1">كلمة المرور</label>
            <input 
              type="password" 
              value={p}
              onChange={(e) => setP(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all placeholder-white/30"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="w-full bg-white text-indigo-700 font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg">
            تسجيل الدخول
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-white/40 text-xs">
          جميع الحقوق محفوظة &copy; 2024
        </div>
      </div>
    </div>
  );
}

// --- Section: Create Invoice (1) ---
function CreateInvoiceSection({ companies, invoices, setInvoices }: { companies: Company[], invoices: Invoice[], setInvoices: any }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [searchCompany, setSearchCompany] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const [invoiceId, setInvoiceId] = useState(invoices.length > 0 ? Math.max(...invoices.map(inv => inv.id)) + 1 : 1000);

  const filteredCompanies = companies.filter(c => c.name.includes(searchCompany));

  const handleCreateInvoice = () => {
    if (!selectedCompanyId) return alert('اختر شركة أولاً');
    setIsModalOpen(true);
    setCurrentItems([]);
  };

  const addItem = () => {
    setCurrentItems([...currentItems, { code: '', name: '', price: 0, quantity: 1, stock: 0, subtotal: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...currentItems];
    const item = updated[index];
    item[field] = value;

    // If code changes, try to fetch info from the selected company's products
    if (field === 'code') {
      const comp = companies.find(c => c.id === parseInt(selectedCompanyId));
      const prod = comp?.products.find(p => p.code === value);
      if (prod) {
        item.name = prod.name;
        item.price = prod.priceBeforeTax;
        item.stock = prod.stock;
      }
    }
    
    item.subtotal = (item.price || 0) * (item.quantity || 0);
    setCurrentItems(updated);
  };

  const total = currentItems.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);

  const handleSave = () => {
    const company = companies.find(c => c.id === parseInt(selectedCompanyId));
    const newInvoice: Invoice = {
      id: invoiceId,
      companyId: parseInt(selectedCompanyId),
      companyName: company?.name || '',
      items: currentItems,
      total: total,
      date: new Date().toISOString(),
      status: 'قيد الانتظار',
      payments: [],
      isPaid: false
    };
    setInvoices([...invoices, newInvoice]);
    setInvoiceId(invoiceId + 1);
    setIsModalOpen(false);
    alert('تم ترحيل الفاتورة بنجاح');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FilePlus className="text-indigo-600" />
          إنشاء فاتورة مشتريات
        </h2>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1 pr-1">ابحث عن شركة</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pr-10 pl-4 py-2 bg-slate-50 border rounded-xl" 
                placeholder="أول حروف من الشركة..."
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-1 pr-1">اختر الشركة</label>
            <select 
              value={selectedCompanyId} 
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border rounded-xl"
            >
              <option value="">-- اختر شركة --</option>
              {filteredCompanies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleCreateInvoice}
            className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            إنشاء
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-black">فاتورة رقم #{invoiceId}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full"><X /></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b text-slate-500 text-sm">
                    <th className="pb-4 font-medium">كود الصنف</th>
                    <th className="pb-4 font-medium">اسم المنتج</th>
                    <th className="pb-4 font-medium">السعر</th>
                    <th className="pb-4 font-medium">الكمية</th>
                    <th className="pb-4 font-medium">المخزون الحالي</th>
                    <th className="pb-4 font-medium">الإجمالي</th>
                    <th className="pb-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentItems.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-3">
                        <input 
                          type="text" 
                          value={item.code} 
                          onChange={(e) => updateItem(idx, 'code', e.target.value)}
                          className="w-full bg-slate-100 border-none rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="py-3 font-medium text-slate-700">{item.name || '---'}</td>
                      <td className="py-3">
                        <input 
                          type="number" 
                          value={item.price} 
                          onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value))}
                          className="w-20 bg-slate-100 border-none rounded-lg px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="py-3">
                        <input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))}
                          className="w-20 bg-slate-100 border-none rounded-lg px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="py-3 text-slate-400">{item.stock}</td>
                      <td className="py-3 font-bold text-indigo-600">{item.subtotal.toFixed(2)} ج.م</td>
                      <td className="py-3">
                        <button onClick={() => setCurrentItems(currentItems.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addItem} className="mt-4 flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                <Plus size={18} /> أضف صنف
              </button>
            </div>
            <div className="p-6 bg-slate-50 border-t flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-2xl font-black text-slate-800">إجمالي الفاتورة: <span className="text-indigo-600">{total.toFixed(2)} ج.م</span></div>
              <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl font-bold bg-slate-200 text-slate-600 hover:bg-slate-300">إلغاء</button>
                <button onClick={handleSave} className="px-10 py-2 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg">حفظ وترحيل</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Section: Transferred Orders (2) ---
function TransferredOrdersSection({ invoices, setInvoices, companies, setCompanies }: { invoices: Invoice[], setInvoices: any, companies: Company[], setCompanies: any }) {
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filtered = invoices.filter(inv => 
    inv.companyName.includes(search) || 
    inv.id.toString().includes(search)
  );

  const toggleDelivery = (inv: Invoice) => {
    const updated = invoices.map(i => {
      if (i.id === inv.id) {
        const newStatus = i.status === 'تم التسليم' ? 'قيد الانتظار' : 'تم التسليم';
        
        // If status changes to 'تم التسليم', update stock
        if (newStatus === 'تم التسليم') {
          const comps = [...companies];
          const companyIdx = comps.findIndex(c => c.id === i.companyId);
          if (companyIdx > -1) {
            i.items.forEach(item => {
              const prodIdx = comps[companyIdx].products.findIndex(p => p.code === item.code);
              if (prodIdx > -1) {
                comps[companyIdx].products[prodIdx].stock += item.quantity;
              }
            });
            setCompanies(comps);
          }
        }
        
        return { ...i, status: newStatus as any };
      }
      return i;
    });
    setInvoices(updated);
    if (selectedInvoice?.id === inv.id) {
      setSelectedInvoice(updated.find(x => x.id === inv.id) || null);
    }
  };

  const addPayment = (inv: Invoice, amount: number) => {
    const updated = invoices.map(i => {
      if (i.id === inv.id) {
        const newPayments = [...i.payments, { amount, date: new Date().toISOString() }];
        const paidTotal = newPayments.reduce((acc, curr) => acc + curr.amount, 0);
        return { ...i, payments: newPayments.slice(0, 3), isPaid: paidTotal >= i.total };
      }
      return i;
    });
    setInvoices(updated);
  };

  const handleExcelExport = (inv: Invoice) => {
    const header = "اسم الماركت: Market Pro\nرقم الفاتورة: " + inv.id + "\nالشركة: " + inv.companyName + "\nالتاريخ: " + new Date(inv.date).toLocaleDateString() + "\n\n";
    const body = "الكود,الصنف,الكمية,السعر,الإجمالي\n" + inv.items.map(i => `${i.code},${i.name},${i.quantity},${i.price},${i.subtotal}`).join("\n");
    const footer = `\n\nالإجمالي النهائي: ${inv.total}\nالمدفوع: ${inv.payments.reduce((a, b) => a + b.amount, 0)}\nالمتبقي: ${inv.total - inv.payments.reduce((a, b) => a + b.amount, 0)}`;
    const blob = new Blob([header + body + footer], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${inv.id}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Truck className="text-indigo-600" />
          الأوردرات المرحلة
        </h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            className="w-full pr-10 pl-4 py-3 bg-slate-50 border rounded-xl" 
            placeholder="ابحث برقم الفاتورة أو اسم الشركة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(inv => {
          const paidTotal = inv.payments.reduce((acc, curr) => acc + curr.amount, 0);
          const remaining = inv.total - paidTotal;
          
          return (
            <div key={inv.id} onClick={() => setSelectedInvoice(inv)} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400">#{inv.id}</span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${inv.status === 'تم التسليم' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                  {inv.status}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">{inv.companyName}</h3>
              <p className="text-sm text-slate-500 mb-4">{new Date(inv.date).toLocaleDateString('ar-EG')}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">القيمة الإجمالية</p>
                  <p className="font-black text-indigo-600">{inv.total.toFixed(2)} ج.م</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase">المتبقي</p>
                  <p className={`font-black ${remaining > 0 ? 'text-red-500' : 'text-green-500'}`}>{remaining.toFixed(2)} ج.م</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-black">تفاصيل الفاتورة #{selectedInvoice.id}</h3>
                <button onClick={() => toggleDelivery(selectedInvoice)} className={`px-4 py-1 rounded-full text-xs font-bold ${selectedInvoice.status === 'تم التسليم' ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {selectedInvoice.status === 'تم التسليم' ? 'تم التسليم' : 'تغيير لتم التسليم؟'}
                </button>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-1 hover:bg-slate-200 rounded-full"><X /></button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs text-slate-400">الشركة</p>
                  <p className="font-bold">{selectedInvoice.companyName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs text-slate-400">التاريخ</p>
                  <p className="font-bold">{new Date(selectedInvoice.date).toLocaleDateString('ar-EG')}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs text-slate-400">الإجمالي</p>
                  <p className="font-bold text-indigo-600">{selectedInvoice.total.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs text-slate-400">الحالة</p>
                  <p className="font-bold text-red-500">{selectedInvoice.status}</p>
                </div>
              </div>

              <h4 className="font-black mb-4 flex items-center gap-2"><List size={18}/> الأصناف</h4>
              <table className="w-full text-right mb-8">
                <thead className="text-slate-400 text-xs uppercase">
                  <tr className="border-b">
                    <th className="pb-2">الكود</th>
                    <th className="pb-2">الصنف</th>
                    <th className="pb-2">الكمية</th>
                    <th className="pb-2">السعر</th>
                    <th className="pb-2">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-3 text-sm">{item.code}</td>
                      <td className="py-3 font-bold">{item.name}</td>
                      <td className="py-3">{item.quantity}</td>
                      <td className="py-3">{item.price.toFixed(2)}</td>
                      <td className="py-3 font-bold">{item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t pt-6">
                <h4 className="font-black mb-4 flex items-center gap-2"><ShoppingCart size={18}/> الدفعات (بحد أقصى 3)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {selectedInvoice.payments.map((p, idx) => (
                    <div key={idx} className="bg-green-50 p-3 rounded-xl border border-green-100">
                      <p className="text-xs text-green-600 font-bold">دفعة {idx + 1}</p>
                      <p className="text-lg font-black text-green-700">{p.amount.toFixed(2)} ج.م</p>
                      <p className="text-[10px] text-green-500">{new Date(p.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {selectedInvoice.payments.length < 3 && (
                    <div className="flex flex-col gap-2">
                      <input id="paymentInput" type="number" placeholder="قيمة الدفعة..." className="w-full px-3 py-2 border rounded-xl text-sm" />
                      <button 
                        onClick={() => {
                          const input = document.getElementById('paymentInput') as HTMLInputElement;
                          const val = parseFloat(input.value);
                          if (val > 0) {
                            addPayment(selectedInvoice, val);
                            input.value = '';
                          }
                        }}
                        className="bg-indigo-600 text-white py-2 rounded-xl text-sm font-bold"
                      >
                        أضف دفعة
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-between p-4 bg-slate-900 text-white rounded-2xl">
                  <div>
                    <p className="text-xs opacity-50">إجمالي المدفوع</p>
                    <p className="text-xl font-black">{selectedInvoice.payments.reduce((a, b) => a + b.amount, 0).toFixed(2)} ج.م</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs opacity-50">المتبقي</p>
                    <p className="text-xl font-black text-red-400">
                      {(selectedInvoice.total - selectedInvoice.payments.reduce((a, b) => a + b.amount, 0)).toFixed(2)} ج.م
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-slate-200 rounded-xl font-bold hover:bg-slate-300 transition-all">
                <Printer size={18}/> طباعة
              </button>
              <button onClick={() => handleExcelExport(selectedInvoice)} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 border border-green-200 rounded-xl font-bold hover:bg-green-200 transition-all">
                <FileSpreadsheet size={18}/> إكسيل
              </button>
              <button onClick={() => setSelectedInvoice(null)} className="px-8 py-2 bg-slate-800 text-white rounded-xl font-bold">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Section: Price Lists (3) ---
function PriceListsSection({ companies, setCompanies }: { companies: Company[], setCompanies: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newComp, setNewComp] = useState({ name: '', products: [] as Product[] });
  const [selectedComp, setSelectedComp] = useState<Company | null>(null);

  const handleAddCompany = () => {
    const id = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 10;
    setCompanies([...companies, { ...newComp, id }]);
    setIsModalOpen(false);
    setNewComp({ name: '', products: [] });
  };

  const addProductRow = () => {
    setNewComp({ ...newComp, products: [...newComp.products, { code: '', name: '', priceBeforeTax: 0, priceAfterTax: 0, stock: 0 }] });
  };

  const updateProductRow = (idx: number, field: string, value: any) => {
    const updated = [...newComp.products];
    updated[idx] = { ...updated[idx], [field]: value };
    if (field === 'priceBeforeTax') {
      updated[idx].priceAfterTax = value * 1.14; // Default tax representation
    }
    setNewComp({ ...newComp, products: updated });
  };

  const filtered = companies.filter(c => c.name.includes(search) || c.id.toString().includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black flex items-center gap-2"><List className="text-indigo-600"/> قوائم أسعار الشركات</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="ابحث عن شركة..." 
              className="w-full pr-10 pl-4 py-2 border rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap">
            <Plus size={18}/> أضف شركة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelectedComp(c)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-300 cursor-pointer transition-all">
            <p className="text-xs text-slate-400 mb-1">كود #{c.id}</p>
            <h3 className="text-xl font-black mb-4">{c.name}</h3>
            <div className="flex justify-between items-center text-sm text-slate-500">
              <span>{c.products.length} صنف</span>
              <span className="text-indigo-600 font-bold">عرض التفاصيل &larr;</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-black">إضافة شركة جديدة</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-full"><X /></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold block mb-1">اسم الشركة</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl" value={newComp.name} onChange={(e) => setNewComp({...newComp, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1">كود الشركة (تلقائي)</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl bg-slate-50" value={companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 10} disabled />
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-bold mb-4">قائمة الأصناف</h4>
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b text-xs text-slate-400">
                      <th className="pb-2">كود الصنف</th>
                      <th className="pb-2">اسم الصنف</th>
                      <th className="pb-2">السعر (قبل الضريبة)</th>
                      <th className="pb-2">السعر (بعد الضريبة)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newComp.products.map((p, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2"><input type="text" className="w-full bg-slate-50 border-none rounded-lg p-1" onChange={(e) => updateProductRow(idx, 'code', e.target.value)} /></td>
                        <td className="py-2"><input type="text" className="w-full bg-slate-50 border-none rounded-lg p-1" onChange={(e) => updateProductRow(idx, 'name', e.target.value)} /></td>
                        <td className="py-2"><input type="number" className="w-full bg-slate-50 border-none rounded-lg p-1" onChange={(e) => updateProductRow(idx, 'priceBeforeTax', parseFloat(e.target.value))} /></td>
                        <td className="py-2 text-slate-400 p-1">{(p.priceBeforeTax * 1.14).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={addProductRow} className="mt-4 flex items-center gap-2 text-indigo-600 font-bold"><Plus size={16}/> أضف صنف</button>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl bg-slate-200 font-bold">إلغاء</button>
              <button onClick={handleAddCompany} className="px-10 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-lg">حفظ القائمة</button>
            </div>
          </div>
        </div>
      )}

      {selectedComp && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-black">{selectedComp.name} - قائمة الأسعار</h3>
              <button onClick={() => setSelectedComp(null)} className="p-1 hover:bg-slate-200 rounded-full"><X /></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b text-slate-400">
                    <th className="pb-2">الكود</th>
                    <th className="pb-2">الصنف</th>
                    <th className="pb-2 text-center">السعر قبل الضريبة</th>
                    <th className="pb-2 text-center">السعر بعد الضريبة</th>
                    <th className="pb-2 text-center">المخزون</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedComp.products.map((p, idx) => (
                    <tr key={idx} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono">{p.code}</td>
                      <td className="py-3 font-bold">{p.name}</td>
                      <td className="py-3 text-center">{p.priceBeforeTax.toFixed(2)}</td>
                      <td className="py-3 text-center font-bold text-green-600">{p.priceAfterTax.toFixed(2)}</td>
                      <td className="py-3 text-center text-slate-400">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t flex justify-end gap-3 bg-slate-50">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-slate-200 font-bold"><Printer size={18}/> طباعة</button>
              <button onClick={() => setSelectedComp(null)} className="px-10 py-2 rounded-xl bg-slate-800 text-white font-bold">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Section: Inventory (4) ---
function InventorySection({ invoices, companies }: { invoices: Invoice[], companies: Company[] }) {
  const [search, setSearch] = useState('');
  const deliveredInvoices = invoices.filter(inv => inv.status === 'تم التسليم');

  const filtered = deliveredInvoices.filter(inv => 
    inv.companyName.includes(search) || 
    inv.items.some(it => it.code.includes(search) || it.name.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black flex items-center gap-2"><Box className="text-indigo-600"/> المخزون والمشتريات المستلمة</h2>
        <div className="relative flex-1 md:max-w-md w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
          <input 
            type="text" 
            placeholder="بحث بشركة أو منتج..." 
            className="w-full pr-10 pl-4 py-2 border rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 text-slate-400 text-sm">
            <tr>
              <th className="p-4 font-medium">رقم الفاتورة</th>
              <th className="p-4 font-medium">الشركة</th>
              <th className="p-4 font-medium">عدد الأصناف</th>
              <th className="p-4 font-medium">القيمة النهائية</th>
              <th className="p-4 font-medium">تاريخ الاستلام</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-500">#{inv.id}</td>
                <td className="p-4 font-black">{inv.companyName}</td>
                <td className="p-4">{inv.items.length}</td>
                <td className="p-4 font-bold text-indigo-600">{inv.total.toFixed(2)}</td>
                <td className="p-4 text-slate-400">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="p-4">
                  <button className="text-indigo-600 font-bold text-sm hover:underline">عرض التفاصيل</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-20 text-center text-slate-300">
            <Box size={48} className="mx-auto mb-4 opacity-20"/>
            <p>لا يوجد أوردرات مستلمة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Section: Daily Sales (POS) (5) ---
function DailySalesSection({ settings, companies, sales, setSales, setCompanies }: { settings: AppSettings, companies: Company[], sales: Sale[], setSales: any, setCompanies: any }) {
  const [currentCart, setCurrentCart] = useState<SaleItem[]>([]);
  const [received, setReceived] = useState(0);
  const [itemCode, setItemCode] = useState('');

  const handleAddToCart = () => {
    // Search product in all companies
    let foundProd: Product | null = null;
    let companyIdx = -1;

    companies.forEach((c, idx) => {
      const p = c.products.find(prod => prod.code === itemCode);
      if (p) {
        foundProd = p;
        companyIdx = idx;
      }
    });

    if (!foundProd) {
      alert('المنتج غير موجود');
      return;
    }

    const price = foundProd!.priceAfterTax * (1 + (settings.profitMargin / 100));
    const newItem: SaleItem = {
      code: foundProd!.code,
      name: foundProd!.name,
      price: price,
      quantity: 1,
      subtotal: price
    };

    setCurrentCart([...currentCart, newItem]);
    setItemCode('');
  };

  const total = currentCart.reduce((acc, curr) => acc + curr.subtotal, 0);
  const change = received > 0 ? received - total : 0;

  const handleSaveSale = () => {
    if (currentCart.length === 0) return;

    const newSale: Sale = {
      id: Date.now(),
      items: currentCart,
      total,
      receivedAmount: received,
      changeAmount: change,
      date: new Date().toISOString()
    };

    // Update stocks
    const updatedCompanies = [...companies];
    currentCart.forEach(cartItem => {
      updatedCompanies.forEach(c => {
        const prod = c.products.find(p => p.code === cartItem.code);
        if (prod) {
          prod.stock -= cartItem.quantity;
        }
      });
    });

    setCompanies(updatedCompanies);
    setSales([...sales, newSale]);
    setCurrentCart([]);
    setReceived(0);
    alert('تم حفظ البيع بنجاح');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2"><ShoppingCart className="text-indigo-600"/> المبيعات اليومية (كاشير)</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-50 border rounded-2xl px-6 py-4 text-xl font-bold focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
              placeholder="امسح الباركود أو ادخل كود الصنف..."
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddToCart()}
            />
            <button onClick={handleAddToCart} className="bg-indigo-600 text-white px-8 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg">إضافة</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b font-bold flex justify-between">
            <span>قائمة الأصناف</span>
            <span className="text-slate-400">{currentCart.length} منتج</span>
          </div>
          <div className="min-h-[300px] overflow-y-auto p-4">
            <table className="w-full text-right">
              <thead>
                <tr className="text-xs text-slate-400 border-b">
                  <th className="pb-2">الكود</th>
                  <th className="pb-2">الصنف</th>
                  <th className="pb-2 text-center">السعر</th>
                  <th className="pb-2 text-center">الكمية</th>
                  <th className="pb-2 text-left">الإجمالي</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentCart.map((item, idx) => (
                  <tr key={idx} className="group">
                    <td className="py-4 text-sm font-mono">{item.code}</td>
                    <td className="py-4 font-bold">{item.name}</td>
                    <td className="py-4 text-center">{item.price.toFixed(2)}</td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => {
                          const updated = [...currentCart];
                          updated[idx].quantity += 1;
                          updated[idx].subtotal = updated[idx].quantity * updated[idx].price;
                          setCurrentCart(updated);
                        }} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-indigo-500 hover:text-white">+</button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button onClick={() => {
                          if (item.quantity > 1) {
                            const updated = [...currentCart];
                            updated[idx].quantity -= 1;
                            updated[idx].subtotal = updated[idx].quantity * updated[idx].price;
                            setCurrentCart(updated);
                          }
                        }} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-red-500 hover:text-white">-</button>
                      </div>
                    </td>
                    <td className="py-4 text-left font-black text-indigo-600">{item.subtotal.toFixed(2)}</td>
                    <td className="py-4 text-left">
                      <button onClick={() => setCurrentCart(currentCart.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currentCart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center py-20 text-slate-300">
                <ShoppingCart size={48} className="opacity-20 mb-4" />
                <p>السلة فارغة</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-indigo-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-2">الإجمالي المطلوب</p>
            <h3 className="text-5xl font-black mb-10">{total.toFixed(2)} <span className="text-xl">ج.م</span></h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-indigo-300 block mb-1">المبلغ المستلم من العميل</label>
                <input 
                  type="number" 
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-3 text-2xl font-black outline-none focus:bg-white/20 transition-all"
                  value={received || ''}
                  onChange={(e) => setReceived(parseFloat(e.target.value))}
                />
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                <span className="text-sm font-bold opacity-70">المتبقي للعميل</span>
                <span className="text-2xl font-black text-green-400">{change.toFixed(2)} ج.م</span>
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <button onClick={handleSaveSale} className="flex-1 bg-white text-indigo-900 py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl">حفظ</button>
              <button onClick={() => window.print()} className="bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all border border-white/10"><Printer size={24}/></button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="font-bold mb-4 flex items-center gap-2"><AlertCircle size={18} className="text-orange-500"/> ملاحظات سريعة</h4>
          <ul className="text-sm text-slate-500 space-y-2">
            <li>• يتم إضافة نسبة ربح {settings.profitMargin}% تلقائياً.</li>
            <li>• تأكد من مسح باركود المنتج بشكل صحيح.</li>
            <li>• يمكن تعديل الكميات أو حذف الأصناف قبل الحفظ.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Section: Sales Reports (6) ---
function SalesReportsSection({ sales, companies }: { sales: Sale[], companies: Company[] }) {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('all');

  const filteredSales = sales.filter(s => {
    // Basic search simulation
    return s.id.toString().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black flex items-center gap-2"><BarChart className="text-indigo-600"/> تقارير المبيعات</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="بحث برقم العملية..." 
            className="px-4 py-2 border rounded-xl flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-4 py-2 border rounded-xl bg-white" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="all">كل الفترات</option>
            <option value="today">اليوم</option>
            <option value="month">هذا الشهر</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><ShoppingCart/></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">إجمالي المبيعات</p>
            <p className="text-2xl font-black">{sales.reduce((a, b) => a + b.total, 0).toFixed(2)} ج.م</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle/></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">عدد العمليات</p>
            <p className="text-2xl font-black">{sales.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><Box/></div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">الأصناف المباعة</p>
            <p className="text-2xl font-black">{sales.reduce((a, b) => a + b.items.length, 0)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 text-slate-400 text-sm">
            <tr>
              <th className="p-4 font-medium">الرقم</th>
              <th className="p-4 font-medium">الوقت والتاريخ</th>
              <th className="p-4 font-medium">الأصناف</th>
              <th className="p-4 font-medium">الإجمالي</th>
              <th className="p-4 font-medium">المستلم</th>
              <th className="p-4 font-medium">المتبقي</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredSales.map(sale => (
              <tr key={sale.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono text-xs">#{sale.id}</td>
                <td className="p-4 font-medium">{new Date(sale.date).toLocaleString('ar-EG')}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {sale.items.slice(0, 2).map((it, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px]">{it.name}</span>
                    ))}
                    {sale.items.length > 2 && <span className="text-[10px] text-slate-400">+{sale.items.length - 2} أخرى</span>}
                  </div>
                </td>
                <td className="p-4 font-bold text-indigo-600">{sale.total.toFixed(2)}</td>
                <td className="p-4">{sale.receivedAmount.toFixed(2)}</td>
                <td className="p-4 text-green-600 font-bold">{sale.changeAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSales.length === 0 && (
          <div className="p-20 text-center text-slate-300">
            <BarChart size={48} className="mx-auto mb-4 opacity-20"/>
            <p>لا توجد بيانات مبيعات لعرضها</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Section: Settings (7) ---
function SettingsSection({ settings, setSettings, users, setUsers }: { settings: AppSettings, setSettings: any, users: User[], setUsers: any }) {
  const [activeTab, setActiveTab] = useState('general');
  const [newUser, setNewUser] = useState<Partial<User>>({ role: Role.EMPLOYEE, permissions: [] });

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) return;
    const u: User = {
      id: Date.now().toString(),
      username: newUser.username!,
      password: newUser.password!,
      role: newUser.role!,
      phone: newUser.phone || '',
      address: newUser.address || '',
      startDate: new Date().toISOString(),
      permissions: ['dailySales', 'createInvoice', 'transferredOrders', 'priceLists', 'inventory', 'salesReports']
    };
    setUsers([...users, u]);
    setNewUser({ role: Role.EMPLOYEE, permissions: [] });
  };

  const handleUpdateSidebarName = (key: string, val: string) => {
    setSettings({ ...settings, sidebarNames: { ...settings.sidebarNames, [key]: val } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black flex items-center gap-2"><SettingsIcon className="text-indigo-600"/> إعدادات النظام</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-2">
          <button onClick={() => setActiveTab('general')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'general' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100'}`}>الإعدادات العامة</button>
          <button onClick={() => setActiveTab('users')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100'}`}>المستخدمين والصلاحيات</button>
          <button onClick={() => setActiveTab('labels')} className={`w-full text-right px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'labels' ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-100'}`}>تسمية القوائم</button>
        </div>

        <div className="flex-1 bg-white p-8 rounded-3xl border shadow-sm">
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
              <div>
                <label className="block text-sm font-black mb-2">اسم البرنامج</label>
                <input 
                  type="text" 
                  value={settings.appName} 
                  onChange={(e) => setSettings({...settings, appName: e.target.value})}
                  className="w-full max-w-md px-4 py-3 border rounded-2xl text-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-black mb-2">نسبة الربح الافتراضية (%)</label>
                <input 
                  type="number" 
                  value={settings.profitMargin} 
                  onChange={(e) => setSettings({...settings, profitMargin: parseFloat(e.target.value)})}
                  className="w-full max-w-md px-4 py-3 border rounded-2xl text-lg font-bold"
                />
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                <h4 className="font-black text-indigo-600">إضافة حساب جديد</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="اسم المستخدم" className="px-4 py-2 border rounded-xl" value={newUser.username || ''} onChange={(e) => setNewUser({...newUser, username: e.target.value})} />
                  <input type="password" placeholder="كلمة المرور" className="px-4 py-2 border rounded-xl" value={newUser.password || ''} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                  <select className="px-4 py-2 border rounded-xl bg-white" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as Role})}>
                    <option value={Role.EMPLOYEE}>{Role.EMPLOYEE}</option>
                    <option value={Role.ADMIN}>{Role.ADMIN}</option>
                  </select>
                </div>
                <button onClick={handleAddUser} className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-indigo-700">إنشاء الحساب</button>
              </div>

              <div className="divide-y">
                {users.map(u => (
                  <div key={u.id} className="py-4 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-indigo-600">{u.username[0].toUpperCase()}</div>
                      <div>
                        <p className="font-bold">{u.username}</p>
                        <p className="text-xs text-slate-400">{u.role} - انضم في {new Date(u.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit size={18}/></button>
                      {u.username !== 'admin' && (
                        <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'labels' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
              {Object.entries(settings.sidebarNames).map(([key, value]) => (
                <div key={key} className="flex flex-col md:flex-row items-center gap-4 border-b pb-4 last:border-0">
                  <label className="w-full md:w-48 text-sm font-bold text-slate-500">{key}</label>
                  <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => handleUpdateSidebarName(key, e.target.value)}
                    className="flex-1 w-full px-4 py-2 border rounded-xl"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
