import Profile from "./views/examples/Profile.js";
import Login from "./views/examples/Login.js";
import Admin from "./views/examples/admin.js";
import Organization from "views/examples/Fabric-Custom-Network/Organization.js";
import CreateRequest from "views/examples/Fabric-Custom-Network/CreateRequest.js";
import ContactUs from "views/examples/Fabric-Custom-Network/ContactUs.js";
import PrivacyPolicy from "views/examples/Fabric-Custom-Network/PrivacyPolicy.js";
import TermsAndCondition from "views/examples/Fabric-Custom-Network/termsAndConditions.js";
import RefundPolicy from "views/examples/Fabric-Custom-Network/RefundPolicy.js";

// Separate routes into different categories
const adminRoutes = [
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
];

const authRoutes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
];

const footerRoutes = [
  {
    path: "/contact-us",
    name: "Contact Us",
    component: ContactUs,
    layout: "/footer",
  },
  {
    path: "/privacy-policy",
    name: "Privacy Policy",
    component: PrivacyPolicy,
    layout: "/footer",
  },
  {
    path: "/terms-and-conditions",
    name: "Terms & Conditions",
    component: TermsAndCondition,
    layout: "/footer",
  },
  {
    path: "/refund-policy",
    name: "Refund Policy",
    component: RefundPolicy,
    layout: "/footer",
  },
];

export { adminRoutes, authRoutes, footerRoutes };
export default [...adminRoutes, ...authRoutes, ...footerRoutes];