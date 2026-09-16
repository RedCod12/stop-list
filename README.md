# Стоп-лист кухни

Тестовое задание Middle Frontend: один экран смены, на котором позиции ставят в стоп-лист и возвращают в продажу.

Архитектура — [Feature-Sliced Design](https://feature-sliced.design/). Слой `pages` назван `views`: Next.js занимает `pages/` / `src/pages` под Pages Router.

## Запуск

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

Сборка: `npm run build` · проверка: `npm run lint`.

## Слои FSD

Импорты только вниз по слоям и только через public API слайса (`index.ts`). Слайсы одного слоя друг друга не импортируют.

```
src/
  app/                 # Next.js App Router: layout, providers, route handlers
  views/stop-list/     # страница: шапка + виджет
  widgets/stop-list/   # составной блок: фильтры + таблица + состояния
  features/
    filter-menu-items/ # URL-фильтры цех/статус
    stop-menu-item/    # стоп, изменение, возврат в продажу
  entities/menu-item/  # типы, Zod, лейблы, HTTP, parse/match фильтров
  shared/              # ui-kit, cn, http-хелперы, тосты
```

| Слой | Что внутри |
| --- | --- |
| `app` | RSC читает `searchParams`, QueryClientProvider, API. Данных меню в RSC нет — список грузится на клиенте из‑за loading и серверного delay. |
| `views` | Композиция экрана. |
| `widgets` | Таблица и обвязка loading/error/empty. Собирает фичи, не знает про Zod-форму. |
| `features` | Пользовательские действия. Панель стопа — React Context. Стоп и resume — одна фича и общая optimistic-обёртка. |
| `entities` | Модель позиции. HTTP, parse/match фильтров, серверный in-memory store. |
| `shared` | Кнопки, селект, бейдж, тосты. Без бизнес-смысла стоп-листа. |

Фильтры живут в URL (`?shop=bar&status=stopped`) через `router.push`, чтобы работала кнопка «назад» и перезагрузка.

## Решения

- **Query vs UI.** Список — React Query (`query.data`). Панель и тосты — Context.
- **Оптимистичное обновление.** Строка меняется сразу, при ошибке откат + тост. Пока запрос идёт — «сохраняется».
- **Форма.** React Hook Form, `mode: 'onBlur'`. Перед `POST` тот же `stopItemPayloadSchema`, что в route handler.
- **Время.** `null` = до конца смены. Иначе ISO в будущем, ≤24 ч, шаг 15 минут.
- **Остаток 0.** Resume на клиенте disabled + `title`, на сервере 409.
- **Уже в стопе.** «Изменить» открывает ту же панель с предзаполнением.
- **Цвета.** Фон `#F6F3EE`, акцент `#C6462F`, текст `#171512`. Source Sans 3 с кириллицей.

## API

- `GET /api/menu-items?shop=&status=` — задержка ~450 мс.
- `POST /api/menu-items/:id/stop` — `{ reason, until }`, ~600 мс, ~20% `503`.
- `POST /api/menu-items/:id/resume` — без тела, те же задержка и ошибка; `stock === 0` → 409.
