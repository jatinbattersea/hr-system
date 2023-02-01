import React, { useState, useEffect, useContext } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, IconButton, Typography, Select, MenuItem, Menu } from "@mui/material";
import { ArrowDropDownTwoTone } from '@mui/icons-material';
import PageTitle from '../Components/PageTitle';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";

let token;

const Tools = (props) => {
  token = Cookies.get("_goJwt");
  // ? Tool States
  const [values, setValues] = useState({
    month: '',
    year: '',
  });

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

  const handleToggleDeleteDialog = () => {

    if (values.year === "" || values.month === "") return props.setErrorMsg(true);
    
    if (openDeleteDialog) return setOpenDeleteDialog(false);
    return setOpenDeleteDialog(true);
  };

  // ? Action Functions

  const handleSearchLeaves = async () => {

    if (values.year === '' || values.month === '') return props.setErrorMsg(true);

    try {
      const { data } = await axios.get(`/api/leaves/${values.year}/${values.month}`, {
        headers: {
          Authorization: `Basic ${token}`,
        }
      });
      props.setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteLeaves = async () => {

    try {
      await axios.delete(`/api/leaves/${values.year}/${values.month}`, {
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
          <MenuItem value={0}>Jan</MenuItem>
          <MenuItem value={1}>Feb</MenuItem>
          <MenuItem value={2}>Mar</MenuItem>
          <MenuItem value={3}>Apr</MenuItem>
          <MenuItem value={4}>May</MenuItem>
          <MenuItem value={5}>Jun</MenuItem>
          <MenuItem value={6}>Jul</MenuItem>
          <MenuItem value={7}>Aug</MenuItem>
          <MenuItem value={8}>Sep</MenuItem>
          <MenuItem value={9}>Oct</MenuItem>
          <MenuItem value={10}>Nov</MenuItem>
          <MenuItem value={11}>Dec</MenuItem>
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
            <MenuItem onClick={handleSearchLeaves}>
              <Typography textAlign="center">Search</Typography>
            </MenuItem>
            <MenuItem onClick={handleToggleDeleteDialog}>
              <Typography textAlign="center">Delete</Typography>
            </MenuItem>
          </Menu>

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
              <Button onClick={handleDeleteLeaves} autoFocus>
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

const Leaves = () => {

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const initialValues = {
    name: "",
    email: "",
    lastUpdated: "",
    leaveType: "",
    leaveDates: [],
    totalDays: "",
    reason: "",
    status: "",
    approvedBy: "",
    msg: "",
  };

  const [values, setValues] = useState(initialValues);
  
  const [rowdata, setData] = useState([]);

  const [dataUpdated, setDataUpdated] = useState({
      check: false,
      year: "",
      month: "",
  });

  const [errorMsg, setErrorMsg] = useState(false);

   const handleInputChange = (e) => {
     const { name, value } = e.target;
     setValues({
       ...values,
       [name]: value,
       approvedBy: user._doc.designation.name,
     });
   };

   const columns = [
     {
       field: "name",
       headerName: "Name",
       flex: 1,
     },
     {
       field: "email",
       headerName: "email",
       flex: 1,
     },
     {
       field: "lastUpdated",
       headerName: "Last Updated",
       flex: 1,
     },
     {
       field: "status",
       headerName: "Status",
       flex: 1,
     },
     {
       field: "approvedBy",
       headerName: "Approved By",
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
             onClick={() => getLeaveDetails(params.row._id)}
           >
             Edit
           </Button>
         );
       },
     },
   ];

   const getLeaveDetails = (leaveID) => {
     setValues(
       rowdata.find((leave) => {
         return leave._id === leaveID;
       }
       )
     );
  };
  
  const getLeaves = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    let responseData;
    try {
      // for current month
      const { data } = await axios.get(`/api/leaves/${year}/${month}`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });
      responseData = data;
      // for previous month
      if (responseData.length === 0) {
        if (month > 0) {
          const { data } = await axios.get(`/api/leaves/${year}/${month - 1}`, {
            headers: {
              Authorization: `Basic ${token}`,
            },
          });
          responseData = data;
        } else {
          // for last year last month
          const { data } = await axios.get(`/api/leaves/${year - 1}/12`, {
            headers: {
              Authorization: `Basic ${token}`,
            },
          });
          responseData = data;
        }
      } 

      setData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

   const handleMangeApplication = async (event) => {
     event.preventDefault();

     // Get Current Date with Time
     var date = new Date();
     var current_date =
       date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
     var current_time =
       date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
     var lastUpdated = current_date + " " + current_time;

     const userData = {
       ...values,
       lastUpdated,
     };

     try {
       const response = await axios.post(
         `api/leaves/${userData._id}`,
         userData,
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
         getLeaves();
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

  useEffect(() => {
    getLeaves();
  }, [navigate, dataUpdated]);

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
            getRowId={(row) => row?._id}
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
                sortModel: [{ field: "lastUpdated", sort: "desc" }],
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
                  <h4 className="modal-title">Edit Leave</h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-start">
                  <form onSubmit={handleMangeApplication} className="row g-3">
                    <div className="col-12">
                      <label htmlFor="" className="mb-3">
                        <b>Leave Type</b>
                      </label>
                      <select
                        className="form-select"
                        name="leaveType"
                        value={values.leaveType}
                        onChange={handleInputChange}
                        disabled
                      >
                        <option value="">---Leave Type---</option>
                        <option value="CL">CL</option>
                        <option value="Leave">Leave</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label htmlFor="" className="mb-3 mt-3">
                        <b>Leave Dates</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="leaveDates"
                        value={values.leaveDates}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="" className="mb-3 mt-3">
                        <b>Number of Days</b>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="totalDays"
                        value={values.totalDays}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="" className="mb-3">
                        <b>Status</b>
                      </label>
                      <select
                        className="form-select"
                        name="status"
                        value={values.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label htmlFor="" className="mb-3 mt-3">
                        <b>Remark</b>
                      </label>
                      <textarea
                        className="form-control"
                        cols="30"
                        rows="3"
                        name="msg"
                        value={values.msg}
                        onChange={handleInputChange}
                        placeholder="Remark Here..."
                      ></textarea>
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

export default Leaves;