import { TaskPriority } from '@/features/tasks/tasks.types';
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().trim().min(2, 'Give this task a title.').max(120, 'Keep the title under 120 characters.'),
  description: z.string().trim().max(600, 'Keep the description under 600 characters.').optional(),
  priority: z.enum(TaskPriority),
  due_date: z.string().optional(),
  labelIds: z.array(z.number()),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
