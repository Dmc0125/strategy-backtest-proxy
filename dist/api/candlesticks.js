"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exchanges_1 = require("../exchanges");
const respond_1 = __importDefault(require("../utils/respond"));
const validate_1 = __importDefault(require("../utils/validate"));
const router = express_1.Router();
const ftxTimeframes = ['15s', '1m', '5m', '15m', '1h', '4h', '1d'];
const binanceTimeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '8h', '12h', '1d', '3d', '1w', '2w', '1M'];
// TODO: validation for limit, startDate, endDate
const validateInput = (market, limit, startTime, endTime) => {
    if (!validate_1.default(market, new RegExp('^[a-zA-Z]+/[a-zA-Z]+$'))) {
        return 'Market must match expression \'[a-zA-Z]/[a-zA-Z]\'';
    }
    if (limit && (Number.isNaN(+limit) || +limit <= 0)) {
        return 'Limit must be type of number and higher than 0';
    }
    if (startTime && (Number.isNaN(+startTime) || +startTime <= 0)) {
        return 'startTime must be type of number and higher than 0';
    }
    if (endTime && startTime && (Number.isNaN(+endTime) || +endTime <= 0 || +endTime <= +startTime)) {
        return 'endTime must be type of number, higher than 0 and higher than startTime';
    }
    if (startTime && !endTime) {
        return 'endTime not specified';
    }
    if (!startTime && endTime) {
        return 'startTime not specified';
    }
    return false;
};
router.get('/', async (req, res) => {
    const { exchange, market, timeframe, limit, startTime, endTime, } = req.query;
    if (!exchange || !market || !timeframe) {
        respond_1.default(res, { error: 'Exchange, market or timeframe not specified' });
        return;
    }
    const _error = validateInput(market, limit, startTime, endTime);
    if (_error) {
        respond_1.default(res, { error: _error });
        return;
    }
    const _exchange = exchange.toLowerCase();
    const _market = market.toUpperCase();
    if (_exchange === 'ftx') {
        if (!validate_1.default(timeframe, new RegExp(ftxTimeframes.reduce((acc, tf) => `${acc}|(${tf})`, '').slice(1)))) {
            respond_1.default(res, { error: `Valid FTX timeframes are ${ftxTimeframes.reduce((acc, tf) => `${acc}, ${tf}`)}` });
            return;
        }
        try {
            const candlesticks = await exchanges_1.ftx.spot.candlesticks(_market, timeframe);
            respond_1.default(res, { data: candlesticks });
            return;
        }
        catch (error) {
            respond_1.default(res, { error });
            return;
        }
    }
    if (_exchange === 'binance') {
        if (!validate_1.default(timeframe, new RegExp(binanceTimeframes.reduce((acc, tf) => `${acc}|(${tf})`, '').slice(1)))) {
            respond_1.default(res, { error: `Valid Binance timeframes are ${binanceTimeframes.reduce((acc, tf) => `${acc}, ${tf}`, '')}` });
            return;
        }
        const binanceMarket = _market.split('/').join('');
        try {
            const candlesticks = await exchanges_1.binance.spot.candlesticks(binanceMarket, timeframe, {
                limit: limit ? +limit : undefined,
                startTime: startTime ? +startTime : undefined,
                endTime: endTime ? +endTime : undefined,
            });
            respond_1.default(res, { data: candlesticks });
            return;
        }
        catch (error) {
            res.json({
                success: false,
                status: 400,
                ...error,
            });
        }
    }
    respond_1.default(res, { error: 'Supported exchanges are Binance and FTX' });
});
exports.default = router;
