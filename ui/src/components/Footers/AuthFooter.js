import React from "react";
import { Link } from "react-router-dom";

const AuthFooter = () => {
  const navigationLinks = [
    { name: "Privacy Policy", path: "/auth/privacy-policy" },
    { name: "Refund Policy", path: "/auth/refund-policy" },
    { name: "Terms", path: "/auth/terms-and-conditions" },
    { name: "Contact Us", path: "/auth/contact-us" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/pavanadhavofficial/",
      external: true,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/pavan-adhav/",
      external: true,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-5">
      <div className="container">
        <div className="row align-items-center justify-content-xl-between">
          <div className="col-xl-6">
            <div className="copyright text-center text-xl-left text-muted">
              © {currentYear}{" "}
              <a
                className="font-weight-bold ml-1"
                href="https://www.linkedin.com/in/pavan-adhav/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Adhav Pavan
              </a>
            </div>
          </div>
          <div className="col-xl-6">
            <nav className="nav nav-footer justify-content-center justify-content-xl-end">
              {/* Internal Navigation Links */}
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-muted px-3 py-2 hover:text-gray-900"
                >
                  {link.name}
                </Link>
              ))}

              {/* External Social Links */}
              {/* {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="text-muted px-3 py-2 hover:text-gray-900"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.name}
                </a>
              ))} */}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;