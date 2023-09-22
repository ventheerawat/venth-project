import { styled, Paper, Button } from "@mui/material";
import React from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { Container, Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";

export const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow: "none",
  backgroundImage: "none",
  backgroundColor: "transparent",
}));

export function PageNotFound() {
  return (
    <>
      <ResponsiveAppBar></ResponsiveAppBar>
      <Container>
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
          <Grid container spacing={0}>
            <React.Fragment>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Item>
                  <SentimentDissatisfiedOutlinedIcon
                    sx={{ fontSize: "5rem" }}
                  ></SentimentDissatisfiedOutlinedIcon>
                </Item>
              </Grid>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              ></Grid>
              <Grid item xs={12} textAlign={"center"}>
                <Item>
                  <Typography align="center" variant="h2">
                    404
                  </Typography>
                  <Typography align="center" variant="h4">
                    Page is not found.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ marginTop: "16px", marginBottom: "24px" }}
                  >
                    Don't worry, you haven't broken anything. It's just that
                    this page doesn't exist anymore or may have never existed in
                    the first place. Perhaps you mistyped the URL, or maybe the
                    page you were looking for has been relocated.
                  </Typography>
                  <Typography>
                    Go back to our All Notes page and explore from there.
                  </Typography>
                  <Link to={"/"}>
                    <Button
                      variant="outlined"
                      sx={{ marginTop: "16px", marginBottom: "24px" }}
                    >
                      Back to All Notes
                    </Button>
                  </Link>
                </Item>
              </Grid>
            </React.Fragment>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default PageNotFound;
