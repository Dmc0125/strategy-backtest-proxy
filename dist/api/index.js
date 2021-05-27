"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const candlesticks_1 = __importDefault(require("./candlesticks"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({
        message: '✅ API',
    });
});
router.use('/candlesticks', candlesticks_1.default);
exports.default = router;
