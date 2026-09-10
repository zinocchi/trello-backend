import { z } from "zod";

export const createListSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Judul list tidak boleh kosong"),
    boardId: z.string().uuid("ID Board harus berupa UUID yang valid"),
  }),
});

export const updateListSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID List harus berupa UUID yang valid"),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    position: z.number().int().min(0).optional(),
  }),
});

export type CreateListInput = z.infer<typeof createListSchema>["body"];
export type UpdateListInput = z.infer<typeof updateListSchema>["body"];
