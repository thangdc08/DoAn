import AppError from "./app-error.js";

const normalizeHttpStatus = (code) => {
    const n = Number(code);
    if (Number.isInteger(n) && n >= 100 && n <= 599) return n;
    return 500;
};

export function errorHandler(err, req, res, next) {

    if (err instanceof AppError) {
        const status = normalizeHttpStatus(err.code);
        return res.status(status).json({
            timestamp: new Date().toISOString(),
            code: status,
            message: err.message,
        });
    }

    // fallback cho lỗi không mong muốn
    res.status(500).json({
        timestamp: new Date().toISOString(),
        code: 500,
        message: "Internal Server Error",
    });
}
