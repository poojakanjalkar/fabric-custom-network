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
import Index from "./views/Index.js";
import Profile from "./views/examples/Profile.js";
// import Maps from "./views/examples/Maps.js";
import Register from "./views/examples/Register.js";
import Login from "./views/examples/Login.js";
// import Tables from "./views/examples/Tables.js";
// import Icons from "./views/examples/Icons.js";
import Icons from "./views/examples/Icons.js";
import Dashboard from "./views/Dashboard/Dashboard.js";
import Admin from "./views/examples/admin.js";
import ContractHistory from "./views/examples/ContractHistory.js";
import Device from "views/examples/Trust-Score/Device.js";
import Cattle from "views/examples/Trust-Score/Cattle.js";
import SlaughterHouse from "views/examples/Trust-Score/SlaughterHouse.js";
import Organization from "views/examples/Fabric-Custom-Network/Organization.js";
import CreateRequest from "views/examples/Fabric-Custom-Network/CreateRequest.js";

var routes = [
  // {
  //   path: "/index",
  //   name: "Dashboard",
  //   icon: "ni ni-tv-2 text-primary",
  //   component: Index,
  //   layout: "/admin",
  // },

  {
    path: "/Devices",
    name: "IOT Devices",
    icon: "ni ni-single-02 text-yellow",
    component: Device,
    layout: "/admin",
  },
  // {
  //   path: "/Cattle",
  //   name: "cattle",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Cattle,
  //   layout: "/admin",
  // },
  // {
  //   path: "/Slaughter",
  //   name: "Slaughter House",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: SlaughterHouse,
  //   layout: "/admin",
  // },
  {
    path: "/create-request",
    name: "Create Request",
    icon: "ni ni-single-02 text-yellow",
    component: CreateRequest,
    layout: "/admin",
  },
  {
    path: "/Organization",
    name: "Organization",
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
    path: "/contract-history",
    name: "Asset History",
    icon: "ni ni-single-02 text-yellow",
    component: ContractHistory,
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
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
];
export default routes;
