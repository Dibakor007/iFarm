import { formatResponse } from '../utils/responseFormatter.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[ifarm-backend]', err);
  const status = err.statusCode ?? err.status ?? 500;
  res.status(status).json(
    formatResponse({
      status: 'error',
      message: err.message ?? 'Unexpected server error',
    }),
  );
};
