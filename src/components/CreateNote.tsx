import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import LoaderSpinner from "./LoaderSpinner";
import { useAuth0 } from "@auth0/auth0-react";

interface IFormInput {
  title: string;
  body: string;
}

interface Props {
  isDialogOpened: any;
  handleCloseDialog: any;
  refresh: any;
}

const CreateNote: React.FC<Props> = (props) => {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const handleClose = () => {
    props.handleCloseDialog(false);
    reset();
  };

  const schema: any = yup.object({
    title: yup.string().required("This field is required."),
    body: yup.string().required("This field is required."),
  });

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    createdNoteAPI(data);
  };

  async function createdNoteAPI(data: IFormInput) {
    props.handleCloseDialog(false);
    setIsLoaderSpinnerOpen(true);
    let idToken = sessionStorage.getItem("idToken");
    if (!idToken) {
      if (isAuthenticated) {
        await getIdTokenClaims().then((res) => {
          idToken = String(res?.__raw);
        });
      }
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + idToken,
      },
      body: JSON.stringify(data),
    };
    await fetch(import.meta.env.VITE_APP_BASE_URL + "/notes", requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res) {
          props.refresh();
          setIsLoaderSpinnerOpen(false);
        }
      })
      .catch((err) => console.log(err));
  }
  const [isLoaderSpinnerOpen, setIsLoaderSpinnerOpen] = useState(false);
  return (
    <>
      <LoaderSpinner
        isLoaderSpinnerOpened={isLoaderSpinnerOpen}
        handleCloseLoaderSpinner={() => setIsLoaderSpinnerOpen(false)}
      />
      <form>
        <Dialog open={props.isDialogOpened}>
          <DialogTitle>Create Note</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ marginBottom: "16px" }}>
              This feature allows you to compose and save brief pieces of
              information, reminders, or thoughts for future reference. Quickly
              jot down important details or ideas.
            </DialogContentText>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ marginTop: "16px" }}
                  autoFocus
                  margin="dense"
                  label="Tittle"
                  type="text"
                  fullWidth
                  name="title"
                  error={!!errors.title}
                  helperText={errors ? errors.title?.message : null}
                />
              )}
            />
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ marginTop: "16px" }}
                  autoFocus
                  margin="dense"
                  label="Body"
                  type="text"
                  rows={3}
                  multiline
                  fullWidth
                  name="body"
                  error={!!errors.body}
                  helperText={errors ? errors.body?.message : null}
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ padding: "24px" }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderColor: "#7773FB",
                color: "#7773FB",
                marginRight: "8px",
                ":hover": { borderColor: "#6B67FC" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#7773FB",
                ":hover": { backgroundColor: "#6B67FC" },
              }}
              onClick={handleSubmit(onSubmit)}
            >
              Create Note
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
};

export default CreateNote;
