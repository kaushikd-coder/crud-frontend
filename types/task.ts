export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate?: string; 
    createdAt: string;
    updatedAt: string;
}

// ---- Zod schemas for validation (client-side) ----
import { z } from 'zod';

export const TaskCreateSchema = z.object({
    title: z.string().min(1),
    description: z
        .string()
        .min(1, "Description is required")
        .max(5000, "Description must be less than 5000 characters"),
    priority: z.enum(["low", "medium", "high"]),
    status: z.enum(["todo", "in_progress", "done"]),
    dueDate: z
        .string()
        .optional()
        .refine((v) => !v || !Number.isNaN(new Date(v).getTime()), "Invalid date"),
});
export type TaskCreateInput = z.infer<typeof TaskCreateSchema>;

export const TaskUpdateSchema = TaskCreateSchema.partial();
export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>;
