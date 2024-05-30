import express from "express";
import UploadRouter from "./admin/v1/upload.js";

const router = express.Router();

router.use("/v1/upload", UploadRouter);

export default router;
