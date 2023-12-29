import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Slide,
  TextField,
  Typography,
  gridClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import jobApi from "../../api/jobApi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast } from "react-toastify";

const { getSingleJob, acceptJob, rejectJob } = jobApi;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const initialCv = {
  open: false,
  link: "",
  name: "",
};

const initialAccept = {
  open: false,
  subject: "Congratulation Applicants",
  htmlForm: "",
  id: "",
  email: "",
};
const initialReject = {
  open: false,
  subject: "We thank you for your interest",
  htmlForm: "",
  id: "",
  email: "",
};

const DashSingleJob = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [cv, setCv] = useState(initialCv);
  const [accept, setAccept] = useState(initialAccept);
  const [reject, setReject] = useState(initialReject);
  const handleGetJob = async () => {
    const applicants = await getSingleJob(id);
    setApplicants(applicants);
  };

  const handleAccept = (id, email) => {
    setAccept((prev) => ({ ...prev, open: true, id, email }));
  };

  const handleReject = (id, email) => {
    console.log("id-email: ",id, email)
    setReject((prev) => ({ ...prev, open: true, id, email }));
  };
console.log(reject)
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (value) =>
        `${value.row.user.firstName} ${value.row.user.lastName}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (data) =>
        data.row.applicationStatus ? (
          <Chip
            label={
              data.row.applicationStatus === "pending"
                ? "Pending..."
                : data.row.applicationStatus === "accepted"
                ? "Accepted!"
                : "Reject"
            }
            color={
              data.row.applicationStatus === "pending"
                ? "warning"
                : data.row.applicationStatus === "accepted"
                ? "success"
                : "error"
            }
          />
        ) : null,
    },
    {
      field: "Actions",
      width: 300,
      renderCell: (values) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            onClick={() =>
              setCv({
                name: `${values.row.user.firstName} ${values.row.user.lastName}`,
                link: values.row.cv,
                open: true,
              })
            }
          >
            CV
          </Button>
          {values.row.applicationStatus === "pending" ? (
            <>
              <Button
                variant="contained"
                onClick={() =>
                  handleAccept(values.row._id, values.row.user.email)
                }
              >
                Accept
              </Button>
              <Button variant="contained" color="error" onClick={() =>
                  handleReject(values.row._id, values.row.user.email)
                }>
                Reject
              </Button>
            </>
          ) : (
            <></>
          )}
        </Box>
      ),
    },
  ];
  useEffect(() => {
    handleGetJob();
  }, [id]);

  const handleClose = () => {
    setCv(initialCv);
  };
  const handleCloseAccept = () => {
    setAccept(initialAccept);
  };
  const handleAcceptApi = async () => {
    try {
      await acceptJob(accept.id, accept.email, accept.subject, accept.htmlForm);
      await handleGetJob();
      setAccept(initialAccept);
      toast.success("Applicant will receive notifi in email!");
    } catch (error) {
      console.log(error);
      toast.error("Error Server");
    }
  };

  const handleRejectApi = async () => {
    try {
      await rejectJob(reject.id, reject.email, reject.subject, reject.htmlForm);
      handleGetJob();
      setReject(initialReject);
      toast.success("Applicant will receive notifi in email!");
    } catch (error) {
      console.log(error);
      toast.error("Error Server");
    }
  };
  const inputHandler = (event, editor) => {
    setAccept((prev) => ({ ...prev, htmlForm: editor.getData() }));
  };
  const inputRejectHandler = (event, editor) => {
    setReject((prev) => ({ ...prev, htmlForm: editor.getData() }));
  };


  return (
    <Box>
      <Dialog
        open={cv.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{cv.name}</DialogTitle>
        <DialogContent>
          {cv.open ? (
            <embed src={cv.link} width="800px" height="2100px" />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={accept.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Accepted CV</DialogTitle>
        <DialogContent>
          <div style={{ padding: 20 }}>
            <TextField
              placeholder="enter your subject here"
              value={accept.subject}
              fullWidth
              onChange={(e) =>
                setAccept((prev) => ({ ...prev, subject: e.target.value }))
              }
              label="Subject"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </DialogContent>
        <DialogContent>
          <div style={{ padding: 20 }}>
            <CKEditor
              editor={ClassicEditor}
              data={accept.htmlForm}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={inputHandler}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAccept}>Back</Button>
          <Button onClick={handleAcceptApi}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={reject.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setReject(initialReject)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Reject CV</DialogTitle>
        <DialogContent>
          <div style={{ padding: 20 }}>
            <TextField
              placeholder="enter your subject here"
              value={reject.subject}
              fullWidth
              onChange={(e) =>
                setReject((prev) => ({ ...prev, subject: e.target.value }))
              }
              label="Subject"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </DialogContent>
        <DialogContent>
          <div style={{ padding: 20 }}>
            <CKEditor
              editor={ClassicEditor}
              data={reject.htmlForm}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={inputRejectHandler}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReject(initialReject)}>Back</Button>
          <Button onClick={() => handleRejectApi()}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ bgcolor: "secondary.midNightBlue" }}>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            getRowId={(row) => row._id}
            sx={{
              "& .MuiTablePagination-displayedRows": {
                color: "white",
              },
              color: "white",
              [`& .${gridClasses.row}`]: {
                bgcolor: (theme) =>
                  // theme.palette.mode === 'light' ? grey[200] : grey[900],
                  theme.palette.secondary.main,
              },
              button: {
                color: "#ffffff",
              },
            }}
            rows={applicants}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default DashSingleJob;
