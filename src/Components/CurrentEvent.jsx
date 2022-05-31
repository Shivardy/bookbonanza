import {
  Alert,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { actionTypes, appContext } from "../AppContext";
import { addEventUser, deleteEventUser, getEventUsers } from "../firebase";

const columns = [
  { field: "firstName", headerName: "First Name", width: 200 },
  { field: "lastName", headerName: "Last Name", width: 200 },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column is not sortable.",
    sortable: false,
    width: 250,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
  {
    field: "delete",
    headerName: "Delete",
    sortable: false,
    renderCell: (params) => {
      const handleClick = (event, params) => {
        event.stopPropagation();
        deleteEventUser(params.row.eventId, params.id);
      };

      return (
        <Button
          variant="outlined"
          color="error"
          onClick={(event) => handleClick(event, params)}
        >
          Delete
        </Button>
      );
    },
  },
];

const CurrentEvent = () => {
  let { eventId } = useParams();
  const { dispatch, users, events } = appContext();
  const [openSnack, setOpenSnack] = useState(false);

  const currentEvent = events.find((event) => event.id === eventId);
  useEffect(() => {
    const usersStream = getEventUsers(eventId);
    usersStream((users) => {
      dispatch({
        type: actionTypes.FETCH_EVENT_USERS,
        payload: users.map((user) => ({ ...user, eventId })),
      });
    });
  }, [dispatch, eventId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const data = {
      firstName,
      lastName,
      currentProgress: {
        from: 0,
        to: 0,
      },
      updatedAt: Timestamp.fromDate(new Date()),
    };
    await addEventUser(eventId, data);
    setOpenSnack(true);
    e.target.reset();
  };
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      width={"100%"}
      spacing={2}
    >
      <Typography variant="h5" component="div">
        Event: {currentEvent?.eventName}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2}>
          <TextField required label="Enter First Name" variant="standard" />
          <TextField required label="Enter Last Name" variant="standard" />
          <Button variant="contained" type="submit" size="small">
            Add User
          </Button>
          <Snackbar
            open={openSnack}
            autoHideDuration={3000}
            onClose={() => setOpenSnack(false)}
          >
            <Alert onClose={() => setOpenSnack(false)} severity="success">
              SuccessFully Updated
            </Alert>
          </Snackbar>
        </Stack>
      </form>
      <div
        style={{
          height: "73vh",
          width: "80%",
        }}
      >
        <DataGrid rows={users} columns={columns} disableColumnMenu={true} />
      </div>
    </Stack>
  );
};

export default CurrentEvent;
