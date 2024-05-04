import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import './assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import 'semantic-ui-css/semantic.min.css'
import './assets/scss/argon-dashboard-react.scss';
import { ToastProvider, useToasts } from 'react-toast-notifications';

import { Provider } from 'react-redux';

import AdminLayout from './layouts/Admin.js';
import AuthLayout from './layouts/Auth.js';

import mainReducer from './reducers/main';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  mainReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

ReactDOM.render(
  <GoogleOAuthProvider clientId='199759029626-dgc3280klfq5u5r0o44kho7fnomvgspk.apps.googleusercontent.com'>
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <Switch>
            <Route
              path='/admin'
              render={(props) => <AdminLayout {...props} />}
            />
            <Route path='/auth' render={(props) => <AuthLayout {...props} />} />
            <Redirect from='/' to='/auth/login' />
          </Switch>
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);

// ReactDOM.render(
//   // <ToastProvider>
//     <BrowserRouter>
//       <Switch>
//         <Route path="/admin" render={props => <AdminLayout {...props} />} />
//         <Route path="/auth" render={props => <AuthLayout {...props} />} />
//         <Redirect from="/" to="/auth/login" />
//       </Switch>
//     </BrowserRouter>
//   // </ToastProvider>
//   ,
//   document.getElementById("root")
// );
