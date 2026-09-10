import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateListInput, UpdateListInput } from "./list.schema";

export const createList = async (userId: string, data: CreateListInput) => {
  const isMember = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId: data.boardId,
        userId,
      },
    },
  });

  if (!isMember) {
    throw new AppError(
      "Board tidak ditemukan atau lu bukan member di board ini",
      403,
    );
  }

  const listCount = await prisma.list.count({
    where: { boardId: data.boardId },
  });

  return prisma.list.create({
    data: {
      title: data.title,
      boardId: data.boardId,
      position: listCount,
    },
  });
};

export const updateList = async (
  listId: string,
  userId: string,
  data: UpdateListInput,
) => {
  const list = await prisma.list.findUnique({
    where: { id: listId },
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
    throw new AppError("List tidak ditemukan atau lu gak punya akses", 404);
  }

  return prisma.list.update({
    where: { id: listId },
    data,
  });
};

export const deleteList = async (listId: string, userId: string) => {
  const list = await prisma.list.findUnique({
    where: { id: listId },
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
    throw new AppError("List tidak ditemukan atau lu gak punya akses", 404);
  }

  await prisma.list.delete({
    where: { id: listId },
  });

  return { message: "List berhasil dihapus" };
};
