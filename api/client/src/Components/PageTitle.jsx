import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const PageTitle = () => {

  const paths = {
        "": "Dashboard",
        "employees": "All Employees",
        "employee": "Single Employee",
        "add-member": "Add Employee",
        "add-shift": "Add Shift",
        "attendence": "Attendance",
        "leaves": "Leaves",
        "holidays": "Holidays",
        "teams": "Teams",
        "designations": "Designations",
        "performance": "Performance",
        "settings": "Settings",
  }

  const [pathName, setPathName] = useState();
  
  useEffect(() => {
    setPathName(window.location.pathname.split('/')[1]);
  }, [])
  

    return (
      <div className="pagetitle">
        <h1>{paths[pathName]}</h1>
          <nav>
              <ol className="breadcrumb">
            <li className="breadcrumb-item"><NavLink to="/">Home</NavLink></li>
            <li className="breadcrumb-item active">{paths[pathName]}</li>
              </ol>
          </nav>
      </div>
  )
}

export default PageTitle;