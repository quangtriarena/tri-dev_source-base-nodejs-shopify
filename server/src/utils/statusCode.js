const statusCodes = {
    // Lỗi chung
    genericError: 500,
    notFound: 404,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,

    // Lỗi xác thực
    invalidCredentials: 401,
    missingToken: 401,
    expiredToken: 401,

    // Lỗi dữ liệu
    invalidData: 422,
    missingData: 400,

    // Lỗi cụ thể cho ứng dụng
    // ... (Thêm mã trạng thái lỗi và mô tả cho các trường hợp cụ thể trong ứng dụng của bạn)
}

export default statusCodes
