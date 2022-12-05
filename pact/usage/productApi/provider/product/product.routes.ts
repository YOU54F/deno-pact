import * as controller from "./product.controller.ts";
import { express } from "../deps.ts";

export const router = express.Router();

router.get("/product/:id", controller.getById);
router.get("/products", controller.getAll);
