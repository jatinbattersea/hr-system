import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import Sidebar from '../Components/Sidebar';
import TopNavbar from '../Components/TopNavbar';
import Footer from "../Components/Footer";
import Cookies from 'js-cookie';
const AppLayout = (props) => {

  const [sideBar, setSideBar] = useState(true);

  if (!Cookies.get('_goJwt')) {
    return <Navigate to="/accounts/login" replace />
  }

  return (
    <>
      <div className={sideBar ? "" : "toggle-sidebar"}>
        <Sidebar />
        <TopNavbar sideBar={sideBar} setSideBar={setSideBar} />
        {props.children}
        <Footer />
      </div>
    </>
  )
}

export default AppLayout;