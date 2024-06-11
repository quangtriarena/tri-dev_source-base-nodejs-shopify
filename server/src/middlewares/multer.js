import multer from "multer";

// SET STORAGE
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "temps");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const uploadMiddleware = multer({ storage });

export default uploadMiddleware;
