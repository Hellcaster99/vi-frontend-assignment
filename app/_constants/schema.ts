import { z } from "zod";

export const taskSchema = z.object({
    checked: z.boolean(),
    id: z.string(),
    title: z.string(),
    status: z.string(),
    label: z.string(),
    priority: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
