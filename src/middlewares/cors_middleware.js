const cors = require('cors');

const corsMiddleware = {};

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;

corsMiddleware.restrict = () => {
  return cors({
    origin: function (origin, callback) { 
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
};

module.exports = corsMiddleware;
