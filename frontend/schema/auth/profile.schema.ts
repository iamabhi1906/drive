import z from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(50, "Name must be 50 characters or less."),
  avatar: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || value.startsWith("uploads/") || z.url().safeParse(value).success,
      "Enter a valid image URL.",
    ),
});

export type ProfileInput = z.infer<typeof profileSchema>;
