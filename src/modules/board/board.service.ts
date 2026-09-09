import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateBoardInput } from "./board.schema";

// 1. Bikin board baru + langsung insert creator jadi OWNER (Nested Write)
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
        select: { lists: true }, // Mirip withCount('lists') di Laravel
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// 3. Detail board beserta List dan Card di dalamnya (Eager Loading bertingkat)
export const getBoardById = async (boardId: string, userId: string) => {
  // Cek dulu apakah user ini member dari board tersebut
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

  // Ambil data board, list, dan card secara hierarkis (terurut by position)
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
