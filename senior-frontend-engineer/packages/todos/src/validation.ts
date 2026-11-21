import { z } from "zod";

export const MAX_TODO_TITLE_LENGTH = 120;

export const createToDoItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a todo item title.")
    .max(
      MAX_TODO_TITLE_LENGTH,
      `Title must be ${MAX_TODO_TITLE_LENGTH} characters or fewer.`,
    ),
  assigneeId: z.string().trim().min(1, "Choose an assignee."),
});
