import React, { useEffect, useState } from 'react';
import PageTitle from '../Components/PageTitle';
import axios from 'axios';
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { default as ReactSelect, components } from "react-select";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
}

const Settings = () => {

  const token = Cookies.get("_goJwt");

  const [roles, setRoles] = useState([]);
  const [optionSelected, setOptionSelected] = useState({
    dashboard: null,
    employees: null,
    employee: null,
    teams: null,
    designations: null,
    shifts: null,
    attendence: null,
    leaves: null,
    holidays: null,
    profile: null,
    settings: null,
  });

  const handleChange = (selected, name) => {
    setOptionSelected({
      ...optionSelected,
      [name]: selected,
    });
  };

  useEffect(() => {
    const getRoles = async () => {
      try {
        const { data } = await axios.get("/api/designation", {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
        let roles = {};
        let arr = [];
        data.map((row) => {
          const set = { value: row._id, label: row.name };
          arr.push(set);
          row.authorities.map((authority) => {
            let name = authority.split("/")[1];
            if (name === "") {
              name = "dashboard";
            }
            if (!(name in roles)) {
              roles[name] = [set];
            } else {
              roles[name].push(set);
            }
          });
        });
        setRoles(arr);
        setOptionSelected(roles);
      } catch (error) {
        console.log(error);
      }
    }
    getRoles();
  },[])

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post('/api/designation/updating/authorities', optionSelected, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
       if (response.status === 200) {
         Swal.fire({
           icon: "success",
           title: response.data,
         });
       }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <main id="main" className="main">
      <PageTitle />
      {/* End Page Title */}
      <div className="row setting">
        <div className="col-lg-8">
          <h5 className="mb-4">Roles & Authority</h5>
          <div>
            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">Dashboard</h6>
              </div>

              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "dashboard")}
                    allowSelectAll={true}
                    value={optionSelected.dashboard}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">Employees</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "employees")}
                    allowSelectAll={true}
                    value={optionSelected.employees}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">View Employees</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "employee")}
                    allowSelectAll={true}
                    value={optionSelected.employees}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">Teams</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "teams")}
                    allowSelectAll={true}
                    value={optionSelected.teams}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">Designations</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "designations")}
                    allowSelectAll={true}
                    value={optionSelected.designations}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">Shifts</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "shifts")}
                    allowSelectAll={true}
                    value={optionSelected.shifts}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">Attendence</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "attendence")}
                    allowSelectAll={true}
                    value={optionSelected.attendence}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">Leaves</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "leaves")}
                    allowSelectAll={true}
                    value={optionSelected.leaves}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md 3">
                <h6 className="me-3">Holidays</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "holidays")}
                    allowSelectAll={true}
                    value={optionSelected.holidays}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">Profile</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "profile")}
                    allowSelectAll={true}
                    value={optionSelected.profile}
                  />
                </span>
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-md-3">
                <h6 className="me-3">Settings</h6>
              </div>
              <div className="col-md-9">
                <span
                  style={{
                    minWidth: "70%",
                  }}
                >
                  <ReactSelect
                    options={roles}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={(e) => handleChange(e, "settings")}
                    allowSelectAll={true}
                    value={optionSelected.settings}
                  />
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Settings;