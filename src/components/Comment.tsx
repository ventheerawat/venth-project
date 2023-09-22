import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ResponsiveAppBar from "./ResponsiveAppBar";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Typography,
  styled,
} from "@mui/material";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import LoaderSpinner from "./LoaderSpinner";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";

interface IComment {
  userId: number;
  noteId: number;
  id: number;
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
function Comment() {
  let { noteId, commentId } = useParams();
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const [commentDetail, setcommentDetail] = useState<IComment>();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isNoteFound, setIsNoteFound] = React.useState(false);
  const [statusDeleted, setStatusDeleted] = React.useState(false);
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

      await fetch(
        import.meta.env.VITE_APP_BASE_URL + "/comments/" + commentId,
        {
          headers,
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          setIsNoteFound(true);
        })
        .then((responseJson: IComment) => {
          setcommentDetail(responseJson);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getNoteAPI();
  }, []);

  function deleteComment() {
    setOpenDialog(true);
  }

  async function deleteCommentAPI() {
    setOpenDialog(false);
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
      import.meta.env.VITE_APP_BASE_URL + "/comments/" + commentId,
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

  function BtnBacktoNote() {
    return (
      <Link to={"/note/" + noteId}>
        <Button variant="outlined">Back</Button>
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
      <ResponsiveAppBar></ResponsiveAppBar>
      {loading && (
        <>
          <Container maxWidth="xl">
            <Box sx={{ flexGrow: 1, marginTop: 1, marginBottom: 2 }}>
              <Grid container spacing={2}>
                <React.Fragment>
                  {Array.from({ length: 1 }, (_, i) => (
                    <Grid item xs={12} key={i}>
                      <Item>
                        <Skeleton
                          variant="rounded"
                          width={"100%"}
                          height={60}
                        />
                      </Item>
                    </Grid>
                  ))}
                </React.Fragment>
              </Grid>
            </Box>
          </Container>
        </>
      )}
      {commentDetail?.id && statusDeleted === false ? (
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
                Are you sure want to delete this comment ?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: "24px" }}>
              <Button variant="contained" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                autoFocus
                onClick={() => deleteCommentAPI()}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Container maxWidth="xl">
            <Box sx={{ flexGrow: 1, marginTop: 1 }}>
              <Grid container spacing={0}>
                <React.Fragment>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Item>
                      <Link to={"/note/" + noteId}>
                        <Button variant="text">
                          <ArrowBackIosRoundedIcon
                            fontSize="small"
                            sx={{ marginRight: "8px" }}
                          ></ArrowBackIosRoundedIcon>{" "}
                          BACK
                        </Button>
                      </Link>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Item>
                      <div className="note-card">{commentDetail?.body}</div>
                    </Item>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={12}
                    display={"flex"}
                    justifyContent={"end"}
                  >
                    <Item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => deleteComment()}
                      >
                        <ClearIcon fontSize="small"></ClearIcon>
                        delete
                      </Button>
                    </Item>
                  </Grid>
                </React.Fragment>
              </Grid>
            </Box>
          </Container>
        </>
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
                        This comment has already been removed. However, you have
                        the ability to generate a new Comment.
                      </Typography>
                      <BtnBacktoNote></BtnBacktoNote>
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
                        Comment is not found.
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ marginTop: "16px", marginBottom: "24px" }}
                      >
                        This comment is not found. However, you have the ability
                        to generate a new comment.
                      </Typography>
                      <BtnBacktoNote></BtnBacktoNote>
                    </Item>
                  </Grid>
                </React.Fragment>
              </Grid>
            </Box>
          </Container>
        </>
      )}
    </>
  );
}

export default withAuthenticationRequired(Comment, {
  onRedirecting: () => <LinearProgress />,
});

// export default Comment;
