import {z} from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().min(1, 'Name is required'),
  password_hash: z.string().min(1, 'Password is required'),
});

export type User = z.infer<typeof UserSchema>;
