import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import LoaderSpinner from "./LoaderSpinner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";
interface IFormInput {
  noteId: number;
  body: string;
}

interface Props {
  isDialogOpened: any;
  handleCloseDialog: any;
  refresh: any;
}

const AddComment: React.FC<Props> = (props) => {
  const { noteId } = useParams();
  const handleClose = () => {
    props.handleCloseDialog(false);
    reset();
  };

  const schema: any = yup.object({
    noteId: yup.number(),
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
      noteId: Number(noteId),
      body: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    createdNoteAPI(data);
  };

  async function createdNoteAPI(data: IFormInput) {
    props.handleCloseDialog(false);
    setIsLoaderSpinnerOpen(true);
    const idToken = sessionStorage.getItem("idToken");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + idToken,
      },
      body: JSON.stringify(data),
    };
    await fetch(import.meta.env.VITE_APP_BASE_URL + "/comments", requestOptions)
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
        <Dialog open={props.isDialogOpened} fullWidth={true} maxWidth={"sm"}>
          <DialogTitle>Comment</DialogTitle>
          <DialogContent>
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
                  rows={2}
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
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
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

export default AddComment;
