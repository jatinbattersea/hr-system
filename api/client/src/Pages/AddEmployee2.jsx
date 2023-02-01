import React, { useState, useEffect, useRef } from 'react';
import PageTitle from '../Components/PageTitle';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";

const initialValues = {
    profileImage: '',
    name: '',
    designationName: '',
    teamName: '',
    doj: '',
    employeeID: '',
    password: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    bankName: '',
    accNo: '',
    ifsc: '',
    shiftName: '',
};
  

const AddEmployee = (props) => {
  const token = Cookies.get("_goJwt");

  const [values, setValues] = useState(initialValues);

  const [shifts, setShifts] = useState([]);

  const [teams, setTeams] = useState([]);

  const [designations, setDesignations] = useState([]);

  const [fileURL, setFileURL] = useState("");
  const file = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const clearImage = () => {
    setFileURL("");
    file.current.value = null;
  };

  const generatePassword = (event) => {
    event.preventDefault();
    var chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 6;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    setValues({
      ...values,
      password: password,
    });
  };

  useEffect(() => {
    const getShifts = async () => {
      try {
        const { data } = await axios.get("/api/shift", {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
        setShifts(data);
      } catch (error) {
        console.log(error);
      }
    };
    getShifts();
  }, [token]);

  useEffect(() => {
    const getDesignations = async () => {
      try {
        const { data } = await axios.get("/api/designation", {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
        setDesignations(data);
      } catch (error) {
        console.log(error);
      }
    };
    getDesignations();
  }, [token]);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const { data } = await axios.get("/api/team", {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
        setTeams(data);
      } catch (error) {
        console.log(error);
      }
    };
    getTeams();
  }, [token]);

  const handleAddEmployee = async (event) => {
    event.preventDefault();
    const userData = {
      profileImage: values.profileImage,
      name: values.name.trim(),
      designationName: values.designationName,
      teamName: values.teamName,
      doj: values.doj,
      employeeID: values.employeeID.trim(),
      password: values.password.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      dob: values.dob,
      address: values.address.trim(),
      bankName: values.bankName.trim(),
      accNo: values.accNo.trim(),
      ifsc: values.ifsc.trim(),
      shiftName: values.shiftName,
    };
    if (file.current.value !== "") {
      const data = new FormData();
      const fileName = Date.now() + file.current.files[0]?.name;
      userData.profileImage = fileName;
      data.append("name", fileName);
      data.append("file", file.current.files[0]);
      try {
        await axios.post("/api/user/upload", data, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios
        .post("/api/user/addMember", userData, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            Swal.fire({
              icon: "success",
              title: response.data,
            });
            props.getUsers();
            setValues(initialValues);
            setFileURL("");
            file.current.value = null;
          }
        });
    } catch (error) {
      if (error.response.status) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data,
        });
      }
    }
  };

  return (
    <>
      <div className="col-lg-3 col-md-6">
        <button
          data-bs-toggle="modal"
          data-bs-target="#addEmployeeModal"
          className="card info-card pb-0 w-100"
        >
          <div className="card-body pb-0">
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                <i className="bi bi-plus-circle"></i>
              </div>
              <h5 className="card-title pt-2">Add Employee</h5>
            </div>
          </div>
        </button>
      </div>

      {/* Add Employee Modal */}
      {values && (
        <div className="modal fade" id="addEmployeeModal">
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Details</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-start">
                <form
                  className="row g-3 validation"
                  encType="multipart/form-data"
                  novalidate
                >
                  <div className="container mt-2">
                    <div className="">
                      <div className="card-body mt-4">
                        <ul
                          className="nav nav-tabs d-flex"
                          id="myTabjustified"
                          role="tablist"
                        >
                          <li
                            className="nav-item flex-fill"
                            role="presentation"
                          >
                            <button
                              className="nav-link w-100 active"
                              id="home-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#home-justified"
                              type="button"
                              role="tab"
                              aria-controls="home"
                              aria-selected="true"
                            >
                              Add Profile Photo
                            </button>
                          </li>
                          <li
                            className="nav-item flex-fill"
                            role="presentation"
                          >
                            <button
                              className="nav-link w-100"
                              id="profile-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#profile-justified"
                              type="button"
                              role="tab"
                              aria-controls="profile"
                              aria-selected="false"
                              tabIndex="-1"
                            >
                              Add Personal Details
                            </button>
                          </li>
                          <li
                            className="nav-item flex-fill"
                            role="presentation"
                          >
                            <button
                              className="nav-link w-100"
                              id="contact-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#contact-justified"
                              type="button"
                              role="tab"
                              aria-controls="contact"
                              aria-selected="false"
                              tabIndex="-1"
                            >
                              Add Bank Info
                            </button>
                          </li>

                          <li
                            className="nav-item flex-fill"
                            role="presentation"
                          >
                            <button
                              className="nav-link w-100"
                              id="shift-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#shift-justified"
                              type="button"
                              role="tab"
                              aria-controls="shift-tab"
                              aria-selected="false"
                              tabIndex="-1"
                            >
                              {" "}
                              Add Shift
                            </button>
                          </li>

                          <li
                            className="nav-item flex-fill"
                            role="presentation"
                          >
                            <button
                              className="nav-link w-100"
                              id="password-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#password-justified"
                              type="button"
                              role="tab"
                              aria-controls="password-tab"
                              aria-selected="false"
                              tabIndex="-1"
                            >
                              {" "}
                              Add Password
                            </button>
                          </li>
                        </ul>
                        <div
                          className="tab-content pt-2"
                          id="myTabjustifiedContent"
                        >
                          <div
                            className="tab-pane fade show active"
                            id="home-justified"
                            role="tabpanel"
                            aria-labelledby="home-tab"
                          >
                            <div className="col-lg-4">
                              <label className="mb-3">Upload Photo</label>
                              <img
                                id="frame"
                                src={
                                  values.profileImage !== ""
                                    ? process.env.REACT_APP_PUBLIC_PATH +
                                      values.profileImage
                                    : fileURL && URL.createObjectURL(fileURL)
                                }
                                className="img-fluid mb-2"
                                alt="user profile"
                              />
                              <input
                                className="form-control"
                                type="file"
                                name="profileImage"
                                id="formFile"
                                ref={file}
                                onChange={(event) => {
                                  setFileURL(event.target.files[0]);
                                  setValues({
                                    ...values,
                                    profileImage: "",
                                  });
                                }}
                              />
                              <a
                                href="#"
                                className="btn btn-danger mt-3"
                                onClick={clearImage}
                              >
                                Unselect Photo
                              </a>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="profile-justified"
                            role="tabpanel"
                            aria-labelledby="profile-tab"
                          >
                            <div className="row">
                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">*Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Name"
                                  name="name"
                                  value={values.name}
                                  onChange={handleInputChange}
                                />
                                <div class="invalid-feedback">
                                  Please Enter Your Name.
                                </div>
                              </div>
                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">*Designation</label>
                                <select
                                  className="form-select"
                                  name="designationName"
                                  value={values.designationName}
                                  onChange={handleInputChange}
                                >
                                  <option>--- Select Position ---</option>
                                  {designations.length > 0 ? (
                                    designations.map((designation) => (
                                      <option
                                        key={designation._id}
                                        value={designation.name}
                                      >
                                        {designation.name}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="No Designation Available">
                                      No Designation Available
                                    </option>
                                  )}
                                </select>
                                <div class="invalid-feedback">
                                  Please Select Designation.
                                </div>
                              </div>
                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">*Team</label>
                                <select
                                  className="form-select"
                                  name="teamName"
                                  value={values.teamName}
                                  onChange={handleInputChange}
                                >
                                  <option defaultValue="">
                                    --- Select Team ---
                                  </option>
                                  {teams.length > 0 ? (
                                    teams.map((team) => (
                                      <option key={team._id} value={team.name}>
                                        {team.name}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="No Team Available">
                                      No Team Available
                                    </option>
                                  )}
                                </select>
                                <div class="invalid-feedback">
                                  Please Select Team.
                                </div>
                              </div>

                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">*Date of Joining</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="doj"
                                  value={values.doj}
                                  onChange={handleInputChange}
                                />
                                <div class="invalid-feedback">
                                  Enter Date of Joining.
                                </div>
                              </div>

                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">*Employee ID</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Empoyee ID"
                                  name="employeeID"
                                  value={values.employeeID}
                                  onChange={handleInputChange}
                                />
                                <div class="invalid-feedback">
                                  Enter Employee ID.
                                </div>
                              </div>

                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">*Phone</label>
                                <input
                                  type="tel"
                                  className="form-control"
                                  placeholder="Enter Phone Number"
                                  name="phone"
                                  value={values.phone}
                                  onChange={handleInputChange}
                                />
                                <div class="invalid-feedback">
                                  Enter Phone Number.
                                </div>
                              </div>
                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">*Email</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="Enter Email"
                                  name="email"
                                  value={values.email}
                                  onChange={handleInputChange}
                                />
                                <div class="invalid-feedback">
                                  Enter Email Id.
                                </div>
                              </div>
                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">*Birthday</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="dob"
                                  value={values.dob}
                                  onChange={handleInputChange}
                                />
                                <div class="invalid-feedback">
                                  Enter Birth Date.
                                </div>
                              </div>

                              <div className="col-lg-12 mt-4">
                                <label className="mb-3">*Address</label>
                                <textarea
                                  className="form-control"
                                  placeholder="Enter Address"
                                  id=""
                                  cols="30"
                                  rows="3"
                                  name="address"
                                  value={values.address}
                                  onChange={handleInputChange}
                                ></textarea>
                                <div class="invalid-feedback">
                                  Enter Address.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="contact-justified"
                            role="tabpanel"
                            aria-labelledby="contact-tab"
                          >
                            <div className="form-group row">
                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">Bank Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Bank Name"
                                  name="bankName"
                                  value={values.bankName}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">Bank Account No.</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Account Number"
                                  name="accNo"
                                  value={values.accNo}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="col-lg-4 mt-4">
                                <label className="mb-3">IFSC Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter IFSC Code"
                                  name="ifsc"
                                  value={values.ifsc}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>

                          <div
                            className="tab-pane fade"
                            id="shift-justified"
                            role="tabpanel"
                            aria-labelledby="shift-tab"
                          >
                            <div className="col-lg-4 mt-4">
                              <label className="mb-3">*Choose Shift</label>
                              <select
                                className="form-select"
                                name="shiftName"
                                value={values.shiftName}
                                onChange={handleInputChange}
                                required
                              >
                                <option>--- Select Shift ---</option>
                                {shifts.length > 0 ? (
                                  shifts.map((shift) => (
                                    <option key={shift._id} value={shift.name}>
                                      {shift.name}
                                    </option>
                                  ))
                                ) : (
                                  <option value="No Shift Available">
                                    No Shift Available
                                  </option>
                                )}
                              </select>
                              <div class="invalid-feedback">
                                Please Select Shift.
                              </div>
                            </div>
                          </div>

                          <div
                            className="tab-pane fade"
                            id="password-justified"
                            role="tabpanel"
                            aria-labelledby="password-tab"
                          >
                            <div className="form-group row">
                              <div className="col-lg-4 mt-4">
                                <label htmlFor="" className="mb-3">
                                  *Password
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Password"
                                  name="password"
                                  value={values.password}
                                  onChange={handleInputChange}
                                  required
                                />
                                <div class="invalid-feedback">
                                  Enter Password.
                                </div>
                              </div>

                              <div className="col-lg-4 mt-4">
                                <div className="h-100 d-flex align-items-end">
                                  <button
                                    className="btn btn-primary"
                                    onClick={generatePassword}
                                  >
                                    <i className="bi bi-magic"></i>&nbsp;
                                    Generate Password
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleAddEmployee}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmployee;