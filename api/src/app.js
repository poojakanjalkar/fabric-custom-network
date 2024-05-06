const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const logger = require('../src/logger')(module)

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

const yaml = require('js-yaml');
const fs = require('fs');

const jsonData = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com',
  hobbies: ['reading', 'hiking', 'coding'],
  address: {
    city: 'New York',
    country: 'USA'
  }
};

// Convert JSON to YAML
const yamlData = yaml.dump(jsonData);

// Write YAML data to file
fs.writeFileSync('data.yaml', yamlData, 'utf8');

console.log('Conversion complete!');

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
  });

logger.error("This is test message")
// set security HTTP headers
app.use(helmet());

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '199759029626-dgc3280klfq5u5r0o44kho7fnomvgspk.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


// let token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjM2UzZTU1ODExMWM3YzdhNzVjNWI2NTEzNGQyMmY2M2VlMDA2ZDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxOTk3NTkwMjk2MjYtZGdjMzI4MGtsZnE1dTVyMG80NGtobzdmbm9tdmdzcGsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxOTk3NTkwMjk2MjYtZGdjMzI4MGtsZnE1dTVyMG80NGtobzdmbm9tdmdzcGsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQ5MDc1ODk0MDU4NDYwMjc3MzkiLCJoZCI6InBhcmFtb3VudHNvZnQubmV0IiwiZW1haWwiOiJhZGhhdkBwYXJhbW91bnRzb2Z0Lm5ldCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3MTQ1MDAyMTcsIm5hbWUiOiJQYXZhbiBBZGhhdiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKeGFMelc0d0R4aHZJTU1lbGZaZFRWY2NubVRMb2lJdmpZNExWU1FCcXE3ejZhV2c9czk2LWMiLCJnaXZlbl9uYW1lIjoiUGF2YW4iLCJmYW1pbHlfbmFtZSI6IkFkaGF2IiwiaWF0IjoxNzE0NTAwNTE3LCJleHAiOjE3MTQ1MDQxMTcsImp0aSI6IjQ5OWFiZDY1YmQyY2JiMjE5ZmFkYTlhNTliODA1MThjOGRkYzlhMGYifQ.E2bgy4UR5PIuHw4GSmF27808ThsttRDlxZNEblqvERpHj5ruuFJv1g33ma-nWO3S2aFu2tFVOSrhgUyNAKUgg1jdHZi0F1SILaOHg4HR_5RNplH4fMOs1y0sBIf9xtrGmJhAZKjpLos7HOqOhn1BiZmkLF_wjblk-QMHeDBj-WydQ1XcswoPAyaFy-lcV0SZZ9fF2W7M5EY0gH3AnBNzByvtDrroh98tdgaf7xTbfjvtmULo6AW5T_gz8A4LWE0ahVD22EhP2Ex9BwW0RkxmZYpmbbYuYYt4QXckyT-AbWno-wEdqNYdr_em6p0vazGftRZ9NmV4-vqMKPR8GMQI7g"
let token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUxYjkzYzY0MDE0NGI4NGJkMDViZjI5NmQ2NzI2MmI2YmM2MWE0ODciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxOTk3NTkwMjk2MjYtZGdjMzI4MGtsZnE1dTVyMG80NGtobzdmbm9tdmdzcGsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxOTk3NTkwMjk2MjYtZGdjMzI4MGtsZnE1dTVyMG80NGtobzdmbm9tdmdzcGsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTgzNDA2ODE3MDI5NTM0MTc2MDYiLCJlbWFpbCI6ImFkaGF2cGF2YW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTcxNDUzMDI5NCwibmFtZSI6IlBhdmFuIEFkaGF2IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0sxNlFtWDRLd01FcmI0blJ3R18tUnVUZlM1dHh1TlpCMG91Vzd2RkVJWFdldDRpVnJjPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlBhdmFuIiwiZmFtaWx5X25hbWUiOiJBZGhhdiIsImlhdCI6MTcxNDUzMDU5NCwiZXhwIjoxNzE0NTM0MTk0LCJqdGkiOiJmOWRiYzI0NWY0YjU3ZTkwYTgwZGZkODkwMTg4ODczNDg3YzE0NzIwIn0.lPDDXDhZ180nzSSIo4QMB49ZQ4lI6HTeFcj7pZtO6_9q0YPaCy4NBs-gDfNkpxPnrJHVfL5eNnylDumE9K-Hq_H0YrDvLlo3O37aMCCphcA6c2ZF0b_dItzL1vuppnoVsNo-fpMb1SgEV8JDhYL7XEUwMDmwXzERqAYZVgomCEJe-wN7jbxu-LrjoEyjlqXq0i4oJEMrmznTk-g1y3vozvjIjO1CuR4MWmQtgGUKYOyTUfGQB-cLAweNsoXzB1r7PRJS1CzeM8ng3BpW5LG2W7qZ4Sjy5x4INW8QE1M7IvDGU9XCa2RoYKELPmNTwPo_eDGY3G6oZaUYqW__JSSkiw"
// const test = async()=> {
//     try {
//     // const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: CLIENT_ID,
//     });
//     // const payload = ticket.getPayload();
//     console.log("---------------------", payload)
//     const  newToken = await client.refreshToken(token);
//     console.log("-----------token----------",  newToken.credentials)
//     return newToken.credentials.access_token;
//   } catch (error) {
//     console.log("-----------error----------", error)
//   }
  
//  }

//  test()


// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
