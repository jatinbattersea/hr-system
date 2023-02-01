import React, { useState, useEffect, useContext } from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
} from "@mui/material";
import PageTitle from '../Components/PageTitle';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import Cookies from "js-cookie";
import {Calendar} from "react-multi-date-picker";
import lateArrivals, { attendenceObjectToArray } from "../Reusable Logics/attendenceLogics";

const columns = [
  {
    field: "date",
    headerName: "Date",
    type: "date",
    flex: 1,
  },
  {
    field: "day",
    headerName: "Day",
    flex: 1,
  },
  {
    field: "timeIn",
    headerName: "Punch In",
    flex: 1,
  },
  {
    field: "timeOut",
    headerName: "Punch Out",
    flex: 1,
  },
];


const EmployeeDashboard = () => {

  const token = Cookies.get("_goJwt");
  
  const { user } = useContext(AuthContext);

  const initialValues = {
    name: user._doc.name,
    email: user._doc.email,
    employeeID: user._doc.employeeID,
    leaveType: "",
    reason: "",
    leaveDates: [],
    status: "Pending",
    msg: "",
  };

  const [rowdata, setData] = useState([]);

  const [values, setValues] = useState(initialValues);

  const [dateArray, setDateArray] = useState([]);

  const [upComingHoliday, setUpComingHoliday] = useState({
    name: "",
    date: "",
  });

  const [employee, setEmployee] = useState({
    cl: "",
    leavesTaken: "",
  });

  // ? Setting values of year and month
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  // Handle Leave Apply
  const handleLeaveApply = async (event) => {
    event.preventDefault();

    const dates = dateArray.map((date) => {
      let day = date.day;
      let month = date.month.index + 1;
      let year = date.year;
      if (day<10 && month>10) {
        return month + "/0" + day + "/" + year;
      } else if (day>10 && month<10) {
        return "0" + month + "/" + day + "/" + year;
      } else if (day<10 && month<10) {
        return "0" + month + "/0" + day + "/" + year;
      } else {
        return month + "/" + day + "/" + year;
      }
    })

    dates.sort(function (a, b) {
      return new Date(a) - new Date(b);
    })

    // Get Current Date with Time
    var date = new Date();
    var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
    var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
    var lastUpdated = current_date+" "+current_time;

    const userData = {
      ...values,
      leaveDates: dates,
      lastUpdated,
      totalDays: dates.length,
    }

    try {
      const response = await axios.post("/api/leaves/apply", userData, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: response.data,
        });
      }
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
  
  useEffect(() => {
    const getLateArrivals = async () => {
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      let responseData;
      try {
        const { data } = await axios.get(
          `/api/attendence/${year}/${month - 1}/${user._doc.employeeID}`,
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          }
        );
        responseData = data;
        if (data.length === 0) {
          // This is the last year attendence
          const { data } = await axios.get(
            `/api/attendence/${year - 1}/12/${user._doc.employeeID}`,
            {
              headers: {
                Authorization: `Basic ${token}`,
              },
            }
          );
          responseData = data;
        }

        const attendenceArray = attendenceObjectToArray(responseData);

        setData(lateArrivals(attendenceArray, user._doc.shift));
      } catch (error) {
        console.log(error);
      }
    }
    getLateArrivals();
  }, []);
  
  useEffect(() => {
    const getUpComingHoliday = async () => {
      const { data } = await axios.get("/api/holiday/up/awaited", {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      setUpComingHoliday(data);
    };
    getUpComingHoliday();
  }, []);

  useEffect(() => {
    const getUserOffs = async () => {
      const { data } = await axios.get(`/api/user/leaves/${user._doc.employeeID}`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      setEmployee(data);
    };
    getUserOffs();
  }, [token]);

  return (
    <main id="main" className="main">
      <PageTitle />
      {/* End Page Title */}
      <section className="section dashboard">
        <div className="row">
          <div className="col-lg-8 col-md-6">
            <div className="card info-card text-center">
              <div className="card-body pb-0">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <h5 className="card-title">Total Leave</h5>
                    <div className="d-flex align-items-center justify-content-center mb-2 mt-3">
                      <h6>{employee.leavesTaken ? employee.leavesTaken : 0}</h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <h5 className="card-title">CL Remaining</h5>
                    <div className="d-flex align-items-center justify-content-center mb-2 mt-3">
                      <h6>{employee.cl ? employee.cl : 0}</h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <button className="btn btn-primary">
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#leave-popup"
                        className="text-white"
                      >
                        Apply Leave
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card info-card">
              <div className="card-body pb-0">
                <h5 className="card-title mb-4">Upcoming Holidays</h5>
                <p className="mb-2 mt-3">{`${upComingHoliday?.date} - ${upComingHoliday?.name}`}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-8 col-md-6">
            <div className="card info-card">
              <div className="card-body pb-0">
                <h5 className="card-title mb-3">Late Arrival</h5>
                <Box
                  sx={{
                    height: 375,
                  }}
                >
                  <DataGrid
                    rows={rowdata}
                    columns={columns}
                    pageSize={4}
                    rowsPerPageOptions={[4]}
                    disableSelectionOnClick
                    disableToolbarExport
                    disableDensitySelector
                    disableColumnSelector
                    disableColumnFilter
                    components={{
                      Toolbar: GridToolbar,
                    }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                        printOptions: { disableToolbarButton: true },
                      },
                    }}
                    initialState={{
                      sorting: {
                        sortModel: [{ field: "date", sort: "desc" }],
                      },
                    }}
                    sx={{
                      p: 1,
                    }}
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="modal fade" id="leave-popup">
        <div className="modal-dialog modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Apply Leave</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-start">
              <form onSubmit={handleLeaveApply} className="row g-3 validation">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <div className="input-group has-validation">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          <i className="bi bi-microsoft-teams"></i>
                        </span>
                        <select
                          className="form-select"
                          name="leaveType"
                          value={values.leaveType}
                          required
                          onChange={handleInputChange}
                        >
                          <option value="">--- Select CL/Leave ---</option>
                          <option value="Half Day">Half Day</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      <div className="input-group has-validation">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          <i className="bi bi-microsoft-teams"></i>
                        </span>
                        <select
                          className="form-select"
                          name="reason"
                          value={values.reason}
                          required
                          onChange={handleInputChange}
                        >
                          <option value="">
                            --- Select Reason For Leave ---
                          </option>
                          <option value="Vacation">Vacation</option>
                          <option value="Sick-Self">Sick - Self</option>
                          <option value="Sick-Family">Sick - Family</option>
                          <option value="Doctor Appointment">
                            Doctor Appointment
                          </option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="" className="mb-3">
                    <b>Choose Dates</b>
                  </label>
                  <Calendar value={dateArray} onChange={setDateArray} />
                </div>
                <div className="col-12">
                  <textarea
                    className="form-control"
                    name="msg"
                    id="msg"
                    cols="30"
                    rows="3"
                    value={values.msg}
                    onChange={handleInputChange}
                    placeholder="Message Here..."
                  ></textarea>
                </div>
                <div className="col-12">
                  <button
                    className="btn btn-primary w-100"
                    data-bs-dismiss="modal"
                    type="submit"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EmployeeDashboard;