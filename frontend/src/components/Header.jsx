import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
    return (
        <div>
            <nav
                className="header is-fixed-top is-medium has-background-light"
                role="navigation"
                aria-label="main navigation"
                style={{
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    position: "fixed",
                    width: "100%",
                    top: 0,
                    zIndex: 1000
                }}
            >
                <div className="header-brand">
                    <NavLink to="/dashboard" className="header-item">
                        <div className="logo" style={{ display: "flex", alignItems: "center" }}>
                            <img className="sm-logo" src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" />
                            <img className="sidebarlogo lg-logo" src={`${process.env.PUBLIC_URL}/ettppln_blue.svg`} alt="LogoETPP" />
                        </div>
                    </NavLink>

                    <a
                        href="!#"
                        role="button"
                        className="header-burger burger"
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="headerBasicExample"
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
            </nav>
        </div>
    );
};

export default Header;
