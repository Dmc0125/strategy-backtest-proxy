import express from 'express';

import candlesticks from './candlesticks';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: '✅ API',
  });
});

router.use('/candlesticks', candlesticks);

export default router;
