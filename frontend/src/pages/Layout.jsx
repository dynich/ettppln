import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Layout = ({ children, navigate, location, menuItems, logout }) => {
  return (
    <React.Fragment>
      <Header style={{ position: 'fixed', width: '100%', zIndex: 100 }} />
      <div style={{ display: "flex", paddingTop: "60px", minHeight: "100vh" }}> {/* Adjusted for header height */}
        <div style={{ position: 'fixed', paddingTop:"20px",minWidth: "255px" }}>
          <Sidebar navigate={navigate} location={location} menuItems={menuItems} logout={logout} />
        </div>
        <main style={{ flex: 1, padding: "20px", overflowY: "auto", overflowX:"auto", marginLeft: "255px", minHeight: "80vh" }}>
          {children}
        </main>
      </div>
    </React.Fragment>
  );
};

export default Layout;
