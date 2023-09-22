import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  Box,
  Button,
  Grid,
  styled,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CommentIcon from "@mui/icons-material/Comment";
import AddComment from "./AddComment";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow: "none",
  backgroundImage: "none",
  backgroundColor: "transparent",
}));

interface ICommentList {
  userId: number;
  noteId: number;
  id: number;
  body: string;
}

function CommentList() {
  const { noteId } = useParams();
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    getCommentDataAPI();
  }, []);

  async function getCommentDataAPI() {
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
      import.meta.env.VITE_APP_BASE_URL + "/comments?noteId=" + noteId,
      {
        headers,
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        setCommentList(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AddComment
        isDialogOpened={isOpen}
        handleCloseDialog={() => setIsOpen(false)}
        refresh={() => getCommentDataAPI()}
      ></AddComment>
      <div className="card-comment">
        <Box sx={{ flexGrow: 1, marginTop: 1 }}>
          <Grid container spacing={0}>
            <React.Fragment>
              <Grid item xs={12} sm={8} md={6}>
                <Item>
                  <Typography variant="subtitle1">Comment</Typography>
                </Item>
              </Grid>
              <Grid item xs={12} sm={4} md={6} textAlign={"end"}>
                <Item>
                  <Button
                    sx={{ width: "100%" }}
                    variant="outlined"
                    startIcon={<CommentIcon />}
                    onClick={() => handleOpen()}
                  >
                    Add Comment
                  </Button>
                </Item>
              </Grid>
            </React.Fragment>
          </Grid>
        </Box>
        {commentList.length > 0 ? <Divider sx={{ marginTop: "16px" }} /> : null}

        {commentList.length > 0 ? (
          <>
            <List sx={{ width: "100%" }}>
              {commentList
                .sort((a: ICommentList, b: ICommentList) => b.id - a.id)
                .map((data: ICommentList) => (
                  <React.Fragment key={data.id}>
                    <Link
                      className="note-card-link cursor-pointer"
                      to={"/note/" + noteId + "/comment/" + data.id}
                    >
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            alt={data.body.charAt(0).toUpperCase()}
                            src="#"
                          />
                        </ListItemAvatar>
                        <ListItemText
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              ></Typography>
                              {data.body}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </Link>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
            </List>
          </>
        ) : null}
      </div>
    </>
  );
}

export default CommentList;
