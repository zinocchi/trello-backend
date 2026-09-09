import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createBoardSchema, boardIdParamSchema } from "./board.schema";
import { createBoard, getMyBoards, getBoardDetail } from "./board.controller";

const router = Router();

router.use(authenticate);

router.post("/", validate(createBoardSchema), createBoard);
router.get("/", getMyBoards);
router.get("/:id", validate(boardIdParamSchema), getBoardDetail);

export const boardRoutes = router;
