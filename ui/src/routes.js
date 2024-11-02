/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Profile from "./views/examples/Profile.js";
// import Maps from "./views/examples/Maps.js";
import Login from "./views/examples/Login.js";
// import Tables from "./views/examples/Tables.js";
// import Icons from "./views/examples/Icons.js";
import Admin from "./views/examples/admin.js";
import Organization from "views/examples/Fabric-Custom-Network/Organization.js";
import CreateRequest from "views/examples/Fabric-Custom-Network/CreateRequest.js";
import AboutUs from "./views/examples/Fabric-Custom-Network/AboutUs.js";
import ContactUs from "views/examples/Fabric-Custom-Network/ContactUs.js";
import PrivacyPolicy from "views/examples/Fabric-Custom-Network/PrivacyPolicy.js";
import termsAndCondition from "views/examples/Fabric-Custom-Network/termsAndConditions.js";
import RefundPolicy from "views/examples/Fabric-Custom-Network/RefundPolicy.js";

var routes = [

  {
    path: "/create-request",
    name: "Create Request",
    icon: "ni ni-single-02 text-yellow",
    component: CreateRequest,
    layout: "/admin",
  },
  {
    path: "/Organization",
    name: "All Requests",
    icon: "ni ni-single-02 text-yellow",
    component: Organization,
    layout: "/admin",
  },
  {
    path: "/admin",
    name: "Admin",
    icon: "ni ni-tv-2 text-primary",
    component: Admin,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },

  {
    path: "/contact-us",
    name: "About Us",
    icon: "ni ni-single-02 text-yellow",
    component: ContactUs,
    layout: "/auth",
  },
  {
    path: "/privacy-policy",
    name: "About Us",
    icon: "ni ni-single-02 text-yellow",
    component: PrivacyPolicy,
    layout: "/auth",
  },
  {
    path: "/terms-and-conditions",
    name: "About Us",
    icon: "ni ni-single-02 text-yellow",
    component: termsAndCondition,
    layout: "/auth",
  },
  {
    path: "/refund-policy",
    name: "About Us",
    icon: "ni ni-single-02 text-yellow",
    component: RefundPolicy,
    layout: "/auth",
  },
];
export default routes;
