"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// eslint-disable-next-line import/first
const middlewares_1 = require("./middlewares");
// eslint-disable-next-line import/first
const api_1 = __importDefault(require("./api"));
const app = express_1.default();
app.use(morgan_1.default('dev'));
app.use(helmet_1.default());
app.use(cors_1.default());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({
        message: '💱 FTX and Binance proxy',
    });
});
app.use('/api/v1', api_1.default);
app.use(middlewares_1.notFound);
app.use(middlewares_1.errorHandler);
module.exports = app;
