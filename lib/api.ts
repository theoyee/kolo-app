// Kolo Live Production Backend API Client
// Backend API: https://kolo-b.onrender.com
// Swagger Documentation: https://kolo-b.onrender.com/documentation
// Spec JSON: https://kolo-b.onrender.com/documentation/json

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://kolo-b.onrender.com/api/v1';

export const DEFAULT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NTg2YWZkYS1iMzRiLTRlNTgtYWU5Mi02M2RlMzEwZWI5YWEiLCJlbWFpbCI6ImFkYS5va2Fmb3JAa29sby5hcHAiLCJmaXJzdE5hbWUiOiJBZGEiLCJsYXN0TmFtZSI6Ik9rYWZvciIsImlzU3VwZXJBZG1pbiI6ZmFsc2UsImlhdCI6MTc5MDc3NjA4MCwiZXhwIjoxNzkwNzc5NjgwfQ._NHyzYtYEriS9idxqmXRpy_Gcg_WZogHC1fGVQ7OBzg';

export const DEFAULT_BUSINESS_ID = '2c398c1f-eac8-4b4c-a37b-c19e94d66a19';

export const DEFAULT_USER = {
  id: '8586afda-b34b-4e58-ae92-63de310eb9aa',
  firstName: 'Ada',
  lastName: 'Okafor',
  email: 'ada.okafor@kolo.app',
  phone: '08031234567',
};

// ----------------------------------------------------
// Strict Nigerian Currency Rules (Integer Kobo: ₦1.00 = 100 Kobo)
// ----------------------------------------------------
export function toKobo(naira: number | string): number {
  const num = typeof naira === 'string' ? parseFloat(naira) || 0 : naira;
  return Math.round(num * 100);
}

export function fromKobo(kobo: number | null | undefined): number {
  if (typeof kobo !== 'number') return 0;
  return kobo / 100;
}

