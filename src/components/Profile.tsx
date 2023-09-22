import {
  Container,
  Box,
  Grid,
  Typography,
  Paper,
  styled,
  Avatar,
  Button,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { useAuth0 } from "@auth0/auth0-react";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow: "none",
  backgroundImage: "none",
  backgroundColor: "transparent",
}));

interface IProfile {
  id: number;
  nickname: string;
  name: string;
  picture: string;
  email: string;
}

function Profile() {
  const { isAuthenticated, isLoading, getIdTokenClaims, logout } = useAuth0();
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = useState<IProfile>();
  useEffect(() => {
    async function getProfileAPI() {
      let idToken = sessionStorage.getItem("idToken");
      if (!idToken) {
        if (isAuthenticated) {
          await getIdTokenClaims().then((res) => {
            idToken = String(res?.__raw);
          });
        }
      }

      const headers = {
        authorization: "Bearer " + idToken,
        accept: "application/json",
      };

      await fetch(import.meta.env.VITE_APP_BASE_URL + "/profile", {
        headers,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((responseJson: IProfile) => {
          setProfile(responseJson);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getProfileAPI();
  }, []);

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
    <>
      {isLoading && <LinearProgress></LinearProgress>}
      {isAuthenticated && (
        <>
          <ResponsiveAppBar></ResponsiveAppBar>
          <Container maxWidth="xl">
            <Box sx={{ flexGrow: 1, marginTop: 5 }}>
              <Grid
                container
                spacing={0}
                display={"flex"}
                justifyContent={"center"}
              >
                <React.Fragment>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={7}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    textAlign={"center"}
                  >
                    <Item>
                      <Avatar
                        sx={{ width: 92, height: 92 }}
                        alt="Remy Sharp"
                        src={profile?.picture}
                      />
                    </Item>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={7}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    textAlign={"center"}
                  >
                    <Item>
                      <Typography variant="h5" sx={{ marginTop: "16px" }}>
                        {profile?.name}
                      </Typography>
                      <Typography sx={{ marginTop: "16px" }}>
                        {profile?.nickname}
                      </Typography>
                      <Typography sx={{ marginTop: "16px" }}>
                        {profile?.email}
                      </Typography>
                      <Button
                        sx={{ marginTop: "32px" }}
                        variant="outlined"
                        onClick={() => handleClickOpen()}
                      >
                        Log Out
                      </Button>
                    </Item>
                  </Grid>
                </React.Fragment>
              </Grid>
            </Box>
          </Container>
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
      )}
    </>
  );
}

export default Profile;
