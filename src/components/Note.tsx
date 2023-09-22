import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { useAuth0 } from "@auth0/auth0-react";
import LinearProgress from "@mui/material/LinearProgress";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
} from "@mui/material";

import LoaderSpinner from "./LoaderSpinner";
import CommentList from "./CommentList";

interface INote {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface IDelete {
  message: string;
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow: "none",
  backgroundImage: "none",
  backgroundColor: "transparent",
}));

function Note() {
  const { noteId } = useParams();
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const [noteDetail, setnoteDetail] = useState<INote>();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [statusDeleted, setStatusDeleted] = React.useState(false);
  const [isNoteFound, setIsNoteFound] = React.useState(false);
  const [isLoaderSpinnerOpen, setIsLoaderSpinnerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNoteAPI() {
      setLoading(true);
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

      await fetch(import.meta.env.VITE_APP_BASE_URL + "/notes/" + noteId, {
        headers,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          setIsNoteFound(true);
        })
        .then((responseJson: INote) => {
          setLoading(false);
          setnoteDetail(responseJson);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getNoteAPI();
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function alertConfirmDelete() {
    handleClose();
    setOpenDialog(true);
  }

  async function deleteNoteAPI() {
    setIsLoaderSpinnerOpen(true);
    const idToken = sessionStorage.getItem("idToken");
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + idToken,
      },
    };
    await fetch(
      import.meta.env.VITE_APP_BASE_URL + "/notes/" + noteId,
      requestOptions
    )
      .then((response) => response.json())
      .then((res: IDelete) => {
        if (res.message === "Deleted") {
          setOpenDialog(false);
          setIsLoaderSpinnerOpen(false);
          setStatusDeleted(true);
        }
      })
      .catch((err) => console.log(err));
  }

  function BtnBacktoHome() {
    return (
      <Link to={"/"}>
        <Button variant="outlined">Back to All Notes</Button>
      </Link>
    );
  }
  return (
    <>
      <LoaderSpinner
        isLoaderSpinnerOpened={isLoaderSpinnerOpen}
        handleCloseLoaderSpinner={() => setIsLoaderSpinnerOpen(false)}
      />
      {isLoading && <LinearProgress></LinearProgress>}
      {isAuthenticated && (
        <>
          <Dialog
            fullWidth={true}
            maxWidth={"sm"}
            open={openDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Delete</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure want to delete "{noteDetail?.title}" ?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: "24px" }}>
              <Button variant="contained" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                autoFocus
                onClick={() => deleteNoteAPI()}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <ResponsiveAppBar></ResponsiveAppBar>
          {loading && (
            <>
              <Container maxWidth="xl">
                <Box sx={{ flexGrow: 1, marginTop: 1, marginBottom: 2 }}>
                  <Grid container spacing={2}>
                    {Array.from({ length: 1 }, (_, i) => (
                      <React.Fragment key={i}>
                        <Grid item xs={12} sm={12} lg={8}>
                          <Item>
                            <Skeleton
                              variant="rounded"
                              width={"100%"}
                              height={60}
                            />
                          </Item>
                        </Grid>

                        <Grid item xs={12} sm={12} lg={4}>
                          <Item>
                            <Skeleton
                              variant="rounded"
                              width={"100%"}
                              height={240}
                            />
                          </Item>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Box>
              </Container>
            </>
          )}
          {noteDetail?.id && statusDeleted === false ? (
            <Container maxWidth="xl">
              <Box sx={{ flexGrow: 1, marginTop: 1 }}>
                <Grid container spacing={0}>
                  <React.Fragment>
                    <Grid item xs={12} sm={12} lg={8}>
                      <Item>
                        <div className="note-card">
                          <Box sx={{ flexGrow: 1, marginTop: 0 }}>
                            <Grid container spacing={0}>
                              <React.Fragment>
                                <Grid item xs={11}>
                                  <Item>
                                    <Typography
                                      variant="h6"
                                      gutterBottom
                                      color={"white"}
                                    >
                                      {noteDetail.title}
                                    </Typography>
                                  </Item>
                                </Grid>
                                <Grid item xs={1}>
                                  <Item>
                                    <div className="align-right">
                                      <IconButton
                                        aria-label="settings"
                                        aria-controls={
                                          open ? "basic-menu" : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
                                        onClick={handleClick}
                                      >
                                        <MoreVertIcon className="align-right" />
                                      </IconButton>

                                      <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                          "aria-labelledby": "basic-button",
                                        }}
                                      >
                                        <MenuItem
                                          onClick={() => {
                                            alertConfirmDelete();
                                          }}
                                        >
                                          <DeleteIcon
                                            sx={{ marginRight: "16px" }}
                                          />
                                          Delete This Note
                                        </MenuItem>
                                      </Menu>
                                    </div>
                                  </Item>
                                </Grid>
                              </React.Fragment>
                            </Grid>
                          </Box>
                          <Divider />
                          <Typography variant="body1" gutterBottom mt={3}>
                            {noteDetail.body}
                          </Typography>
                        </div>
                      </Item>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <Item>
                        <CommentList></CommentList>
                      </Item>
                    </Grid>
                  </React.Fragment>
                </Grid>
              </Box>
            </Container>
          ) : null}
          {statusDeleted && (
            <>
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
                          <DeleteForeverTwoToneIcon
                            sx={{ fontSize: "5rem", color: "#7981dd" }}
                          ></DeleteForeverTwoToneIcon>
                        </Item>
                      </Grid>
                      <Grid item xs={12} textAlign={"center"}>
                        <Item>
                          <Typography align="center" variant="h4">
                            Deleted
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "16px", marginBottom: "24px" }}
                          >
                            This note has already been removed. However, you
                            have the ability to generate a new Note.
                          </Typography>
                          <BtnBacktoHome></BtnBacktoHome>
                        </Item>
                      </Grid>
                    </React.Fragment>
                  </Grid>
                </Box>
              </Container>
            </>
          )}
          {isNoteFound && (
            <>
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
                            sx={{ fontSize: "5rem", color: "#7981dd" }}
                          ></SentimentDissatisfiedOutlinedIcon>
                        </Item>
                      </Grid>
                      <Grid item xs={12} textAlign={"center"}>
                        <Item>
                          <Typography align="center" variant="h4">
                            Note is not found.
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ marginTop: "16px", marginBottom: "24px" }}
                          >
                            This note is not found. However, you have the
                            ability to generate a new Note.
                          </Typography>
                          <BtnBacktoHome></BtnBacktoHome>
                        </Item>
                      </Grid>
                    </React.Fragment>
                  </Grid>
                </Box>
              </Container>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Note;
