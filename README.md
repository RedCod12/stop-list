# Стоп-лист кухни

Тестовое задание Middle Frontend: один экран смены, на котором позиции ставят в стоп-лист и возвращают в продажу.

Архитектура — [Feature-Sliced Design](https://feature-sliced.design/). Слой `pages` назван `views`: Next.js занимает `pages/` / `src/pages` под Pages Router.

## Демо

Запись экрана и скриншоты добавлены в [`demo/`](./demo/):

- [Запись экрана](./demo/recording.mov)
- [Скриншот 1](./demo/screenshot-01.png)
- [Скриншот 2](./demo/screenshot-02.png)
- [Скриншот 3](./demo/screenshot-03.png)
- [Скриншот 4](./demo/screenshot-04.png)

## Запуск

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

Сборка: `npm run build` · lint: `npm run lint` · тесты: `npm test`.

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
| `features` | Пользовательские действия. Панель и тосты — Zustand (только UI). Стоп и resume — одна фича и общая optimistic-обёртка. |
| `entities` | Модель позиции. HTTP, parse/match фильтров, серверный in-memory store. |
| `shared` | Кнопки, селект, бейдж, тосты. Без бизнес-смысла стоп-листа. |

Фильтры живут в URL (`?shop=bar&status=stopped`) через `router.push`, чтобы работала кнопка «назад» и перезагрузка.

## Решения

Выбрала FSD с `views` вместо `pages`, чтобы не конфликтовать с App Router Next.js и держать границы слоёв явными. Список и мутации живут в React Query (ключи, оптимистика, инвалидация), а панель и тосты — в Zustand, без дублирования серверных данных в сторе. Стоп и resume собрала в одну фичу с общим optimistic-патчем всех закэшированных списков и откатом; фильтры — в URL. Одна Zod-схема валидирует стоп и на клиенте, и в route handler.

- **Query vs UI.** Список — React Query (`query.data`). Панель и тосты — Zustand.
- **Оптимистичное обновление.** Патч кэшей сразу; при ошибке — откат + тост; при успехе — тост подтверждения. Пока запрос идёт — «сохраняется» на строке.
- **Форма.** React Hook Form, `mode: 'onBlur'`. Перед `POST` тот же `stopItemPayloadSchema`, что в route handler.
- **Время.** `null` = до конца смены. Иначе ISO в будущем, ≤24 ч, шаг 15 минут.
- **Остаток 0.** Resume на клиенте disabled + `title`, на сервере 409.
- **Уже в стопе.** «Изменить» открывает ту же панель с предзаполнением.
- **Цвета.** Фон `#F6F3EE`, акцент `#C6462F`, текст `#171512`. Source Sans 3 с кириллицей.

## Бонусы

- Одна Zod-схема `stopItemPayloadSchema` на клиенте (форма) и в `POST …/stop`.
- Framer Motion: панель/оверлей, тосты, смена бейджа статуса — без `layout` на строках таблицы, чтобы список не «прыгал».
- a11y: `role="dialog"`, `aria-modal`, Esc, focus trap, возврат фокуса, кнопка закрытия, кастомный селект с listbox.
- Юнит-тест: optimistic stop + rollback (`npm test`).

## Допущения

- Мок API с `delay` и ~20% `503` — намеренно, чтобы проверить тост и откат.
- In-memory store живёт в процессе Node: сбрасывается при рестарте `next dev` / hot reload. На Vercel (serverless) состояние между инвокациями **не гарантируется** — после деплоя список может «забывать» стопы; для задания это ожидаемо.
- Невалидный `shop`/`status` в URL игнорируется при парсе (как «все»).
- Кастомный `Select` вместо нативного из‑за кривого выравнивания options в macOS.

## Если было бы больше времени

Что доделала / переделала бы — без расползания скоупа задания:

1. **Состояние панели в виджете.** `selectedId` в Zustand удобен, но для одного экрана достаточно `useState` в `widgets/stop-list` и пропсов в таблицу/панель — меньше глобального UI-стейта.
2. **zodResolver в форме.** Сейчас RHF + ручной `safeParse` перед сабмитом; подключила бы `stopItemPayloadSchema` через resolver, чтобы ошибки полей и API жили на одной схеме без дубля `validate`.
3. **Серверный ответ после мутации.** Optimistic уже есть; дополнительно мержила бы `item` из `200` в кэш, а не только `invalidate`, чтобы убрать лишний GET при удачном стопе.
4. **Селект.** Стрелки меняют value; довела бы roving tabindex / `aria-activedescendant` и закрытие по Enter без сюрпризов для скринридеров.
5. **Тесты.** Один кейс на rollback есть; добавила бы resume + сценарий «фильтр available → позиция исчезает» и тонкий MSW/route-тест на ту же Zod-схему.
6. **Таблица на узком экране.** Горизонтальный скролл есть; для кухни на планшете — карточки или sticky-колонка действий.
7. **Error Boundary / retry UI.** Сейчас ошибка списка — карточка; явная «Повторить» через `refetch` была бы понятнее повару при флапе сети.
8. **Мок `503`.** Вынесла бы `FAIL_RATE` в env (`STOP_LIST_FAIL_RATE=0`), чтобы демо для ревьюеров не ловило случайный тост.

## API

- `GET /api/menu-items?shop=&status=` — задержка ~450 мс.
- `POST /api/menu-items/:id/stop` — `{ reason, until }`, ~600 мс, ~20% `503`.
- `POST /api/menu-items/:id/resume` — без тела, те же задержка и ошибка; `stock === 0` → 409.
