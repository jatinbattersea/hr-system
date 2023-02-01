import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, IconButton, Typography, Select, MenuItem, Menu } from "@mui/material";
import { CloudUpload, ArrowDropDownTwoTone } from '@mui/icons-material';
import PageTitle from '../Components/PageTitle';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";
import Cookies from "js-cookie";
import lateArrivals, { attendenceObjectToArray } from "../Reusable Logics/attendenceLogics";

let token;

const Tools = (props) => {
  token = Cookies.get("_goJwt");
  // ? Tool States
  const [values, setValues] = useState({
    month: '',
    year: '',
  });

  // ? Import Dialog file
  const [file, setFile] = useState(null);

  // ? Import Dialog
  const [open, setOpen] = useState(false);

  // ? User Action Dialog
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // ? Defalut Var's
  const years = [
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
  ];

  // ? Setting values of year and month
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    if (values.year !== '' && values.month !== '') return props.setErrorMsg(false);
  }

  // ? Toggler's
  const handleToggleActionMenu = (event) => {
    if (anchorElUser) return setAnchorElUser(null);
    return setAnchorElUser(event.currentTarget);
  }

  const handleToggleImportDialog = () => {

    if (values.year === '' || values.month === '') return props.setErrorMsg(true);

    setFile(null);
    if (open) return setOpen(false);
    return setOpen(true);
  }

  const handleToggleDeleteDialog = () => {

    if (values.year === "" || values.month === "") return props.setErrorMsg(true);
    
    if (openDeleteDialog) return setOpenDeleteDialog(false);
    return setOpenDeleteDialog(true);
  };

  // ? Action Functions
  const handleUpload = () => {

    const formData = new FormData();
    formData.append("attendenceFile", file);
    formData.append("month", values.month);
    formData.append("year", values.year);
    axios
      .post("/api/attendence", formData, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
      .then((response) => {
        props.setDataUpdated({
          check: response.data.dataUpdated,
        });
        setOpen(false);
        setFile(null);
      });
  }

  const handleSearchAttendence = async () => {

    if (values.year === '' || values.month === '') return props.setErrorMsg(true);

    try {
      const { data } = await axios.get(`/api/attendence/${values.year}/${values.month}`, {
        headers: {
          Authorization: `Basic ${token}`,
        }
      });

      const attendenceArray = attendenceObjectToArray(data);
      props.setData(attendenceArray);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteAttendence = async () => {

    try {
      await axios.delete(`/api/attendence/${values.year}/${values.month}`, {
        headers: {
          Authorization: `Basic ${token}`,
        }
      })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: response.data,
            });
            props.setDataUpdated({
              check: true
            });
            setOpenDeleteDialog(false);
          }
        });
    } catch (err) {
      console.log(err);
    }
  }

  const handleLateArrival = async () => {

    if (values.year === '' || values.month === '') return props.setErrorMsg(true);

    
    try {
      const { data } = await axios.get(`/api/attendence/${values.year}/${values.month}`, {
        headers: {
          Authorization: `Basic ${token}`,
        }
      });
      const shiftData = await axios.get("/api/user/employee/shifts", {
        headers: {
          Authorization: `Basic ${token}`,
        }
      });

      const attendenceArray = attendenceObjectToArray(data);
      props.setData(lateArrivals(attendenceArray, shiftData));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="d-flex align-items-center">
        <Select
          displayEmpty
          value={values.year}
          onChange={handleInputChange}
          name="year"
          sx={{
            width: "130px",
            height: "30px",
            mx: 1,
            py: 2,
          }}
        >
          <MenuItem value="">
            <em>Select Year</em>
          </MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
        <Select
          displayEmpty
          value={values.month}
          onChange={handleInputChange}
          name="month"
          sx={{
            width: "150px",
            height: "30px",
            mx: 1,
            py: 2,
          }}
        >
          <MenuItem value="">
            <em>Select Month</em>
          </MenuItem>
          <MenuItem value={1}>Jan</MenuItem>
          <MenuItem value={2}>Feb</MenuItem>
          <MenuItem value={3}>Mar</MenuItem>
          <MenuItem value={4}>Apr</MenuItem>
          <MenuItem value={5}>May</MenuItem>
          <MenuItem value={6}>Jun</MenuItem>
          <MenuItem value={7}>Jul</MenuItem>
          <MenuItem value={8}>Aug</MenuItem>
          <MenuItem value={9}>Sep</MenuItem>
          <MenuItem value={10}>Oct</MenuItem>
          <MenuItem value={11}>Nov</MenuItem>
          <MenuItem value={12}>Dec</MenuItem>
        </Select>

        <Box sx={{ mx: 1 }}>
          <Button
            color="primary"
            variant="contained"
            type="button"
            sx={{
              width: "auto",
              height: "30px",
            }}
            onClick={handleToggleActionMenu}
          >
            Action
            <ArrowDropDownTwoTone />
          </Button>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleToggleActionMenu}
          >
            <MenuItem onClick={handleToggleImportDialog}>
              <Typography textAlign="center">Import</Typography>
            </MenuItem>
            <MenuItem onClick={handleSearchAttendence}>
              <Typography textAlign="center">Search</Typography>
            </MenuItem>
            <MenuItem onClick={handleToggleDeleteDialog}>
              <Typography textAlign="center">Delete</Typography>
            </MenuItem>
            <MenuItem onClick={handleLateArrival}>
              <Typography textAlign="center">Late Arrival</Typography>
            </MenuItem>
          </Menu>

          {/* Import Dialog */}
          <Dialog onClose={handleToggleImportDialog} open={open}>
            <Box
              sx={{
                width: "400px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  type="button"
                  variant="standard"
                  onClick={handleToggleImportDialog}
                >
                  <i className="bi bi-x-lg"></i>
                </Button>
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 3,
                  }}
                >
                  <IconButton
                    color="primary"
                    aria-label="upload File"
                    component="label"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "#fff !important",
                      background: "unset !important",
                      borderRadius: 0,
                    }}
                  >
                    <CloudUpload
                      sx={{
                        fontSize: "50px",
                      }}
                    />
                    <Typography
                      gutterBottom
                      sx={{
                        fontSize: "20px",
                        color: "#333",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {file ? file.name : "Click Here to Upload File"}
                    </Typography>
                    <input
                      hidden
                      accept=".xls, .xlsx"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </IconButton>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleUpload}
                    disabled={file ? false : true}
                  >
                    Upload
                  </Button>
                </Box>
              </Box>
            </Box>
          </Dialog>

          {/* Delete Comfirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleToggleDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Alert"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure? You want to delete all records of selected month
                or year.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleToggleDeleteDialog}>Disagree</Button>
              <Button onClick={handleDeleteAttendence} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        position: "relative",
        my: 3
      }}
    >
      <GridToolbarQuickFilter
        sx={{
          position: "absolute",
          right: 0,
        }}
      />
    </GridToolbarContainer>
  );
}

const Attendence = () => {

  const navigate = useNavigate();

    const initialValues = {
      name: "",
      employeeId: "",
      date: "",
      day: "",
      timeIn: "",
      timeOut: "",
      status: "",
      year: "",
      month: "",
    };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "employeeId",
      headerName: "Employee ID",
      flex: 1,
    },
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
    {
      field: "status",
      headerName: "Dutty Status",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            data-bs-toggle="modal"
            data-bs-target="#leave-modal"
            onClick={() =>
              getAttendenceDetails(params.row.employeeId, params.row.date)
            }
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const [values, setValues] = useState(initialValues);

  const [rowdata, setData] = useState([]);

  const [dataUpdated, setDataUpdated] = useState({
    check: false,
    year: '',
    month: '',
  });

  const [errorMsg, setErrorMsg] = useState(false);

  const getAttendenceDetails = (employeeId, date) => {
    const row = rowdata.find((attendence) => {
      return attendence.employeeId === employeeId && attendence.date === date;
    });
    setValues({
      ...row,
      year: new Date(row.date).getFullYear(),
      month: new Date(row.date).getMonth()+1,
    });
  };

  useEffect(() => {

    const getAttendence = async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // current Month Index + 1 = 11
      let responseData;
      try {
        const { data } = await axios.get(`/api/attendence/${year}/${month}`, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
        responseData = data;
        if (data.length === 0 && month > 1) {
          const { data } = await axios.get(
            `/api/attendence/${year}/${month - 1}`,
            {
              headers: {
                Authorization: `Basic ${token}`,
              },
            }
          );
          responseData = data;
        } else {
          // This is the last year attendence
          const { data } = await axios.get(`/api/attendence/${year - 1}/12`, {
            headers: {
              Authorization: `Basic ${token}`,
            },
          });
          responseData = data;
        }

        const attendenceArray = attendenceObjectToArray(responseData);
        setData(attendenceArray);
      } catch (error) {
        console.log(error);
      }
    }

    getAttendence();
  }, [navigate, dataUpdated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
     setValues({
       ...values,
       [name]: value,
     });
  }
  
  const handleMangeAttendence = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `api/attendence/update/`,
        values,
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: response.data,
        });
        setDataUpdated({...dataUpdated, check: true})
      }
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

  return (
    <main id="main" className="main">
      <PageTitle />
      {/* End Page Title */}
      <section className="section dashboard">
        {errorMsg && (
          <p className="text-danger">**Please select month and year.</p>
        )}
        <Box
          sx={{
            height: 500,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 3,
              ml: 1,
              position: "absolute",
              zIndex: 100,
            }}
          >
            <Tools
              setDataUpdated={setDataUpdated}
              setData={setData}
              setErrorMsg={setErrorMsg}
            />
          </Box>
          <DataGrid
            rows={rowdata}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            disableToolbarExport
            disableDensitySelector
            disableColumnSelector
            disableColumnFilter
            components={{
              Toolbar: CustomToolbar,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
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
      </section>
      {values && (
        <div className="modal fade" id="leave-modal">
          <div className="modal-dialog modal-md modal-dialog-scrollable">
            <div className="modal-dialog modal-md modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Edit Attendence</h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-start">
                  <form onSubmit={handleMangeAttendence} className="row g-3">
                    <div className="col-12">
                      <label htmlFor="" className="mb-3">
                        <b>Name</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={values.name}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="" className="mb-3 mt-3">
                        <b>Employee ID</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="employeeId"
                        value={values.employeeId}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="" className="mb-3 mt-3">
                        <b>Date</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="date"
                        value={values.date}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="" className="mb-3">
                        <b>Punch In</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="timeIn"
                        value={values.timeIn}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="" className="mb-3">
                        <b>Punch Out</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="timeOut"
                        value={values.timeOut}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="" className="mb-3">
                        <b>Status</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="status"
                        value={values.status}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="modal-footer justify-content-center">
                      <button
                        type="submit"
                        data-bs-dismiss="modal"
                        className="btn btn-primary"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Attendence;
