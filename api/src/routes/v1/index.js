const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const agreementRoute = require('./agreement.route');
const config = require('../../config/config');
const qsccRoute = require('./qscc.route');
const deviceRoute = require('./device.route');
const cattleRoute = require('./cattle.route');
const slaughterRoute = require('./slaughter.route');
const sensorRoute = require('./sensor.route');
const orgRoute = require('./org.route');
const paymentRoute = require('./payment.route')
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
    path: '/agreements',
    route: agreementRoute,
  },
  {
    path: '/qscc',
    route: qsccRoute,
  },
  {
    path: '/devices',
    route: deviceRoute,
  },
  {
    path: '/sensors',
    route: sensorRoute,
  },

  {
    path: '/cattle',
    route: cattleRoute,
  },
  {
    path: '/slaughter',
    route: slaughterRoute,
  },
  {
    path: '/org',
    route: orgRoute,
  },
  {
    path: '/razorpay',
    route: paymentRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
