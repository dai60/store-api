import { Router } from "express";
import * as controller from "../controllers/controller";

const router = Router();

router.get("/products", controller.products_get);
router.get("/products/:id", controller.products_get_id);

router.post("/products", controller.products_post);

router.put("/products/:id", controller.products_put);

router.delete("/products/:id", controller.products_delete);

export default router;
