import express from "express";
import UploadRouter from "./admin/v1/upload.js";
import MetafieldRouter from "./admin/v1/metafield.js";

const router = express.Router();

router.use("/v1/upload", UploadRouter);

//#region [metafield definition]
router.use("/v1/metafield/definitions", MetafieldRouter);
//#endregion

export default router;
