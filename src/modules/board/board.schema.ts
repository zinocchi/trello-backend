import { z } from "zod";

export const createBoardSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Judul board tidak boleh kosong"),
    description: z.string().optional(),
  }),
});

export const boardIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID Board harus berupa UUID yang valid"),
  }),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>["body"];
