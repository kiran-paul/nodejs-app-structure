const helmet = require('helmet');

const helmetMiddleware = {};

helmetMiddleware.security = () => {
    return helmet({
    contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "https:"],
          fontSrc: ["'self'", "https:"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameAncestors: ["'self'"]
        }
      },
      frameguard: {
        action: 'deny'
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true
      },
      hidePoweredBy: true,
      ieNoOpen: true,
      noSniff: true,
      xssFilter: true
  }); 
}

module.exports = helmetMiddleware;