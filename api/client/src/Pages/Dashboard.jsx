import React from 'react';
import PageTitle from '../Components/PageTitle';

const Dashboard = () => {
  
  return (
    <>
      <main id="main" className="main">
        <PageTitle />
        <section className="section dashboard">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="card info-card">
                <div className="card-body pb-0">
                  <h5 className="card-title">Company Founded</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-gear"></i>
                    </div>
                    <div className="ps-3">
                      <h6>2012</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card info-card">
                <div className="card-body pb-0">
                  <h5 className="card-title">Total Employees</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="ps-3">
                      <h6>55+</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card info-card">
                <div className="card-body pb-0">
                  <h5 className="card-title">Total Team</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="ps-3">
                      <h6>3</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Dashboard;