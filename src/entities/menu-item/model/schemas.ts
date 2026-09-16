import { z } from 'zod';

import { validateUntil } from './validate-until';

export const shopSchema = z.enum(['kitchen', 'bar', 'pastry']);
export const stopReasonSchema = z.enum([
  'out_of_stock',
  'equipment',
  'quality',
  'menu_change',
]);

export const stopItemPayloadSchema = z
  .object({
    reason: stopReasonSchema,
    until: z.string().nullable(),
  })
  .superRefine((value, ctx) => {
    const message = validateUntil(value.until);
    if (message) {
      ctx.addIssue({ code: 'custom', message, path: ['until'] });
    }
  });

export const menuItemFilterStatusSchema = z.enum(['available', 'stopped']);
