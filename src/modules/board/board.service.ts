import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateBoardInput } from "./board.schema";

export const createBoard = async (userId: string, data: CreateBoardInput) => {
  return prisma.board.create({
    data: {
      title: data.title,
      description: data.description,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });
};

export const getUserBoards = async (userId: string) => {
  return prisma.board.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        select: {
          role: true,
          userId: true,
        },
      },
      _count: {
        select: { lists: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBoardById = async (boardId: string, userId: string) => {
  const member = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId,
      },
    },
  });

  if (!member) {
    throw new AppError(
      "Board tidak ditemukan atau lu gak punya akses ke board ini",
      404,
    );
  }

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      lists: {
        orderBy: { position: "asc" },
        include: {
          cards: {
            orderBy: { position: "asc" },
            include: {
              assignee: {
                select: { id: true, name: true },
              },
            },
          },
        },
      },
    },
  });

  return board;
};
