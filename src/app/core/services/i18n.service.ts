import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';

type Locale = 'en' | 'ar';
type Dictionary = Record<string, string>;

const dictionary: Record<Locale, Dictionary> = {
  en: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    users: 'Users',
    cars: 'Cars',
    orders: 'Orders',
    myOrders: 'My Orders',
    installments: 'Installments',
    darkMode: 'Dark Mode',
    search: 'Search',
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
    noData: 'No data available',
    loading: 'Loading...',
  },
  ar: {
    login: 'تسجيل الدخول',
    register: 'تسجيل حساب',
    logout: 'تسجيل الخروج',
    users: 'المستخدمون',
    cars: 'السيارات',
    orders: 'الطلبات',
    myOrders: 'طلباتي',
    installments: 'الأقساط',
    darkMode: 'الوضع الداكن',
    search: 'بحث',
    create: 'إضافة',
    update: 'تحديث',
    delete: 'حذف',
    noData: 'لا توجد بيانات',
    loading: 'جار التحميل...',
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = typeof localStorage !== 'undefined' ? localStorage : null;
  private readonly lang = signal<Locale>((this.storage?.getItem('locale') as Locale) || 'en');
  readonly locale = computed(() => this.lang());

  constructor() {
    this.applyLocale(this.lang());
  }

  t(key: string): string {
    return dictionary[this.lang()][key] ?? key;
  }

  toggleLanguage(): void {
    const next = this.lang() === 'en' ? 'ar' : 'en';
    this.lang.set(next);
    this.storage?.setItem('locale', next);
    this.applyLocale(next);
  }

  private applyLocale(locale: Locale): void {
    this.document.documentElement.lang = locale;
    this.document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }
}

export function localeIdFactory(): string {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en';
}
