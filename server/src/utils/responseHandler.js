const ResponseHandler = {
    success: ({ res, data, statusCode = 200, message = '' }) =>
        res.status(statusCode).json({ status: 'success', message, data }),
    error: ({ res, error, message, statusCode = 500 }) =>
        res.status(statusCode).json({ status: 'error', message, error }),
}

export default ResponseHandler
