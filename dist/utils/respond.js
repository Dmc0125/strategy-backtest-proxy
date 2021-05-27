"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const respond = (res, { error, data, status }) => {
    if (error) {
        res.status(status || 400).json({
            success: false,
            error,
        });
        return;
    }
    if (data) {
        res.status(200).json({
            success: true,
            data,
        });
    }
};
exports.default = respond;
