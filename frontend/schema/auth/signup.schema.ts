import z from 'zod';

export const signupSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  name: z.string().trim().min(2, 'Enter your name.').max(80, 'Name must be 80 characters or less.'),
});

export type SignUp = z.infer<typeof signupSchema>;
