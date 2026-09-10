import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as listService from "./list.service";

export const createList = asyncHandler(async (req: Request, res: Response) => {
  const list = await listService.createList(req.user!.id, req.body);
  res.status(201).json({
    success: true,
    message: "List berhasil dibuat",
    data: list,
  });
});

export const updateList = asyncHandler(async (req: Request, res: Response) => {
  const list = await listService.updateList(
    req.params.id,
    req.user!.id,
    req.body,
  );
  res.status(200).json({
    success: true,
    message: "List berhasil diperbarui",
    data: list,
  });
});

export const deleteList = asyncHandler(async (req: Request, res: Response) => {
  const result = await listService.deleteList(req.params.id, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});
