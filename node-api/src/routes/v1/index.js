const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const qsccRoute = require('./qscc.route');
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
    path: '/qscc',
    route: qsccRoute,
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


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
