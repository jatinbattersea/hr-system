import React, { useEffect, useState } from "react";
import PageTitle from "./../Components/PageTitle";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const initialValues = {
  name: "",
};

const initialEditValues = {
  id: "",
  editName: "",
};

const Teams = () => {
  const token = Cookies.get("_goJwt");

  const [values, setValues] = useState(initialValues);

  const [teams, setTeams] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState();

  const [editValues, setEditValues] = useState(initialEditValues);

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

  const handleAddTeam = async () => {
    try {
      await axios
        .post("/api/team/addTeam", values, {
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
            getTeams();
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

  const handleEditTeam = async () => {
    try {
      await axios
        .put(
          `/api/team/${editValues.id}`,
          {
            name: editValues.editName,
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
            getTeams();
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

  const handleDeleteTeam = async () => {
    try {
      await axios
        .delete(`/api/team/${selectedTeam}`, {
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
            getTeams();
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

  const getTeam = async (name) => {
    const team = teams.find((team) => {
      return team.name === name;
    });

    setEditValues({
      id: team._id,
      editName: team.name,
    });
  }

  useEffect(() => {
    getTeams();
  }, []);

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
              <div className="card-body p-0">
                <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="bi bi-plus-circle"></i>
                  </div>
                  <h5 className="card-title pt-2">Add Team</h5>
                </div>
              </div>
            </button>

            <div className="modal fade" id="modalDialogScrollable">
              <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add Team</h4>
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
                          <div className="col-lg-12">
                            <label className="mb-3">Team Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={values.name}
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
                      onClick={handleAddTeam}
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
          <div className="col-lg-4 ">
            {teams.map((team, index) => (
              <div className="card mb-1 p-3" key={index}>
                <div className="all-e-img">
                  <h6 className="mb-0">{team.name}</h6>
                </div>
                <div className="filter">
                  <a className="icon" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-three-dots"></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li>
                      <a className="dropdown-item" href="#" data-bs-toggle="modal"
                      data-bs-target="#editTeamModal"
                      onClick={() => getTeam(team.name)}
                      >
                        <i className="bi bi-pencil-square"></i>Edit </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" 
                      data-bs-toggle="modal"
                      data-bs-target="#deleteTeamModal" onClick={() => setSelectedTeam(team._id)}>
                        <i className="bi bi-trash3"></i>Delete </a>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal fade" id="editTeamModal">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Team</h4>
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
                      <div className="col-lg-12">
                        <label className="mb-3">Team Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="editName"
                          value={editValues.editName}
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
                  onClick={handleEditTeam}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="deleteTeamModal">
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
                    Are you sure? You want to delete the selected team, it will
                    may affect other operations.
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
                  onClick={handleDeleteTeam}
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

export default Teams;
