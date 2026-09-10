import { z } from "zod";

export const createCardSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Judul card tidak boleh kosong"),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(), 
    listId: z.string().uuid("ID List harus berupa UUID yang valid"),
    assigneeId: z
      .string()
      .uuid("ID Assignee harus berupa UUID yang valid")
      .optional(),
  }),
});

export const updateCardSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID Card harus berupa UUID yang valid"),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
    listId: z.string().uuid().optional(),
    position: z.number().int().min(0).optional(),
    assigneeId: z.string().uuid().nullable().optional(),
  }),
});

export type CreateCardInput = z.infer<typeof createCardSchema>["body"];
export type UpdateCardInput = z.infer<typeof updateCardSchema>["body"];
