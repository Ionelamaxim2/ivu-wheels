export type User = {
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
};

const USER_KEY = "user";
const ORDERS_KEY = "orders";

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getUser();
}

export type OrderItem = { name: string; quantity: number; price: number };
export type Order = {
  id: string;
  date: string; // ISO
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
};

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function addOrder(order: Order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getCartKey(): string {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return "cart";
    const u = JSON.parse(raw) as User;
    if (u?.email) return `cart:${u.email}`;
    return "cart";
  } catch {
    return "cart";
  }
}

export function getCartCount(): number {
  try {
    const key = getCartKey();
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const items = JSON.parse(raw) as Array<{ quantity?: number }>;
    return items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  } catch {
    return 0;
  }
}
