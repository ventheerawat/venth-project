import { useAuth0 } from "@auth0/auth0-react";
import { Container, Box, Grid, Paper, styled, Typography } from "@mui/material";
import React from "react";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow: "none",
  backgroundImage: "none",
  backgroundColor: "transparent",
}));
function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    <>
      {!isAuthenticated && (
        <div className="Login-page">
          <Container maxWidth="xl">
            <Box sx={{ flexGrow: 1, marginTop: 0 }}>
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
                      <Typography
                        variant="h1"
                        noWrap
                        sx={{
                          fontFamily: "Helvetica Neue",
                          letterSpacing: ".5rem",
                          color: "white",
                          textDecoration: "none",
                          marginBottom: "20px",
                        }}
                      >
                        Notes
                      </Typography>
                      <Typography sx={{ marginBottom: "45px" }} color={"white"}>
                        Welcome to Notes, your go-to digital notepad for
                        capturing ideas, thoughts, and important information
                        effortlessly. Whether you're a student, professional, or
                        creative mind, Notes is designed to help you organize
                        your life with simplicity and efficiency.
                      </Typography>
                      <button
                        className="btn_login"
                        onClick={() => loginWithRedirect()}
                      >
                        Log In
                      </button>
                    </Item>
                  </Grid>
                </React.Fragment>
              </Grid>
            </Box>
          </Container>
        </div>
      )}
    </>
  );
}

export default LoginPage;