export function formatNGN(koboOrNaira: number | null | undefined, isKobo = true): string {
  const amount = isKobo ? fromKobo(koboOrNaira) : (koboOrNaira || 0);
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₦${Number(amount).toLocaleString()}`;
  }
}

// ----------------------------------------------------
// Auth Token & Business ID Session Management
// ----------------------------------------------------
export function getAuthToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('kolo_access_token') || DEFAULT_TOKEN;
  }
  return DEFAULT_TOKEN;
}

export function getRefreshToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('kolo_refresh_token') || '';
  }
  return '';
}

export function getActiveBusinessId(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('kolo_business_id') || DEFAULT_BUSINESS_ID;
  }
  return DEFAULT_BUSINESS_ID;
}

export function setActiveBusinessId(businessId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kolo_business_id', businessId);
    window.dispatchEvent(new CustomEvent('kolo_business_changed', { detail: { businessId } }));
  }
}

export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('kolo_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // ignore
      }
    }
  }
  return DEFAULT_USER;
}

export function saveAuthSession(
  accessToken: string,
  refreshToken?: string,
  businessId?: string,
  user?: unknown
) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kolo_access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('kolo_refresh_token', refreshToken);
  }
  if (businessId) {
    localStorage.setItem('kolo_business_id', businessId);
  }
  if (user) {
    localStorage.setItem('kolo_user', JSON.stringify(user));
  }
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('kolo_access_token');
  localStorage.removeItem('kolo_refresh_token');
  localStorage.removeItem('kolo_business_id');
  localStorage.removeItem('kolo_user');
}

// ----------------------------------------------------
// Automatic Token Refresh Mutex
// ----------------------------------------------------
let isRefreshing = false;
let refreshSubscribers: ((newToken: string) => void)[] = [];

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      const newToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken || refreshToken;
      saveAuthSession(newToken, newRefreshToken);
      return newToken;
    }
  } catch (err) {
    console.warn('[API Auth Refresh Error]:', err);
  }
  return null;
}

// ----------------------------------------------------
// Central API Client with Auto-Refresh & Error Handlers
// ----------------------------------------------------
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
    details?: any;
  };
  meta?: any;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const businessId = getActiveBusinessId();

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(businessId ? { 'X-Business-Id': businessId } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized by attempting a token refresh
    if (response.status === 401 && !isRetry) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        if (newToken) {
          onRefreshed(newToken);
          return apiRequest<T>(endpoint, options, true);
        }
      } else {
        return new Promise<ApiResponse<T>>((resolve) => {
          refreshSubscribers.push(() => {
            resolve(apiRequest<T>(endpoint, options, true));
          });
        });
      }
    }

    let data: any;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: response.ok, message: text };
    }

    if (!response.ok && data?.error) {
      const errMsg = data.error.message || `Request failed with status ${response.status}`;
      // Log for diagnostic tracking
      console.warn(`[API ${response.status}] ${endpoint}:`, data.error);
      return {
        success: false,
        error: data.error,
        message: errMsg,
      };
    }

    return data;
  } catch (err: any) {
    console.error(`[API Network Error] ${options.method || 'GET'} ${url}:`, err);
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: err?.message || 'Network request failed' },
    };
  }
}

// ----------------------------------------------------
// 1. Auth & Business Setup APIs
// ----------------------------------------------------
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest<{
      tokens: { accessToken: string; refreshToken?: string };
      user: any;
      business?: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    businessName: string;
    businessType?: string;
  }) => {
    return apiRequest<{
      tokens: { accessToken: string; refreshToken?: string };
      user: any;
      business?: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  refreshToken: async (refreshToken: string) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    clearAuthSession();
  },
};

export const businessApi = {
  list: async () => apiRequest<any[]>('/businesses/'),
  get: async (id: string) => apiRequest<any>(`/businesses/${id}`),
  create: async (data: { name: string; currency?: string; businessType?: string }) =>
    apiRequest('/businesses/', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: string, data: any) =>
    apiRequest(`/businesses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ----------------------------------------------------
// 2. Catalog & Inventory Management APIs
// ----------------------------------------------------
export const productsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string; categoryId?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit || 50));
    if (params?.search) query.set('search', params.search);
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    return apiRequest<any[]>(`/products/?${query.toString()}`);
  },

  get: async (id: string) => apiRequest<any>(`/products/${id}`),

  create: async (payload: {
    name: string;
    sku: string;
    costPriceKobo: number;
    sellingPriceKobo: number;
    categoryId?: string | null;
    unit?: string;
    minStockAlert?: number;
  }) =>
    apiRequest('/products/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: async (id: string, payload: any) =>
    apiRequest(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  delete: async (id: string) => apiRequest(`/products/${id}`, { method: 'DELETE' }),

  categories: async () => apiRequest<any[]>('/products/categories'),

  createCategory: async (payload: { name: string; description?: string }) =>
    apiRequest('/products/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const inventoryApi = {
  getLowStock: async () => apiRequest<any[]>('/inventory/low-stock'),
  getValuation: async () => apiRequest<any>('/reports/inventory-valuation'),
  adjust: async (payload: {
    productId: string;
    type: 'RESTOCK' | 'SALE_DEDUCTION' | 'DAMAGE' | 'LOSS' | 'RETURN' | 'ADJUSTMENT';
    quantity: number;
    reason: string;
  }) =>
    apiRequest('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  movements: async (params?: { productId?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.productId) query.set('productId', params.productId);
    if (params?.page) query.set('page', String(params.page));
    return apiRequest(`/inventory/movements?${query.toString()}`);
  },
};

// ----------------------------------------------------
// 3. POS Checkout & Sales Engine APIs
// ----------------------------------------------------
export interface CreateSalePayload {
  customerId?: string | null;
  items: {
    productId: string;
    quantity: number;
    unitSellingPriceKobo?: number;
    unitPriceKobo?: number;
  }[];
  payments: {
    method: 'CASH' | 'BANK_TRANSFER' | 'POS_TERMINAL' | 'PAYSTACK' | 'FLUTTERWAVE';
    amountKobo: number;
    transferReference?: string;
  }[];
  applyVat?: boolean;
  notes?: string;
}

export const salesApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit || 20));
    if (params?.search) query.set('search', params.search);
    return apiRequest<any[]>(`/sales/?${query.toString()}`);
  },

  get: async (id: string) => apiRequest<any>(`/sales/${id}`),

  create: async (payload: CreateSalePayload) => {
    // Normalizing item unit price property for backend compatibility
    const normalizedItems = payload.items.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
      unitSellingPriceKobo: it.unitSellingPriceKobo ?? it.unitPriceKobo,
      unitPriceKobo: it.unitSellingPriceKobo ?? it.unitPriceKobo,
    }));

    return apiRequest('/sales/', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        items: normalizedItems,
      }),
    });
  },

  getReceiptPdfUrl: (id: string) => {
    const token = getAuthToken();
    const bizId = getActiveBusinessId();
    return `${API_BASE_URL}/sales/${id}/receipt-pdf?token=${encodeURIComponent(token)}&businessId=${encodeURIComponent(bizId)}`;
  },

  voidSale: async (id: string, reason: string) => {
    return apiRequest(`/sales/${id}/void`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

// ----------------------------------------------------
// 4. Nigerian Bank Transfer & Admin Approval Queue
// ----------------------------------------------------
export const paymentsApi = {
  // Get official business bank account
  getBankAccount: async () => apiRequest<any>('/payments/bank-account'),

  // Customer or staff submits bank transfer proof
  submitBankTransfer: async (payload: {
    saleId?: string;
    orderId?: string;
    customerId?: string;
    amountKobo: number;
    transferReference: string;
    receiptUrl: string;
    senderName: string;
    senderBank: string;
    notes?: string;
  }) => {
    return apiRequest('/payments/bank-transfer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin approval queue for pending transfers
  getPendingTransfers: async () => apiRequest<any[]>('/payments/pending-transfers'),

  // Admin verifies and approves or rejects bank transfer
  verifyTransfer: async (
    id: string,
    payload: { status: 'SUCCESS' | 'FAILED'; adminNotes?: string }
  ) => {
    return apiRequest(`/payments/${id}/verify-transfer`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  list: async (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit || 50));
    return apiRequest(`/payments/?${query.toString()}`);
  },
};

// ----------------------------------------------------
// 5. Customer Orders & Wholesale APIs
// ----------------------------------------------------
export const ordersApi = {
  list: async (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit || 30));
    if (params?.status) query.set('status', params.status);
    return apiRequest<any[]>(`/orders/?${query.toString()}`);
  },

  get: async (id: string) => apiRequest<any>(`/orders/${id}`),

  create: async (payload: {
    customerId?: string;
    items: {
      productId: string;
      quantity: number;
      unitPriceKobo?: number;
      unitSellingPriceKobo?: number;
    }[];
    notes?: string;
  }) => {
    const normalizedItems = payload.items.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
      unitPriceKobo: it.unitPriceKobo ?? it.unitSellingPriceKobo,
      unitSellingPriceKobo: it.unitSellingPriceKobo ?? it.unitPriceKobo,
    }));

    return apiRequest('/orders/', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        items: normalizedItems,
      }),
    });
  },

  updateStatus: async (
    id: string,
    status: 'DRAFT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  ) =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  fulfill: async (
    id: string,
    payload?: {
      payments: {
        method: 'CASH' | 'BANK_TRANSFER' | 'POS_TERMINAL' | 'PAYSTACK' | 'FLUTTERWAVE';
        amountKobo: number;
      }[];
    }
  ) =>
    apiRequest(`/orders/${id}/fulfill`, {
      method: 'POST',
      body: payload ? JSON.stringify(payload) : JSON.stringify({}),
    }),
};

