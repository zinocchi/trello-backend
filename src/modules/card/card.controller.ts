import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
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

// Pastikan fungsi ini menerima (req, res), BUKAN langsung panggil Prisma!
export const reorderCards = asyncHandler(
  async (req: Request, res: Response) => {
    await cardService.reorderCards(req.user!.id, req.body.cards);
    res.status(200).json({
      success: true,
      message: "Posisi kartu berhasil diperbarui",
    });
  },
);

// Controller upload attachment
export const uploadAttachment = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("File tidak boleh kosong", 400);
    }

    const attachment = await cardService.addAttachment(
      req.params.id,
      req.user!.id,
      req.file,
    );

    res.status(201).json({
      success: true,
      message: "File berhasil diupload",
      data: attachment,
    });
  },
);
