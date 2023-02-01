import React, { useEffect, useState } from 'react';
import PageTitle from '../Components/PageTitle';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";

const initialValues = {
  name: '',
  startTime: '',
  endTime: '',
};

const initialEditValues = {
  id: "",
  editName: "",
  editStartTime: "",
  editEndTime: "",
};


const Shifts = () => {
  
  const token = Cookies.get("_goJwt");

  const [values, setValues] = useState(initialValues);

  const [shifts, setShifts] = useState([]);

  const [selectedShift, setSelectedShift] = useState();

  const [editValues, setEditValues] = useState(initialEditValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  const handleInputEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: value,
    });
  };

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

  const handleAddShift = async () => {
    try {
      await axios
        .post("/api/shift/addShift", values, {
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
            getShifts();
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
  }

  const handleEditShift = async () => {

    try {
      await axios
        .put(
          `/api/shift/${editValues.id}`,
          {
            name: editValues.editName,
            startTime: editValues.editStartTime,
            endTime: editValues.editEndTime,
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
            getShifts();
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
  }

  const handleDeleteShift = async () => {

    try {
      await axios
        .delete(`/api/shift/${selectedShift}`, {
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
            getShifts();
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
  }

  const getShift = (name) => {
    const shift = shifts.find((shift) => {
      return shift.name === name;
    })

    setEditValues({
      id: shift._id,
      editName: shift.name,
      editStartTime: shift.startTime,
      editEndTime: shift.endTime,
    });
  }

  useEffect(() => {
    getShifts()
  }, [])

  return (
    <main id="main" className="main">
      <PageTitle />
      <section className="section dashboard">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <button
              data-bs-toggle="modal"
              data-bs-target="#modalDialogScrollable"
              className="card info-card pb-0 w-100"
            >
              <div className="card-body pb-0">
                <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-plus-circle"></i>
                  </div>
                  <h5 className="card-title pt-2">Add Shift</h5>
                </div>
              </div>
            </button>

            <div className="modal fade" id="modalDialogScrollable">
              <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add Shift</h4>
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
                            <label className="mb-3">Shift Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={values.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-lg-4">
                            <label className="mb-3">Start Time</label>
                            <input
                              type="text"
                              className="form-control"
                              name="startTime"
                              value={values.startTime}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-lg-4">
                            <label className="mb-3">End Time</label>
                            <input
                              type="text"
                              className="form-control"
                              name="endTime"
                              value={values.endTime}
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
                      onClick={handleAddShift}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 ">
            <div className="mb-4">
              <h4> All Shifts </h4>
            </div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>Shift Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{shift.name}</td>
                    <td>{shift.startTime}</td>
                    <td>{shift.endTime}</td>
                    <td>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#editShiftModal"
                        className="text-primary m-2"
                        onClick={() => getShift(shift.name)}
                      >
                        <i className="bi bi-pencil-square"></i>Edit
                      </a>

                      <a
                        href=""
                        data-bs-toggle="modal"
                        data-bs-target="#deleteShiftModal"
                        className="text-danger"
                        onClick={() => setSelectedShift(shift._id)}
                      >
                        <i className="bi bi-trash3"></i>Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal fade" id="editShiftModal">
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Shift</h4>
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
                        <label className="mb-3">Shift Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="editName"
                          value={editValues.editName}
                          onChange={handleInputEditChange}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label className="mb-3">Start Time</label>
                        <input
                          type="text"
                          className="form-control"
                          name="editStartTime"
                          value={editValues.editStartTime}
                          onChange={handleInputEditChange}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label className="mb-3">End Time</label>
                        <input
                          type="text"
                          className="form-control"
                          name="editEndTime"
                          value={editValues.editEndTime}
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
                  onClick={handleEditShift}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="deleteShiftModal">
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
                    Are you sure? You want to delete the selected shift, it will may affect other operations.
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
                  onClick={handleDeleteShift}
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
}

export default Shifts;