import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Import Authorization Context
import { AuthContext } from "./../context/AuthContext";
import secureLocalStorage from "react-secure-storage";
const initialValues = {
  id: '',
  password: '',
};

const Login = () => {

  const navigate = useNavigate();

  // Calling AuthContext
  const { dispatch } = useContext(AuthContext);

  const [values, setValues] = useState(initialValues);

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  // Handle Log In function

  const loginCall = async (userCredential, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {

      const res = await axios.post("/api/auth/accounts/login", userCredential);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          _doc: res.data._doc,
          authorizedPages: res.data.authorizedPages,
        },
      });

      secureLocalStorage.setItem(
        "user",
        {
          _doc: res.data._doc,
          authorizedPages: res.data.authorizedPages,
        }
      );
      navigate('/');

    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
      setError(error.response.data);
    }
  }


  const handleLogin = async (e) => {

    e.preventDefault();

    loginCall(
      values,
      dispatch
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6 d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex justify-content-center py-4">
            <div className="logo d-flex align-items-center w-auto">
              <img src="/assets/img/logo.png" alt="" />
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <div className="pt-4 pb-2">
                <h5 className="card-title text-center pb-0 fs-4">
                  Login to Your Account
                </h5>
                <p className="text-center small">
                  Enter your username & password to login
                </p>
              </div>

              <form className="row g-3" onSubmit={handleLogin}>
                {error !== "" && (
                  <div className="alert alert-danger text-center">{error}</div>
                )}

                <div className="col-12">
                  <label htmlFor="id" className="form-label">
                    Your ID
                  </label>
                  <input
                    type="text"
                    name="id"
                    className="form-control"
                    id="id"
                    value={values.id}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="yourPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="yourPassword"
                    value={values.password}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter your password!
                  </div>
                </div>

                <div className="col-12">
                  <button className="btn btn-primary w-100" type="submit">
                    {false ? (
                      <div
                        class="spinner-border text-white"
                        role="status"
                      ></div>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;