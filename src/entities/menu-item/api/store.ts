import type { MenuItem } from '../model/types';

const now = () => new Date().toISOString();

const seed: MenuItem[] = [
  {
    id: '1',
    title: 'Борщ',
    shop: 'kitchen',
    stock: 12,
    status: { kind: 'available' },
    updatedAt: now(),
  },
  {
    id: '2',
    title: 'Цезарь с курицей',
    shop: 'kitchen',
    stock: 4,
    status: {
      kind: 'stopped',
      reason: 'out_of_stock',
      until: null,
    },
    updatedAt: now(),
  },
  {
    id: '3',
    title: 'Стейк рибай',
    shop: 'kitchen',
    stock: 0,
    status: {
      kind: 'stopped',
      reason: 'quality',
      until: null,
    },
    updatedAt: now(),
  },
  {
    id: '4',
    title: 'Паста карбонара',
    shop: 'kitchen',
    stock: 9,
    status: { kind: 'available' },
    updatedAt: now(),
  },
  {
    id: '5',
    title: 'Том ям',
    shop: 'kitchen',
    stock: 6,
    status: { kind: 'available' },
    updatedAt: now(),
  },
  {
    id: '6',
    title: 'Эспрессо',
    shop: 'bar',
    stock: 40,
    status: { kind: 'available' },
    updatedAt: now(),
  },
  {
    id: '7',
    title: 'Капучино',
    shop: 'bar',
    stock: 18,
    status: {
      kind: 'stopped',
      reason: 'equipment',
      until: null,
    },
    updatedAt: now(),
  },
  {
    id: '8',
    title: 'Негрони',
    shop: 'bar',
    stock: 7,
    status: { kind: 'available' },
    updatedAt: now(),
  },
  {
    id: '9',
    title: 'Смузи манго',
    shop: 'bar',
    stock: 3,
    status: { kind: 'available' },
    updatedAt: now(),
  },
  {
    id: '10',
    title: 'Лимонад домашний',
    shop: 'bar',
    stock: 0,
    status: {
      kind: 'stopped',
      reason: 'out_of_stock',
      until: null,
    },
    updatedAt: now(),
  },
  {
    id: '11',
    title: 'Наполеон',
    shop: 'pastry',
    stock: 8,
    status: { kind: 'available' },
    updatedAt: now(),
  },
  {
    id: '12',
    title: 'Чизкейк',
    shop: 'pastry',
    stock: 5,
    status: { kind: 'available' },
    updatedAt: now(),
  },
  {
    id: '13',
    title: 'Макарон фисташка',
    shop: 'pastry',
    stock: 14,
    status: {
      kind: 'stopped',
      reason: 'menu_change',
      until: null,
    },
    updatedAt: now(),
  },
  {
    id: '14',
    title: 'Тирамису',
    shop: 'pastry',
    stock: 2,
    status: { kind: 'available' },
    updatedAt: now(),
  },
];

let items: MenuItem[] = seed.map((item) => ({
  ...item,
  status: { ...item.status },
}));

export function listMenuItems(): MenuItem[] {
  return items.map((item) => ({ ...item, status: { ...item.status } }));
}

export function getMenuItem(id: string): MenuItem | undefined {
  const item = items.find((entry) => entry.id === id);
  return item ? { ...item, status: { ...item.status } } : undefined;
}

export function updateMenuItem(
  id: string,
  patch: Partial<MenuItem>,
): MenuItem | undefined {
  const index = items.findIndex((entry) => entry.id === id);
  if (index === -1) return undefined;
  const current = items[index];
  const next: MenuItem = {
    ...current,
    ...patch,
    status: patch.status ?? { ...current.status },
    updatedAt: now(),
  };
  items = items.map((entry, entryIndex) =>
    entryIndex === index ? next : entry,
  );
  return { ...next, status: { ...next.status } };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function shouldFail(rate = 0.2): boolean {
  return Math.random() < rate;
}
