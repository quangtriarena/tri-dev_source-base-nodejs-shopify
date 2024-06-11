import express from "express";
import uploadMiddleware from "../../../configs/multer.js";
import UploadControllers from "../../../controllers/shopify/upload.controller.js";
import MiddlewareCommons from "../../../middlewares/common.js";

const router = express.Router();

router.post(
	"/single",
	MiddlewareCommons.checkFolderExist,
	uploadMiddleware.single("files"),
	UploadControllers.single
);
router.post(
	"/multi",
	MiddlewareCommons.checkFolderExist,
	uploadMiddleware.array("files"),
	UploadControllers.multi
);

export default router;
