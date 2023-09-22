import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

interface Props {
  isLoaderSpinnerOpened: any;
  handleCloseLoaderSpinner: any;
}

const LoaderSpinner: React.FC<Props> = (props) => {
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.isLoaderSpinnerOpened}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default LoaderSpinner;
