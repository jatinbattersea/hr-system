import React from "react";
import { NavLink } from 'react-router-dom';
import ProfileImage from '../Public/images/dummy-image.jpg';

const TeamLeader = (props) => {

  const getUser = () => {
    props.getUser((props.details.employeeID));
  }

  const deleteUser = (event) => {
    event.preventDefault();
    props.deleteUser((props.details._id));
  }

  return (
    <div className="col-lg-4">
      <div className="card all-em-card">
        <div className="all-e-img">
          <NavLink to={`/employee/details/${props.details.employeeID}`}>
            <img
              src={
                props.details.profileImage != ""
                  ? process.env.REACT_APP_PUBLIC_PATH +
                    props.details.profileImage
                  : ProfileImage
              }
              alt="Profile"
            />
          </NavLink>
          <h5 className="card-title">
            <NavLink to={`/employee/details/${props.details.employeeID}`}>
              {props.details.name}
            </NavLink>
          </h5>
          <p className="mb-0">
            {props.details.designation?.name} {props.details.team?.name}
          </p>
        </div>
        <div className="filter">
          <a
            className="icon"
            href="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-three-dots"></i>
          </a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li>
              <a
                className="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#editEmployeeModal"
                onClick={getUser}
              >
                <i className="bi bi-pencil-square"></i>Edit
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#" onClick={deleteUser}>
                <i className="bi bi-trash3"></i>Delete
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamLeader;
