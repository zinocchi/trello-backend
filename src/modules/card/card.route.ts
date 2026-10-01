import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { upload } from "../../middlewares/upload"; // <-- Tambahkan import ini
import {
  createCardSchema,
  updateCardSchema,
  reorderCardsSchema,
} from "./card.schema";
import {
  createCard,
  updateCard,
  deleteCard,
  reorderCards,
  uploadAttachment,
} from "./card.controller";

const router = Router();

router.use(authenticate);

router.patch("/reorder", validate(reorderCardsSchema), reorderCards);

router.post("/:id/attachments", upload.single("file"), uploadAttachment);

router.post("/", validate(createCardSchema), createCard);
router.patch("/:id", validate(updateCardSchema), updateCard);
router.delete("/:id", deleteCard);

export const cardRoutes = router;
