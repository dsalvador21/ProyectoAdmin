exports.success = (res, data = {}, status = 200, message = 'OK') => {
  return res.status(status).json({
    status,
    message,
    data,
  });
};

exports.error = (res, status = 500, message = 'Error interno del servidor', details = null) => {
  return res.status(status).json({
    status,
    error: getStatusText(status),
    message,
    ...(details && { details })
  });
};

const getStatusText = (code) => {
  const texts = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
  };
  return texts[code] || 'Error';
};
