import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as cardService from "./card.service";

export const createCard = asyncHandler(async (req: Request, res: Response) => {
  const card = await cardService.createCard(req.user!.id, req.body);
  res.status(201).json({
    success: true,
    message: "Card berhasil dibuat",
    data: card,
  });
});

export const updateCard = asyncHandler(async (req: Request, res: Response) => {
  const card = await cardService.updateCard(
    req.params.id,
    req.user!.id,
    req.body,
  );
  res.status(200).json({
    success: true,
    message: "Card berhasil diperbarui",
    data: card,
  });
});

export const deleteCard = asyncHandler(async (req: Request, res: Response) => {
  const result = await cardService.deleteCard(req.params.id, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});
