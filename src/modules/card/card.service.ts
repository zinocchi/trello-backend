import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateCardInput, UpdateCardInput } from "./card.schema";

export const createCard = async (userId: string, data: CreateCardInput) => {
  const list = await prisma.list.findUnique({
    where: { id: data.listId },
    include: {
      board: {
        include: {
          members: {
            where: { userId },
          },
        },
      },
    },
  });

  if (!list || list.board.members.length === 0) {
    throw new AppError(
      "List tidak ditemukan atau lu bukan member di board ini",
      403,
    );
  }

  if (data.assigneeId) {
    const isAssigneeMember = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId: list.boardId,
          userId: data.assigneeId,
        },
      },
    });

    if (!isAssigneeMember) {
      throw new AppError(
        "User yang mau di-assign bukan member di board ini",
        400,
      );
    }
  }

  const cardCount = await prisma.card.count({
    where: { listId: data.listId },
  });

  return prisma.card.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      listId: data.listId,
      assigneeId: data.assigneeId,
      position: cardCount,
    },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const updateCard = async (
  cardId: string,
  userId: string,
  data: UpdateCardInput,
) => {
  // Ambil card dan verifikasi akses member
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      list: {
        include: {
          board: {
            include: {
              members: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  if (!card || card.list.board.members.length === 0) {
    throw new AppError("Card tidak ditemukan atau lu gak punya akses", 404);
  }

  return prisma.card.update({
    where: { id: cardId },
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate,
    },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const deleteCard = async (cardId: string, userId: string) => {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      list: {
        include: {
          board: {
            include: {
              members: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  if (!card || card.list.board.members.length === 0) {
    throw new AppError("Card tidak ditemukan atau lu gak punya akses", 404);
  }

  await prisma.card.delete({
    where: { id: cardId },
  });

  return { message: "Card berhasil dihapus" };
};

 export const reorderCards = async (
  userId: string,
  items: { id: string; position: number; listId: string }[],
) => {
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
