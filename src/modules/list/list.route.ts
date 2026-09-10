import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createListSchema, updateListSchema } from "./list.schema";
import { createList, updateList, deleteList } from "./list.controller";

const router = Router();

router.use(authenticate);

router.post("/", validate(createListSchema), createList);
router.patch("/:id", validate(updateListSchema), updateList);
router.delete("/:id", deleteList);

export const listRoutes = router;
