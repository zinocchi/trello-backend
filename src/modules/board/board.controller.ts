import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as boardService from "./board.service";

export const createBoard = asyncHandler(async (req: Request, res: Response) => {
  const board = await boardService.createBoard(req.user!.id, req.body);
  res.status(201).json({
    success: true,
    message: "Board berhasil dibuat",
    data: board,
  });
});

export const getMyBoards = asyncHandler(async (req: Request, res: Response) => {
  const boards = await boardService.getUserBoards(req.user!.id);
  res.status(200).json({
    success: true,
    data: boards,
  });
});

export const getBoardDetail = asyncHandler(
  async (req: Request, res: Response) => {
    const board = await boardService.getBoardById(req.params.id, req.user!.id);
    res.status(200).json({
      success: true,
      data: board,
    });
  },
);

export const inviteMember = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await boardService.inviteMember(
      req.params.id,
      req.user!.id,
      req.body.email,
      req.body.role,
    );
    res.status(201).json({
      success: true,
      message: "Member berhasil ditambahkan ke board",
      data: result,
    });
  },
);
