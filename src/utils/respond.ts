import { Response } from 'express';

const respond = (res: Response, { error, data, status }: { error?: string, data?: unknown, status?: number }) => {
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

export default respond;
