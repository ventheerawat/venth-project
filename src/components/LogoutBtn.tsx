import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
function LogoutBtn() {
  const { logout, isAuthenticated } = useAuth0();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function Logout() {
    sessionStorage.clear();
    logout();
  }

  return (
    isAuthenticated && (
      <>
        <span
          className="w-100"
          style={{ display: "flex" }}
          onClick={() => handleClickOpen()}
        >
          <ExitToAppRoundedIcon sx={{ marginRight: "16px" }} />
          Log Out
        </span>
        <Dialog
          fullWidth={true}
          maxWidth={"sm"}
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Log Out</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to log out ?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: "24px" }}>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={() => Logout()} autoFocus>
              Log Out
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
}

export default LogoutBtn;
