import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import {
  createBoardSchema,
  boardIdParamSchema,
  inviteMemberSchema,
} from "./board.schema";
import {
  createBoard,
  getMyBoards,
  getBoardDetail,
  inviteMember,
} from "./board.controller";

const router = Router();

router.use(authenticate);

router.post("/", validate(createBoardSchema), createBoard);
router.get("/", getMyBoards);
router.get("/:id", validate(boardIdParamSchema), getBoardDetail);
router.post("/:id/members", validate(inviteMemberSchema), inviteMember);
export const boardRoutes = router;
