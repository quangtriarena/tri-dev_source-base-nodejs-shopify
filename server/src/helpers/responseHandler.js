const ResponseHandler = {
	success: (res, data, message) => res.status(200).json({ status: "success", message, data }),
	error: (res, message, status = 500) => res.status(status).json({ status: "error", message }),
};

export default ResponseHandler;
