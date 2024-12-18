const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const assetRoute = require('./asset.route');
const config = require('../../config/config');
const qsccRoute = require('./qscc.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/assets',
    route: assetRoute,
  },
  {
    path: '/qscc',
    route: qsccRoute,
  },

];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
