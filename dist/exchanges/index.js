"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.binance = exports.ftx = void 0;
const ftx_api_nodejs_1 = __importDefault(require("ftx-api-nodejs"));
const binance_api_nodejs_1 = __importDefault(require("binance-api-nodejs"));
exports.ftx = new ftx_api_nodejs_1.default();
exports.binance = new binance_api_nodejs_1.default();
