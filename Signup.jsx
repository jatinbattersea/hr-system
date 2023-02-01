import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex justify-content-center py-4">
            <div className="logo d-flex align-items-center w-auto">
              <img src="/assets/img/logo.png" alt="" />
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <div className="pt-4 pb-2">
                <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                <p className="text-center small">Enter your personal details to create account</p>
              </div>

              <form className="row g-3">
                <div className="col-12">
                  <label htmlFor="yourName" className="form-label">Your Name</label>
                  <input type="text" name="name" className="form-control" id="yourName" required />
                </div>

                <div className="col-12">
                  <label htmlFor="yourEmail" className="form-label">Your Email</label>
                  <input type="email" name="email" className="form-control" id="yourEmail" required />
                </div>

                <div className="col-12">
                  <label htmlFor="yourPassword" className="form-label">Password</label>
                  <input type="password" name="password" className="form-control" id="yourPassword" required />
                </div>

                <div className="col-12">
                  <label htmlFor="yourPassword" className="form-label">Confirm Password</label>
                  <input type="password" name="password" className="form-control" id="yourPassword" required />
                </div>


                <div className="col-12">
                  <button className="btn btn-primary w-100" type="submit">
                    {
                      (false) ?
                        (
                          <div class="spinner-border text-white" role="status"></div>
                        )
                        :
                        (
                          "Create Account"
                        )
                    }
                  </button>
                </div>
                <div className="col-12">
                  <p className="small mb-0">
                    Already have an account?
                    <NavLink to="/accounts/login">Log in</NavLink>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup;