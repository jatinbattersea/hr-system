import React from 'react';
import { NavLink } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <main id="main" className="main">
      <section className="section dashboard">
        <div className="text-center pt-5 pb-5">
          <h1><strong>404</strong></h1>
          <h4 className="mb-5">Oops! Page Not Found.</h4>
          <NavLink to="/" className="btn btn-primary">Go To Dashboard</NavLink>
        </div>
      </section>
    </main>
  )
}

export default PageNotFound;