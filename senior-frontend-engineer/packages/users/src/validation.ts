import { z } from "zod";

export const MAX_USERNAME_LENGTH = 50;

export const userInputSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Enter a username.")
    .max(
      MAX_USERNAME_LENGTH,
      `Username must be ${MAX_USERNAME_LENGTH} characters or fewer.`,
    ),
  email: z
    .string()
    .trim()
    .min(1, "Enter an email address.")
    .email("Enter a valid email address."),
});
