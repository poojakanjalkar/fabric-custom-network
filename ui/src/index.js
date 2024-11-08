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
import FooterLayout from './layouts/Footer.js'
import Login from "../src/components/Login"
import ContactUs from '../src/views/examples/Fabric-Custom-Network/ContactUs'
import PrivacyPolicy from '../src/views/examples/Fabric-Custom-Network/PrivacyPolicy'
import termsAndConditions from '../src/views/examples/Fabric-Custom-Network/termsAndConditions'
import RefundPolicy from '../src/views/examples/Fabric-Custom-Network/RefundPolicy'
import WhatsAppIcon from 'views/examples/Fabric-Custom-Network/helper/WhatsAppIcon';

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
        <WhatsAppIcon/>
          <Switch>
            <Route
              path='/admin'
              render={(props) => <AdminLayout {...props} />}
            />
             {/* <Route path="/auth/*" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="contact-us" element={<ContactUs />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-and-conditions" element={<termsAndConditions />} />
              <Route path="refund-policy" element={<RefundPolicy />} />
            </Route> */}
             <Route 
              path={["/privacy-policy", "/terms-and-conditions", "/refund-policy", "/contact-us"]} 
              component={FooterLayout} 
            />
            <Route path='/auth' render={(props) => <AuthLayout {...props} />} />
            <Redirect from='*' to='/auth/login' />
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
