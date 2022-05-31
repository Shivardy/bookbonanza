import {
  Alert,
  Autocomplete,
  Button,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { actionTypes, appContext } from "../AppContext";
import { getEventUsers, updateStatus } from "../firebase";

const GuestForm = () => {
  const { events, users, dispatch } = appContext();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [toError, setToError] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);

  const handleSubmit = async () => {
    const { firstName, lastName } = selectedUser;
    await updateStatus(selectedEvent?.id, selectedUser?.id, {
      firstName,
      lastName,
      currentProgress: { from, to },
      updatedAt: Timestamp.fromDate(new Date()),
    });
    setOpenSnack(true);
  };

  useEffect(() => {
    setDisableSubmit(!(selectedEvent && selectedUser && from !== "" && to));
  }, [from, selectedEvent, selectedUser, to]);

  useEffect(() => {
    if (selectedEvent) {
      const usersStream = getEventUsers(selectedEvent?.id);
      usersStream((users) => {
        dispatch({
          type: actionTypes.FETCH_EVENT_USERS,
          payload: users.map((user) => ({
            ...user,
            eventId: selectedEvent?.id,
          })),
        });
      });
    } else {
      dispatch({
        type: actionTypes.FETCH_EVENT_USERS,
        payload: [],
      });
      setSelectedUser(null);
    }
  }, [dispatch, selectedEvent, selectedEvent?.id, selectedUser]);

  return (
    <Stack justifyContent="center" alignItems="center" padding="3%">
      <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
        Fill in your details
      </Typography>

      <Stack spacing={3}>
        <Autocomplete
          disablePortal
          value={selectedEvent}
          getOptionLabel={(event) => event.eventName}
          onChange={(event, newValue) => {
            setSelectedEvent(newValue);
            setSelectedUser(null);
            setTo(null);
            setFrom(null);
          }}
          options={events}
          renderInput={(params) => (
            <TextField {...params} required label="Enter Event Name" />
          )}
        />
        <Autocomplete
          disablePortal
          options={users}
          getOptionLabel={({ firstName, lastName }) =>
            `${firstName} ${lastName}`
          }
          disabled={!users.length}
          value={selectedUser}
          onChange={(event, newValue) => {
            setSelectedUser(newValue);
            setFrom(newValue?.currentProgress?.from || null);
            setTo(newValue?.currentProgress?.to || null);
          }}
          renderInput={(params) => (
            <TextField {...params} required label="Enter User Name" />
          )}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            type="number"
            label="Enter Start Number"
            value={from ?? ""}
            required
            inputProps={{ min: 0 }}
            disabled={!users.length}
            onChange={(e) => setFrom(+e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">From</InputAdornment>
              ),
            }}
          />

          <TextField
            type="number"
            error={!!toError}
            helperText={toError}
            label="Enter End Number"
            required
            inputProps={{ min: 0 }}
            disabled={!users.length}
            onChange={(e) => setTo(+e.target.value)}
            onBlur={(e) =>
              setToError(to <= from ? "To value should be above From" : null)
            }
            value={to ?? ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">To</InputAdornment>
              ),
            }}
          />
        </Stack>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={disableSubmit}
        >
          Submit
        </Button>
        <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
          To view current status of participants{" "}
          <Link to="/display">Click Here</Link>
        </Typography>
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
    </Stack>
  );
};

export default GuestForm;
