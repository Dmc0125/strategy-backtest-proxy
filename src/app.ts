import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line import/first
import { notFound, errorHandler } from './middlewares';
// eslint-disable-next-line import/first
import api from './api';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '💱 FTX and Binance proxy',
  });
});

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
