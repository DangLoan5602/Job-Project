import { Box, Card, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { jobTypeLoadAction } from "../../redux/actions/jobTypeAction";
import { registerAjobAction } from "../../redux/actions/jobAction";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const validationSchema = yup.object({
  title: yup.string("Enter a job title").required("title is required"),
  salary: yup.number("Enter a salary").required("Salary is required"),
  location: yup.string("Enter a location").required("Location is required"),
  jobType: yup.string("Enter a Category").required("Category is required"),
});

const DashCreateJob = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    reason: "",
    description: "",
    skillExp: "",
  });
  //job type
  useEffect(() => {
    dispatch(jobTypeLoadAction());
  }, []);

  const { jobType } = useSelector((state) => state.jobTypeAll);

  const formik = useFormik({
    initialValues: {
      title: "",
      salary: "",
      location: "",
      jobType: "",
    },
    validationSchema: validationSchema,
    onSubmit: (value, actions) => {
      dispatch(registerAjobAction({ ...value, ...values }));
      actions.resetForm();
      setValues({ reason: "", description: "", skillExp: "" });
    },
  });

  const handleInputChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 4,
        }}
      >
        <Box
          onSubmit={formik.handleSubmit}
          component="form"
          className="form_style border-style"
        >
          <Card style={{ border: "none", boxShadow: "none" }}>
            <Typography variant="h5" component="h2" sx={{ pb: 3 }}>
              Register a Job
            </Typography>
            <TextField
              sx={{ mb: 3 }}
              fullWidth
              id="title"
              label="Title"
              name="title"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              sx={{ mb: 3 }}
              fullWidth
              id="salary"
              name="salary"
              label="Salary"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Salary"
              value={formik.values.salary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.salary && Boolean(formik.errors.salary)}
              helperText={formik.touched.salary && formik.errors.salary}
            />
            <TextField
              sx={{ mb: 3 }}
              fullWidth
              id="location"
              name="location"
              label="Location"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />

            <TextField
              sx={{ mb: 3 }}
              fullWidth
              className="px-2 my-2"
              variant="outlined"
              name="jobType"
              id="jobType"
              select
              label="Category"
              value={formik.values.jobType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.jobType && Boolean(formik.errors.jobType)}
              helperText={formik.touched.jobType && formik.errors.jobType}
            >
              <MenuItem key={""} value={""}></MenuItem>

              {jobType &&
                jobType.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.jobTypeName}
                  </MenuItem>
                ))}
            </TextField>
            <div style={{ paddingBottom: 10 }}>
              <Typography>Description</Typography>
              <CKEditor
                editor={ClassicEditor}
                data={values.description}
                style={{ width: "100%" }}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  handleInputChange("description", editor.getData());
                }}
                onBlur={(event, editor) => {
                  console.log("Blur.", editor);
                }}
                onFocus={(event, editor) => {
                  console.log("Focus.", editor);
                }}
              />
            </div>
            <div style={{ paddingBottom: 20, paddingTop: 10 }}>
              <Typography>Skill And Experience</Typography>
              <CKEditor
                editor={ClassicEditor}
                data={values.skillExp}
                style={{ width: "100%" }}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  handleInputChange("skillExp", editor.getData());
                }}
                onBlur={(event, editor) => {
                  console.log("Blur.", editor);
                }}
                onFocus={(event, editor) => {
                  console.log("Focus.", editor);
                }}
              />
            </div>
            <div style={{ paddingBottom: 20, paddingTop: 10 }}>
              <Typography>Reason</Typography>
              <CKEditor
                editor={ClassicEditor}
                data={values.reason}
                style={{ width: "100%" }}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  handleInputChange("reason", editor.getData());
                }}
                onBlur={(event, editor) => {
                  console.log("Blur.", editor);
                }}
                onFocus={(event, editor) => {
                  console.log("Focus.", editor);
                }}
              />
            </div>
            <Button fullWidth variant="contained" type="submit">
              Create job
            </Button>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default DashCreateJob;
