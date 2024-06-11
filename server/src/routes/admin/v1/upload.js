import express from "express";
import uploadMiddleware from "../../../middlewares/multer.js";
import UploadControllers from "../../../controllers/shopify/upload.controller.js";

const router = express.Router();

router.post("/single", uploadMiddleware.single("files"), UploadControllers.single);
router.post("/multi", uploadMiddleware.array("files"), UploadControllers.multi);

export default router;
