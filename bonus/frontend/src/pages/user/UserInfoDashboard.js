import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import React, { useState } from "react";
import { USER_SIGNIN_SUCCESS } from "../../redux/constants/userConstant";
import authApi from "../../api/authApi";
import { toast } from "react-toastify";

const { updateUser, changePassword } = authApi;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserInfoDashboard = () => {
  const { userInfo } = useSelector((state) => state.signIn);
  const { palette } = useTheme();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    firstName: userInfo.user.firstName,
    lastName: userInfo.user.lastName,
  });
  const [password, setPassword] = useState({
    show: false,
    oldPassword: "",
    newPassword: "",
  });

  const handleUpdate = async () => {
    try {
      await updateUser(user.firstName, user.lastName, userInfo.user._id);
      const newUser = { ...userInfo, user: { ...userInfo.user, ...user } };
      localStorage.setItem("userInfo", JSON.stringify(newUser));
      dispatch({
        type: USER_SIGNIN_SUCCESS,
        payload: newUser,
      });
      toast.success("Update Success");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Update Failed");
    }
  };
  const handleChangePassword = async () => {
    try {
      await changePassword(password.oldPassword, password.newPassword);
      toast.success("Update Success");
      setPassword({ show: false, oldPassword: "", newPassword: "" });
    } catch (error) {
      if (error) return toast.error(error.response.data.message);
      return toast.error("Update failed");
      
    }
  };
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Update Profile"}</DialogTitle>
        <DialogContent>
          <div style={{ padding: 5 }}>
            <TextField
              placeholder="Enter your email"
              label="Email"
              value={userInfo.user.email}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              disabled
            />
          </div>
        </DialogContent>
        <DialogContent>
          <div style={{ padding: 5 }}>
            <TextField
              fullWidth
              placeholder="Enter your first name"
              label="First Name"
              value={user.firstName}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, firstName: e.target.value }))
              }
            />
          </div>
        </DialogContent>
        <DialogContent>
          <div style={{ padding: 5 }}>
            <TextField
              fullWidth
              placeholder="Enter your last name"
              label="Last Name"
              defaultValue={user.lastName}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, lastName: e.target.value }))
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={password.show}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setPassword((prev) => ({ ...prev, show: false }))}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Change Password"}</DialogTitle>
        <DialogContent>
          <div style={{ padding: 5 }}>
            <TextField
              placeholder="Enter old password"
              label="Old Password"
              type="password"
              value={password.oldPassword}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  oldPassword: e.target.value,
                }))
              }
            />
          </div>
        </DialogContent>
        <DialogContent>
          <div style={{ padding: 5 }}>
            <TextField
              placeholder="Enter new password"
              label="New Password"
              type="password"
              value={password.newPassword}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setPassword((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangePassword}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ maxWidth: "50%", margin: "auto", pt: 10 }}>
        <Card sx={{ minWidth: 275, bgcolor: palette.secondary.midNightBlue }}>
          <CardContent>
            <Typography
              sx={{
                fontSize: 16,
                display: "flex",
                justifyContent: "space-between",
              }}
              color="#fafafa"
              gutterBottom
            >
              <Typography>Personal Info</Typography>
              <Typography>
                <Button endIcon={<EditIcon />} onClick={() => setOpen(true)} />
                <Button
                  endIcon={<LockIcon />}
                  onClick={() =>
                    setPassword((prev) => ({ ...prev, show: true }))
                  }
                />
              </Typography>
            </Typography>
            <hr style={{ marginBottom: "30px" }} />
            <Typography variant="h6" component="div" sx={{ color: "#fafafa" }}>
              First name: {userInfo && userInfo.user.firstName}
            </Typography>
            <Typography variant="h6" component="div" sx={{ color: "#fafafa" }}>
              Last name: {userInfo && userInfo.user.lastName}
            </Typography>
            <Typography variant="h6" component="div" sx={{ color: "#fafafa" }}>
              E-mail: {userInfo && userInfo.user.email}
            </Typography>
            <Typography
              sx={{ mb: 1.5, color: "grey", pt: 2 }}
              color="text.secondary"
            >
              Status:{" "}
              {userInfo && userInfo.user.role === 0 ? "Regular user" : "Admin"}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default UserInfoDashboard;
