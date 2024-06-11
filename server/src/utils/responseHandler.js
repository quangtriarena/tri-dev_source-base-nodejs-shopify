const ResponseHandler = {
	success: ({ res, data, statusCode = 200, message = "" }) =>
		res.status(statusCode).json({ status: "success", message, data }),
	error: ({ res, message, statusCode = 500 }) =>
		res.status(statusCode).json({ status: "error", message }),
};

export default ResponseHandler;
