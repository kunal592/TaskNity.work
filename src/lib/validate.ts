import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'MEMBER']),
  salary: z.number().optional(),
  salaryStatus: z.enum(['CREDITED', 'PENDING']).optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  members: z.array(z.string()).optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  deadline: z.string().datetime().optional().nullable(),
  classified: z.boolean().optional(),
  isDraft: z.boolean().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']),
  projectId: z.string(),
  assignedTo: z.array(z.string()).min(1, 'At least one assignee is required'),
});

export const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  category: z.string(),
});

export const invoiceSchema = z.object({
  client: z.string().min(1, 'Client name is required'),
  amount: z.number().positive('Amount must be positive'),
  status: z.enum(['Paid', 'Pending', 'Overdue']),
});

export async function validateRequest(request: Request, schema: z.ZodSchema<any>) {
  const json = await request.json();
  const result = await schema.safeParseAsync(json);
  if (!result.success) {
    const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(errorMessages);
  }
  return result.data;
}
