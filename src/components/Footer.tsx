import { Container, Box, Grid, Paper, styled } from "@mui/material";
import React from "react";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow: "none",
  backgroundImage: "none",
  backgroundColor: "transparent",
}));
function Footer() {
  return (
    <>
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
                  <p style={{ color: "#52546b" }}>Copyright © 2023 VENTH.</p>
                </Item>
              </Grid>
            </React.Fragment>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Footer;
