const fs = require('fs');

const logFileStream = fs.createWriteStream('app.log', { flags: 'a' });

const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const log = `${timestamp} ${method} ${url} ${ip}`;
  console.log(log);
  logFileStream.write(log + '\n');

  next();
};

module.exports = loggingMiddleware;
