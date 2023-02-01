import React, { useEffect, useState, useContext } from "react";
import PageTitle from "./../Components/PageTitle";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { AuthContext } from "./../context/AuthContext";

const initialValues = {
  name: "",
  date: "",
  description: "",
};

const initialEditValues = {
  id: "",
  editName: "",
  editDate: "",
  editDescription: "",
};


const Holiday = () => {

  const token = Cookies.get("_goJwt");
  
  const [values, setValues] = useState(initialValues);

  const [holidays, setHolidays] = useState([]);

  const [selectedHoliday, setSelectedHoliday] = useState();

  const [editValues, setEditValues] = useState(initialEditValues);

  const { user } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleInputEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: value,
    });
  };

  const getHolidays = async () => {
    try {
      const { data } = await axios.get("/api/holiday", {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
      setHolidays(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleHoliday = async () => {
    try {
      await axios
        .post("/api/holiday/addHoliday", values, {
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
            setValues(initialValues);
            getHolidays();
          }
        });
    } catch (error) {
       if (error.response.status) {
         Swal.fire({
           icon: "error",
           title: "Ooops...",
           text: error.response.data,
         });
       }
    }
  };

  const handleEditHoliday = async () => {
    try {
      await axios
        .put(
          `/api/holiday/${editValues.id}`,
          {
            name: editValues.editName,
            date: editValues.editDate,
            description: editValues.editDescription,
          },
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: response.data,
            });
            getHolidays();
          }
        });
    } catch (error) {
      if (error.response.status) {
        Swal.fire({
          icon: "error",
          title: "Ooops...",
          text: error.response.data,
        });
      }
    }
  };

  const handleDeleteHoliday = async () => {
    try {
      await axios
        .delete(`/api/holiday/${selectedHoliday}`, {
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
            getHolidays();
          }
        });
    } catch (error) {
      if (error.response.status) {
        Swal.fire({
          icon: "error",
          title: "Ooops...",
          text: error.response.data,
        });
      }
    }
  };

  const getHoliday = async (date) => {
    const holiday = holidays.find((holiday) => {
      return holiday.date === date;
    });

    setEditValues({
      id: holiday._id,
      editName: holiday.name,
      editDate: holiday.date,
      editDescription: holiday.description,
    });
  };

  useEffect(() => {
    getHolidays();
  }, []);

  return (
    <main id="main" className="main">
      <PageTitle />
      <section className="section dashboard">
        {(user._doc.designation.name.toUpperCase() === "ADMINISTRATOR" || user._doc.designation.name.toUpperCase() === "MANAGER") && (
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <button
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#modalDialogScrollable"
                className="card info-card pb-0 w-100"
              >
                <div className="card-body pb-0">
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-plus-circle"></i>
                    </div>
                    <h5 className="card-title pt-2">Add Holiday</h5>
                  </div>
                </div>
              </button>

              <div className="modal fade" id="modalDialogScrollable">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Add Holiday</h4>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body text-start">
                      <div className="container">
                        <div className="col-lg-12 mb-4">
                          <div className="row">
                            <div className="col-lg-4">
                              <label className="mb-3">Holiday Name</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={values.name}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label className="mb-3">Holiday Date</label>
                              <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={values.date}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-lg-4">
                              <label className="mb-3">Description</label>
                              <input
                                type="text"
                                className="form-control"
                                name="description"
                                value={values.description}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
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
                        onClick={handleHoliday}
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-lg-12 ">
            <div className="mb-4">
              <h4> All Holidays </h4>
            </div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>Holiday Name</th>
                  <th>Holiday Date</th>
                  <th>Description</th>
                  {(user._doc.designation.name.toUpperCase() === "ADMINISTRATOR" ||
                    user._doc.designation.name.toUpperCase() === "MANAGER") && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{holiday.name}</td>
                    <td>{holiday.date}</td>
                    <td>{holiday.description}</td>
                    {(user._doc.designation.name.toUpperCase() === "ADMINISTRATOR" ||
                      user._doc.designation.name.toUpperCase() === "MANAGER") && (
                      <td>
                        <a
                          href=""
                          data-bs-toggle="modal"
                          data-bs-target="#editHolidayModal"
                          className="text-primary m-2"
                          onClick={() => getHoliday(holiday.date)}
                        >
                          <i className="bi bi-pencil-square"></i>Edit
                        </a>

                        <a
                          href=""
                          data-bs-toggle="modal"
                          data-bs-target="#deleteHolidayModal"
                          className="text-danger"
                          onClick={() => setSelectedHoliday(holiday._id)}
                        >
                          <i className="bi bi-trash3"></i>Delete
                        </a>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal fade" id="editHolidayModal">
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Holiday Shift</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-start">
                <div className="container">
                  <div className="col-lg-12 mb-4">
                    <div className="row">
                      <div className="col-lg-4">
                        <label className="mb-3">Holiday Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="editName"
                          value={editValues.editName}
                          onChange={handleInputEditChange}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label className="mb-3">Holiday Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="editDate"
                          value={editValues.editDate}
                          onChange={handleInputEditChange}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label className="mb-3">Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="editDescription"
                          value={editValues.editDescription}
                          onChange={handleInputEditChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
                  onClick={handleEditHoliday}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="deleteHolidayModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Alert</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-start">
                <div className="container">
                  <p>
                    Are you sure? You want to delete the selected holiday, it
                    will may affect other operations.
                  </p>
                </div>
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
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={handleDeleteHoliday}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Holiday;
