export const SHOP_LABELS = {
  kitchen: 'Кухня',
  bar: 'Бар',
  pastry: 'Кондитерская',
} as const;

export const REASON_LABELS = {
  out_of_stock: 'Закончились продукты',
  equipment: 'Сломалось оборудование',
  quality: 'Вопросы к качеству',
  menu_change: 'Выведена из меню смены',
} as const;

export const STATUS_LABELS = {
  available: 'В продаже',
  stopped: 'В стоп-листе',
} as const;
