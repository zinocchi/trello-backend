import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createCardSchema, updateCardSchema } from "./card.schema";
import { createCard, updateCard, deleteCard } from "./card.controller";

const router = Router();

router.use(authenticate);

router.post("/", validate(createCardSchema), createCard);
router.patch("/:id", validate(updateCardSchema), updateCard);
router.delete("/:id", deleteCard);

export const cardRoutes = router;
