import React from "react";
import { Link, NavLink } from "react-router-dom";

import { Row, Col, Nav, NavItem } from "reactstrap";

const AuthFooter = () => {
  const navigationLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Refund Policy", path: "/refund-policy" },
    { name: "Terms", path: "/terms-and-conditions" },
    { name: "Contact Us", path: "/contact-us" },
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
            {/* <div className="copyright text-center text-xl-left text-muted">
              © {currentYear}{" "}
              <a
                className="font-weight-bold ml-1"
                href="https://www.linkedin.com/in/pavan-adhav/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Adhav Pavan
              </a>
            </div> */}
          </div>
          <div className="col-xl-8">
            <nav className="nav nav-footer justify-content-center justify-content-xl-end">
              {navigationLinks.map((link) => (
                <NavItem>
                <NavLink
                  to={link.path}
                  className="nav-link"
                >
                  {link.name}
                  </NavLink>
                </NavItem>
              ))}

              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="nav-link"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;