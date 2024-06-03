import express from "express";
import MetafieldControllers from "../../../controllers/shopify/metafield.controller.js";

const router = express.Router();

//#region [definition]
router.get("/", MetafieldControllers.definition.findAll);
router.get("/:id", MetafieldControllers.definition.findById);
router.post("/", MetafieldControllers.definition.create);
router.post("/:id", MetafieldControllers.definition.update);
router.delete("/:id", MetafieldControllers.definition.delete);
router.post("/:id/set-value", MetafieldControllers.definition.setValue);
//#endregion

//#region [app]
//#endregion

//#region [product]
//#endregion

//#region [collection]
//#endregion

//#region [variant]
//#endregion

// ...

export default router;
