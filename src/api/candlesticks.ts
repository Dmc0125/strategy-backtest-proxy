import { Router } from 'express';
import Ftx from 'ftx-api-nodejs';

import { ftx, binance } from '../exchanges';
import respond from '../utils/respond';
import validate from '../utils/validate';

const router = Router();

// TODO: Support for limit, startDate and endDate
interface Query {
  exchange?: 'ftx' | 'binance',
  market?: string;
  // TODO: Add binance timeframe type
  timeframe?: Ftx.Timeframe;
  limit?: string;
  startTime?: string;
  endTime?: string;
}

const ftxTimeframes = ['15s', '1m', '5m', '15m', '1h', '4h', '1d'];
const binanceTimeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '8h', '12h', '1d', '3d', '1w', '2w', '1M'];

// TODO: validation for limit, startDate, endDate
const validateInput = (market: string, limit?: string, startTime?: string, endTime?: string) => {
  if (!validate(market, new RegExp('^[a-zA-Z]+/[a-zA-Z]+$'))) {
    return 'Market must match expression \'[a-zA-Z]/[a-zA-Z]\'';
  }

  if (limit && (Number.isNaN(+limit) || +limit <= 0)) {
    return 'Limit must be type of number and higher than 0';
  }

  if (startTime && (Number.isNaN(+startTime) || +startTime <= 0)) {
    return 'Start time must be type of number and higher than 0';
  }

  if (endTime && startTime && (Number.isNaN(+endTime) || +endTime <= 0 || +endTime <= +startTime)) {
    return 'End time must be type of number, higher than 0 and higher than startTime';
  }

  if (startTime && !endTime) {
    return 'End time not specified';
  }

  if (!startTime && endTime) {
    return 'Start time not specified';
  }

  return false;
};

router.get('/', async (req, res) => {
  const {
    exchange, market, timeframe, limit, startTime, endTime,
  } = req.query as Query;

  if (!exchange || !market || !timeframe) {
    respond(res, { error: 'Exchange, market or timeframe not specified' });
    return;
  }

  const _error = validateInput(market, limit, startTime, endTime);

  if (_error) {
    respond(res, { error: _error });
    return;
  }

  const _exchange = exchange.toLowerCase();
  const _market = market.toUpperCase();

  const options = {
    limit: limit ? +limit : undefined,
    startTime: startTime ? +startTime : undefined,
    endTime: endTime ? +endTime : undefined,
  };

  if (_exchange === 'ftx') {
    if (!validate(timeframe, new RegExp(ftxTimeframes.reduce((acc, tf) => `${acc}|(${tf})`, '').slice(1)))) {
      respond(res, { error: `Valid FTX timeframes are ${ftxTimeframes.reduce((acc, tf) => `${acc}, ${tf}`)}` });
      return;
    }

    try {
      const candlesticks = await ftx.spot.candlesticks(_market, timeframe, options);

      respond(res, { data: candlesticks });
      return;
    } catch (error) {
      respond(res, { error });
      return;
    }
  }

  if (_exchange === 'binance') {
    if (!validate(timeframe, new RegExp(binanceTimeframes.reduce((acc, tf) => `${acc}|(${tf})`, '').slice(1)))) {
      respond(res, { error: `Valid Binance timeframes are ${binanceTimeframes.reduce((acc, tf) => `${acc}, ${tf}`, '')}` });
      return;
    }

    const binanceMarket = _market.split('/').join('');

    try {
      const candlesticks = await binance.spot.candlesticks(binanceMarket, timeframe, options);

      respond(res, { data: candlesticks });
      return;
    } catch (error) {
      res.json({
        success: false,
        status: 400,
        ...error,
      });
    }
  }

  respond(res, { error: 'Supported exchanges are Binance and FTX' });
});

export default router;