// ----------------------------------------------------
// 6. Customers APIs
// ----------------------------------------------------
export const customersApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit || 50));
    if (params?.search) query.set('search', params.search);
    return apiRequest<any[]>(`/customers/?${query.toString()}`);
  },
  get: async (id: string) => apiRequest<any>(`/customers/${id}`),
  create: async (payload: {
    fullName: string;
    phone?: string;
    email?: string;
    address?: string;
  }) =>
    apiRequest('/customers/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// ----------------------------------------------------
// 7. Expenses & Financial Reports APIs
// ----------------------------------------------------
export const expensesApi = {
  list: async (params?: { page?: number; limit?: number; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit || 50));
    if (params?.category) query.set('category', params.category);
    return apiRequest<any[]>(`/expenses/?${query.toString()}`);
  },

  create: async (payload: {
    title: string;
    category:
      | 'RENT'
      | 'DIESEL_GENERATOR'
      | 'SALARIES'
      | 'UTILITIES'
      | 'MAINTENANCE'
      | 'SUPPLIES'
      | 'MARKETING'
      | 'LOGISTICS'
      | 'OTHER';
    amountKobo: number;
    notes?: string;
    payee?: string;
  }) =>
    apiRequest('/expenses/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  summary: async () => apiRequest<any>('/expenses/summary'),
};

export const reportsApi = {
  dailySummary: async () => apiRequest<any>('/reports/daily-summary'),
  profitLoss: async () => apiRequest<any>('/reports/profit-loss'),
  topProducts: async () => apiRequest<any[]>('/reports/top-products'),
  inventoryValuation: async () => apiRequest<any>('/reports/inventory-valuation'),
};

export const settingsApi = {
  get: async () => apiRequest<any>('/settings/'),
  update: async (payload: any) =>
    apiRequest('/settings/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  getBankAccount: async () => apiRequest<any>('/payments/bank-account'),
  getMembers: async () => apiRequest<any[]>('/members/'),
  inviteMember: async (payload: { email: string; role: string }) =>
    apiRequest('/members/invite', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  removeMember: async (id: string) =>
    apiRequest(`/members/${id}`, {
      method: 'DELETE',
    }),
};
