import React, { useState, useRef, useContext } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from './../context/AuthContext';
import ProfileImage from "./../Public/images/dummy-image.jpg";
import Cookies from "js-cookie";
import secureLocalStorage from "react-secure-storage";


const Profile = () => {

  const token = Cookies.get("_goJwt");

  const { user, dispatch } = useContext(AuthContext);

  const initialPasswordValues = {
    id: user._doc._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const initialProfileValues = {
    profileImage: user._doc.profileImage,
    name: user._doc.name,
    doj: user._doc.doj,
    employeeID: user._doc.employeeID,
    phone: user._doc.phone,
    email: user._doc.email,
    dob: user._doc.dob,
    address: user._doc.address,
    bankName: user._doc.bankName,
    accNo: user._doc.accNo,
    ifsc: user._doc.ifsc,
  };

  const file = useRef(null);
  const [passwordValues, setPasswordValues] = useState(initialPasswordValues);
  const [profileValues, setProfileValues] = useState(initialProfileValues);

  const [fileURL, setFileURL] = useState('');

  const [error, setError] = useState({
    oldPasswordError: "",
    confirmPasswordError: "",
  });

  const handleInputPassowrdChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues({
      ...passwordValues,
      [name]: value,
    });
  };
  
  const handleInputProfileDetails = (e) => {
    const { name, value } = e.target;
    setProfileValues({
      ...profileValues,
      [name]: value,
    });
  };

  const clearImage = () => {
    setFileURL("");
    file.current.value = null;
  };

  const handleRemovePhoto = async () => {
    try {
      await axios
        .delete(`/api/user/profile/${user._doc._id}`, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setProfileValues({
              ...profileValues,
              profileImage: "",
            });
            setFileURL("");
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                authorizedPages: user.authorizedPages,
                _doc: {
                  ...user._doc,
                  profileImage: "",
                },
              },
            });
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

  const handleChangePassword = (event) => {
    event.preventDefault();
    if (passwordValues.oldPassword !== user._doc.password) {
      setError({
        ...error,
        oldPasswordError: "**Incorrect Current Password.",
      });
      return;
    }
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setError({
        ...error,
        confirmPasswordError: "**Incorrect Confirm Password.",
      });
      return;
    }
    try {
      axios
        .put("api/user/accounts/settings/forget-password", passwordValues, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: response.data,
            });

            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                authorizedPages: user.authorizedPages,
                _doc: {
                  ...user._doc,
                  password: passwordValues.confirmPassword,
                },
              },
            });

            setPasswordValues(initialPasswordValues);
            setError({
              oldPasswordError: "",
              confirmPasswordError: "",
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeProfileDetails = async (event) => {
    event.preventDefault();

    const userData = {
      profileImage: profileValues.profileImage.trim(),
      name: profileValues.name.trim(),
      doj: profileValues.doj,
      employeeID: profileValues.employeeID.trim(),
      phone: profileValues.phone.trim(),
      email: profileValues.email.trim(),
      dob: profileValues.dob,
      address: profileValues.address.trim(),
      bankName: profileValues.bankName.trim(),
      accNo: profileValues.accNo.trim(),
      ifsc: profileValues.ifsc.trim(),
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
        .put(`/api/user/${user._doc._id}`, userData, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              title: response.data,
              icon: "success",
            });
            setProfileValues(initialProfileValues);
            setFileURL("");
            file.current.value = null;
          }
        });

    } catch (error) {
      console.log(error);
    }
    // ?? CONTINUE
    try {
      const { data } = await axios.get(`api/user/${profileValues.employeeID}`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
      const { authorizedPages } = secureLocalStorage.getItem("user");
      setProfileValues({
        profileImage: data.profileImage,
        name: data.name,
        doj: data.doj,
        employeeID: data.employeeID,
        phone: data.phone,
        email: data.email,
        dob: data.dob,
        address: data.address,
        bankName: data.bankName,
        accNo: data.accNo,
        ifsc: data.ifsc,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { authorizedPages, _doc: data },
      });
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <main id="main" className="main">
      <section className="profile">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body  pt-4 d-flex flex-column align-items-center">
                <img
                  src={
                    user._doc.profileImage !== ""
                      ? process.env.REACT_APP_PUBLIC_PATH +
                        user._doc.profileImage
                      : ProfileImage
                  }
                  alt="Profile"
                  className="img-fluid rounded-circle border border-light"
                />
                <h5 className="pt-3 fw-semibold">{user._doc.name}</h5>
                <p className="text-black-50 mb-1">
                  {user._doc.designation?.name}
                </p>
                <p className="text-black-50">{user._doc.team?.name}</p>
              </div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="card">
              <div className="card-body pt-3">
                <ul className="nav nav-tabs nav-tabs-bordered">
                  <li className="nav-item">
                    <button
                      className="nav-link active"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-overview"
                    >
                      Overview
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-edit"
                    >
                      Edit Profile
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-change-password"
                    >
                      Change Password
                    </button>
                  </li>
                </ul>
                <div className="tab-content pt-2">
                  <div
                    className="tab-pane fade show active profile-overview"
                    id="profile-overview"
                  >
                    <h5 className="mt-3 mb-4 fs-5  fw-normal">
                      Profile Details
                    </h5>
                    <p>
                      <b>Employee ID : </b>&ensp;
                      <span className="bg-blue px-2 py-1">
                        {user._doc.employeeID}
                      </span>
                    </p>
                    <p>
                      <b>Date of Joining : </b>&ensp; {user._doc.doj}
                    </p>
                    <p>
                      <b>Phone : </b>&ensp; {user._doc.phone}
                    </p>
                    <p>
                      <b>Email : </b>&ensp; {user._doc.email}
                    </p>
                    <p>
                      <b>Birthday : </b>&ensp; {user._doc.dob}
                    </p>
                    <p>
                      <b>Address : </b>&ensp; {user._doc.address}
                    </p>
                  </div>

                  <div
                    className="tab-pane fade profile-edit pt-3"
                    id="profile-edit"
                  >
                    <form onSubmit={handleChangeProfileDetails}>
                      <div className="row mb-3">
                        <label
                          htmlFor="profileImage"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          Profile Image
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <img
                            id="frame"
                            src={
                              profileValues.profileImage !== ""
                                ? process.env.REACT_APP_PUBLIC_PATH +
                                  profileValues.profileImage
                                : fileURL && URL.createObjectURL(fileURL)
                            }
                            className="img-fluid"
                            alt="Profile"
                          />
                          <div>
                            <label className="mb-3">Upload Photo</label>
                            <input
                              type="file"
                              name="profileImage"
                              id="formFile"
                              title="Upload new profile image"
                              className="form-control"
                              ref={file}
                              onChange={(event) => {
                                setFileURL(event.target.files[0]);
                                setProfileValues({
                                  ...profileValues,
                                  profileImage: "",
                                });
                              }}
                            />
                            <a
                              href="#"
                              className="btn btn-secondary mt-3"
                              onClick={clearImage}
                              title="Removes Selected Picture from the Input"
                            >
                              Unselect Photo
                            </a>

                            <a
                              href='#'
                              className={`btn btn-primary mt-3 ms-3 ${
                                profileValues.profileImage === "" ? "disabled" : ""
                              }`}
                              onClick={handleRemovePhoto}
                              title="Deletes Profile Picture from the account"
                            >
                              Delete Photo
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="fullName"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          Full Name
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="name"
                            type="text"
                            className="form-control"
                            id="fullName"
                            value={profileValues.name}
                            onChange={handleInputProfileDetails}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="Job"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          Date of Joining
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="doj"
                            type="date"
                            className="form-control"
                            value={profileValues.doj}
                            onChange={handleInputProfileDetails}
                            required=""
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="employeeID"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          Employee Id
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="employeeID"
                            type="text"
                            className="form-control"
                            id="employeeID"
                            value={profileValues.employeeID}
                            onChange={handleInputProfileDetails}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="Phone"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          Phone
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="phone"
                            type="text"
                            className="form-control"
                            id="Phone"
                            value={profileValues.phone}
                            onChange={handleInputProfileDetails}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="Email"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          Email
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="email"
                            type="email"
                            className="form-control"
                            id="Email"
                            value={profileValues.email}
                            onChange={handleInputProfileDetails}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label className="col-md-4 col-lg-3 col-form-label">
                          Birthday
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="dob"
                            type="date"
                            className="form-control"
                            value={profileValues.dob}
                            onChange={handleInputProfileDetails}
                            required=""
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label
                          htmlFor="Address"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          Address
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="address"
                            type="text"
                            className="form-control"
                            id="Address"
                            value={profileValues.address}
                            onChange={handleInputProfileDetails}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="Address"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          Bank Name
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="bankName"
                            type="text"
                            className="form-control"
                            id="bankName"
                            value={profileValues.bankName}
                            onChange={handleInputProfileDetails}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="Address"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          Bank Account No
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="accNo"
                            type="text"
                            className="form-control"
                            id="accNo"
                            value={profileValues.accNo}
                            onChange={handleInputProfileDetails}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="Address"
                          className="col-md-4 col-lg-3 col-form-label"
                        >
                          IFSC Code
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <input
                            name="ifsc"
                            type="text"
                            className="form-control"
                            id="ifsc"
                            value={profileValues.ifsc}
                            onChange={handleInputProfileDetails}
                          />
                        </div>
                      </div>

                      <div className="my-4">
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="tab-pane fade" id="profile-change-password">
                    <h5 className="mt-3 mb-4 fs-5 fw-normal">
                      Change Password
                    </h5>
                    <form action="" onSubmit={handleChangePassword}>
                      <div className="row mb-3">
                        <div className="col-lg-12">
                          <input
                            name="oldPassword"
                            type="password"
                            placeholder="Current Password"
                            className="form-control"
                            id="oldPassword"
                            value={passwordValues.oldPassword}
                            onChange={handleInputPassowrdChange}
                            required
                          />
                        </div>
                        {error.oldPasswordError !== "" && (
                          <span className="text-danger">
                            {error.oldPasswordError}
                          </span>
                        )}
                      </div>

                      <div className="row mb-3">
                        <div className="col-lg-12">
                          <input
                            name="newPassword"
                            type="password"
                            placeholder="New Password"
                            className="form-control"
                            id="newPassword"
                            value={passwordValues.newPassword}
                            onChange={handleInputPassowrdChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-lg-12">
                          <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter New Password"
                            className="form-control"
                            id="confirmPassword"
                            value={passwordValues.confirmPassword}
                            onChange={handleInputPassowrdChange}
                            required
                          />
                        </div>
                        {error.confirmPasswordError !== "" && (
                          <span className="text-danger">
                            {error.confirmPasswordError}
                          </span>
                        )}
                      </div>

                      <div className="text-center">
                        <button type="submit" className="btn btn-primary my-2">
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;