import { debugRoute } from '../config/debug';

const debugRouteMiddleware = (req, res, next) => {
  debugRoute(`${req.method} ${req.originalUrl}`);
  next();
};

export default debugRouteMiddleware;
