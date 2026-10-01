import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as cardService from "./card.service";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

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

// Logic Reorder Drag & Drop (Eksekusi Batch Transaction)
export const reorderCards = async (
  userId: string,
  items: { id: string; position: number; listId: string }[],
) => {
  // Jalankan update posisi sekaligus dalam satu transaksi atomik
  return prisma.$transaction(
    items.map((item) =>
      prisma.card.update({
        where: { id: item.id },
        data: {
          position: item.position,
          listId: item.listId,
        },
      }),
    ),
  );
};

// Logic Simpan Attachment File
export const addAttachment = async (
  cardId: string,
  userId: string,
  file: Express.Multer.File,
) => {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      list: {
        include: {
          board: {
            include: {
              members: { where: { userId } },
            },
          },
        },
      },
    },
  });

  if (!card || card.list.board.members.length === 0) {
    throw new AppError(
      "Card tidak ditemukan atau lu bukan member board ini",
      403,
    );
  }

  const fileUrl = `/uploads/${file.filename}`;

  return prisma.attachment.create({
    data: {
      filename: file.originalname,
      url: fileUrl,
      mimetype: file.mimetype,
      size: file.size,
      cardId,
    },
  });
};
