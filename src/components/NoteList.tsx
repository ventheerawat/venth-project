import * as React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CreateNote from "./CreateNote";

import RefreshIcon from "@mui/icons-material/Refresh";
import Skeleton from "@mui/material/Skeleton";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow: "none",
  backgroundImage: "none",
  backgroundColor: "transparent",
}));

interface INoteLis {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function NoteList() {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const [notelist, setnotelist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoteListDataAPI();
  }, []);

  async function getNoteListDataAPI() {
    let idToken = sessionStorage.getItem("idToken");
    setLoading(true);
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
    await fetch(import.meta.env.VITE_APP_BASE_URL + "/notes/", {
      headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((responseJson) => {
        setLoading(false);
        setnotelist(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  function RefreshData() {
    setnotelist([]);
    getNoteListDataAPI();
  }

  return (
    isAuthenticated && (
      <>
        <CreateNote
          isDialogOpened={isOpen}
          handleCloseDialog={() => setIsOpen(false)}
          refresh={() => getNoteListDataAPI()}
        ></CreateNote>
        <Container maxWidth="xl">
          <Box sx={{ flexGrow: 1, marginTop: 1 }}>
            <Grid container spacing={0}>
              <React.Fragment>
                <Grid item xs={12} sm={12} lg={12}>
                  <Item>
                    <div className="align-right">
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#7773FB",
                          marginRight: "8px",
                          ":hover": { borderColor: "#6B67FC" },
                        }}
                        onClick={() => RefreshData()}
                      >
                        <RefreshIcon
                          fontSize="small"
                          sx={{ color: "#7773FB" }}
                        ></RefreshIcon>
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleOpen()}
                        sx={{
                          backgroundColor: "#7773FB",
                          ":hover": { backgroundColor: "#6B67FC" },
                        }}
                      >
                        <PostAddIcon
                          fontSize="small"
                          sx={{ marginRight: "8px" }}
                        />{" "}
                        Create Note
                      </Button>
                    </div>
                  </Item>
                </Grid>
              </React.Fragment>
            </Grid>
          </Box>

          {loading && (
            <>
              <Box sx={{ flexGrow: 1, marginTop: 1, marginBottom: 2 }}>
                <Grid container spacing={2}>
                  <React.Fragment>
                    {Array.from({ length: 6 }, (_, i) => (
                      <Grid item xs={6} sm={6} lg={3} key={i}>
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
            </>
          )}

          <Box sx={{ flexGrow: 1, marginTop: 1, marginBottom: 2 }}>
            <Grid container spacing={2}>
              {notelist ? (
                <>
                  {notelist
                    .sort((a: INoteLis, b: INoteLis) => b.id - a.id)
                    .map((data: INoteLis) => (
                      <React.Fragment key={data.id}>
                        <Grid item xs={6} sm={6} lg={3}>
                          <Item>
                            <Link
                              className="note-card-link cursor-pointer"
                              to={"/note/" + data.id}
                            >
                              <div className="note-card">{data.title}</div>
                            </Link>
                          </Item>
                        </Grid>
                      </React.Fragment>
                    ))}
                </>
              ) : null}
            </Grid>
          </Box>
        </Container>
      </>
    )
  );
}

export default NoteList;
