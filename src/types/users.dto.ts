import {z} from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
});

export type User = z.infer<typeof UserSchema>;
